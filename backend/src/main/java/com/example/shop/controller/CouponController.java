package com.example.shop.controller;

import com.example.shop.dto.CouponResponse;
import com.example.shop.entity.Coupon;
import com.example.shop.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal orderValue) {

        Coupon coupon = couponRepository.findByCode(code).orElse(null);

        if (coupon == null || !coupon.getIsActive() || coupon.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        }

        if (coupon.getMinOrderValue() != null && orderValue.compareTo(coupon.getMinOrderValue()) < 0) {
            return ResponseEntity.badRequest().body("Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này.");
        }

        return ResponseEntity.ok(CouponResponse.builder()
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType().name())
                .discountValue(coupon.getDiscountValue())
                .minOrderValue(coupon.getMinOrderValue())
                .build());
    }
}
