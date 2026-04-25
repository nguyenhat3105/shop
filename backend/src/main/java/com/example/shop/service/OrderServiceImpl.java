package com.example.shop.service;

import com.example.shop.dto.OrderItemRequest;
import com.example.shop.dto.OrderItemResponse;
import com.example.shop.dto.OrderRequest;
import com.example.shop.dto.OrderResponse;
import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.Product;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
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
    private final com.example.shop.repository.CouponRepository couponRepository;
    private final EmailService emailService;
    private final com.example.shop.repository.ProductVariantRepository variantRepository;

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
            
            // Xử lý tồn kho
            String size = null;
            String color = null;

            if (itemReq.getProductVariantId() != null) {
                com.example.shop.entity.ProductVariant variant = variantRepository.findById(itemReq.getProductVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Biến thể sản phẩm", itemReq.getProductVariantId()));
                
                if (variant.getStock() < itemReq.getQuantity()) {
                    throw new IllegalArgumentException("Biến thể '" + product.getName() + " - " + variant.getSize() + "/" + variant.getColor() + "' không đủ tồn kho (Còn: " + variant.getStock() + ").");
                }
                variant.setStock(variant.getStock() - itemReq.getQuantity());
                variantRepository.save(variant);
                
                size = variant.getSize();
                color = variant.getColor();
            } else {
                if (product.getStock() < itemReq.getQuantity()) {
                    throw new IllegalArgumentException("Sản phẩm '" + product.getName() + "' không đủ số lượng tồn kho (Còn: " + product.getStock() + ").");
                }
                product.setStock(product.getStock() - itemReq.getQuantity());
                productRepository.save(product);
            }

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice()) // Use DB price for security
                    .size(size)
                    .color(color)
                    .build();
            
            calculatedTotal = calculatedTotal.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
            items.add(item);
        }

        // Xử lý mã giảm giá
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            com.example.shop.entity.Coupon coupon = couponRepository.findByCode(request.getCouponCode()).orElse(null);
            if (coupon != null && coupon.getIsActive() && coupon.getExpirationDate().isAfter(java.time.LocalDateTime.now())) {
                if (coupon.getMinOrderValue() == null || calculatedTotal.compareTo(coupon.getMinOrderValue()) >= 0) {
                    if (coupon.getDiscountType() == com.example.shop.entity.Coupon.DiscountType.PERCENT) {
                        BigDecimal discountAmount = calculatedTotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
                        calculatedTotal = calculatedTotal.subtract(discountAmount);
                    } else if (coupon.getDiscountType() == com.example.shop.entity.Coupon.DiscountType.FIXED) {
                        calculatedTotal = calculatedTotal.subtract(coupon.getDiscountValue());
                    }
                    if (calculatedTotal.compareTo(BigDecimal.ZERO) < 0) {
                        calculatedTotal = BigDecimal.ZERO;
                    }
                }
            }
        }

        order.setTotalAmount(calculatedTotal);
        order.setItems(items); // CascadeType.ALL will save items

        Order savedOrder = orderRepository.save(order);
        
        // Gửi email nếu là COD (VNPay sẽ gửi email trong callback webhook)
        if ("COD".equalsIgnoreCase(savedOrder.getPaymentMethod())) {
            emailService.sendOrderConfirmationEmail(savedOrder);
        }

        return mapToResponse(savedOrder);
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", id));
        return mapToResponse(order);
    }

    @Override
    public Page<OrderResponse> getOrdersByEmail(String email, Pageable pageable) {
        return orderRepository.findByCustomerEmail(email, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", id));
        
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        
        // Hoàn lại stock nếu đơn bị huỷ (và trước đó chưa bị huỷ)
        if (newStatus == Order.OrderStatus.CANCELLED && order.getStatus() != Order.OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                // Tạm thời cộng lại vào Product chung, nếu cần chi tiết hơn phải lưu VariantId trong OrderItem
                Product p = item.getProduct();
                p.setStock(p.getStock() + item.getQuantity());
                productRepository.save(p);
            }
        }
        
        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::mapToResponse);
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
