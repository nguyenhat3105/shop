package com.example.shop.controller;

import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> data = new HashMap<>();
        
        data.put("totalRevenue", orderRepository.sumTotalRevenue());
        data.put("totalOrders", orderRepository.count());
        data.put("totalProducts", productRepository.count());
        data.put("totalUsers", userRepository.count());
        data.put("monthlyRevenue", orderRepository.getMonthlyRevenue());

        return ResponseEntity.ok(data);
    }
}
