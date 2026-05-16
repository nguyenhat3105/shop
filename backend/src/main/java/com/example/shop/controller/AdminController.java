package com.example.shop.controller;

import com.example.shop.entity.Order;
import com.example.shop.entity.Order.OrderStatus;
import com.example.shop.entity.Product;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminController {

    private final OrderRepository   orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository    userRepository;

    /** GET /api/admin/analytics — tổng quan (cached 10 phút) */
    @GetMapping
    @Cacheable("analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalRevenue",    orderRepository.sumTotalRevenue());
        data.put("totalOrders",     orderRepository.count());
        data.put("totalProducts",   productRepository.count());
        data.put("totalUsers",      userRepository.count());
        data.put("monthlyRevenue",  orderRepository.getMonthlyRevenue());
        data.put("todayRevenue",    orderRepository.getTodayRevenue());
        data.put("todayOrders",     orderRepository.countTodayOrders());
        data.put("orderStatusDist", orderRepository.getOrderStatusDistribution());
        return ResponseEntity.ok(data);
    }

    /** GET /api/admin/analytics/daily?days=30 — doanh thu N ngày gần nhất */
    @GetMapping("/daily")
    public ResponseEntity<List<Map<String, Object>>> getDailyRevenue(
            @RequestParam(defaultValue = "30") int days) {

        LocalDateTime from = LocalDateTime.now().minusDays(days);
        List<Order> orders = orderRepository.findByCreatedAtBetween(from, LocalDateTime.now());

        // Group by date
        Map<LocalDate, BigDecimal> grouped = new TreeMap<>();
        for (Order o : orders) {
            LocalDate d = o.getCreatedAt().toLocalDate();
            grouped.merge(d, o.getTotalAmount(), BigDecimal::add);
        }

        // Fill missing days with 0
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusDays(i);
            result.add(Map.of(
                    "date",    d.toString(),
                    "revenue", grouped.getOrDefault(d, BigDecimal.ZERO)
            ));
        }
        return ResponseEntity.ok(result);
    }

    /** GET /api/admin/analytics/top-products?limit=5 */
    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(orderRepository.getTopSellingProducts(limit));
    }

    /** GET /api/admin/analytics/order-status */
    @GetMapping("/order-status")
    public ResponseEntity<List<Map<String, Object>>> getOrderStatus() {
        return ResponseEntity.ok(orderRepository.getOrderStatusDistribution());
    }
}
