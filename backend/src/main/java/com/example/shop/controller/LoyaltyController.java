package com.example.shop.controller;

import com.example.shop.dto.PointTransactionResponse;
import com.example.shop.repository.UserRepository;
import com.example.shop.service.LoyaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {

    private final LoyaltyService loyaltyService;
    private final UserRepository userRepository;

    /** GET /api/loyalty/balance — Số điểm hiện tại */
    @GetMapping("/balance")
    public ResponseEntity<Map<String, Object>> getBalance(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        int balance = loyaltyService.getBalance(userId);
        return ResponseEntity.ok(Map.of(
                "points", balance,
                "equivalentVND", (balance / 100) * 10000
        ));
    }

    /** GET /api/loyalty/history — Lịch sử điểm */
    @GetMapping("/history")
    public ResponseEntity<Page<PointTransactionResponse>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long userId = getUserId(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(loyaltyService.getHistory(userId, pageable));
    }

    /** POST /api/loyalty/redeem — Đổi điểm lấy voucher */
    @PostMapping("/redeem")
    public ResponseEntity<Map<String, Object>> redeemPoints(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Integer> body) {

        int points = body.getOrDefault("points", 0);
        Long userId = getUserId(userDetails);
        String couponCode = loyaltyService.redeemPoints(userId, points);

        return ResponseEntity.ok(Map.of(
                "couponCode", couponCode,
                "message", "Đổi điểm thành công! Mã voucher: " + couponCode + " (hiệu lực 30 ngày)"
        ));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"))
                .getId();
    }
}
