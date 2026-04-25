package com.example.shop.service;

import com.example.shop.dto.OrderRequest;
import com.example.shop.dto.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse getOrderById(Long id);
    Page<OrderResponse> getOrdersByEmail(String email, Pageable pageable);
    OrderResponse updateOrderStatus(Long id, String status);
}
