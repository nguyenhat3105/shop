package com.example.shop.service;

import com.example.shop.dto.OrderItemRequest;
import com.example.shop.dto.OrderItemResponse;
import com.example.shop.dto.OrderRequest;
import com.example.shop.dto.OrderResponse;
import com.example.shop.entity.*;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final CouponRepository couponRepository;
    private final EmailService emailService;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final LoyaltyService loyaltyService;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .status(Order.OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD")
                .couponCode(request.getCouponCode())
                .build();

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", itemReq.getProductId()));

            String size = null;
            String color = null;

            if (itemReq.getProductVariantId() != null) {
                ProductVariant variant = variantRepository.findById(itemReq.getProductVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Biến thể", itemReq.getProductVariantId()));
                if (variant.getStock() < itemReq.getQuantity()) {
                    throw new IllegalArgumentException("Biến thể '" + product.getName()
                            + " - " + variant.getSize() + "/" + variant.getColor()
                            + "' không đủ tồn kho (Còn: " + variant.getStock() + ").");
                }
                variant.setStock(variant.getStock() - itemReq.getQuantity());
                variantRepository.save(variant);
                size = variant.getSize();
                color = variant.getColor();
            } else {
                if (product.getStock() < itemReq.getQuantity()) {
                    throw new IllegalArgumentException("Sản phẩm '" + product.getName()
                            + "' không đủ số lượng (Còn: " + product.getStock() + ").");
                }
                product.setStock(product.getStock() - itemReq.getQuantity());
                productRepository.save(product);
            }

            // Dùng giá hiệu lực (sale nếu đang flash sale)
            BigDecimal unitPrice = product.getEffectivePrice();

            items.add(OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .size(size).color(color)
                    .productVariantId(itemReq.getProductVariantId())
                    .build());

            calculatedTotal = calculatedTotal.add(unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }

        // ─── Xử lý mã giảm giá ───
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode()).orElse(null);
            if (coupon != null && coupon.isValidFor(calculatedTotal)) {
                calculatedTotal = calculatedTotal.subtract(coupon.calculateDiscount(calculatedTotal));
                if (calculatedTotal.compareTo(BigDecimal.ZERO) < 0) calculatedTotal = BigDecimal.ZERO;
                // Tăng usedCount
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                couponRepository.save(coupon);
            }
        }

        order.setTotalAmount(calculatedTotal);
        order.setItems(items);
        Order savedOrder = orderRepository.save(order);

        // ─── Tích điểm loyalty ───
        userRepository.findByEmail(request.getCustomerEmail()).ifPresent(user ->
                loyaltyService.earnPoints(user.getId(), savedOrder.getTotalAmount(), savedOrder.getId())
        );

        if ("COD".equalsIgnoreCase(savedOrder.getPaymentMethod())) {
            emailService.sendOrderConfirmationEmail(savedOrder);
        }

        return mapToResponse(savedOrder);
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        return mapToResponse(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", id)));
    }

    @Override
    public Page<OrderResponse> getOrdersByEmail(String email, Pageable pageable) {
        return orderRepository.findByCustomerEmail(email, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", id));
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());

        if (newStatus == Order.OrderStatus.CANCELLED && order.getStatus() != Order.OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                if (item.getProductVariantId() != null) {
                    variantRepository.findById(item.getProductVariantId()).ifPresent(v -> {
                        v.setStock(v.getStock() + item.getQuantity());
                        variantRepository.save(v);
                    });
                } else {
                    Product p = item.getProduct();
                    p.setStock(p.getStock() + item.getQuantity());
                    productRepository.save(p);
                }
            }
        }

        order.setStatus(newStatus);
        return mapToResponse(orderRepository.save(order));
    }

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::mapToResponse);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImageUrl(item.getProduct().getImageUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .size(item.getSize())
                        .color(item.getColor())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .phone(order.getPhone())
                .address(order.getAddress())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }
}
