package com.example.shop.controller;

import com.example.shop.dto.CouponResponse;
import com.example.shop.entity.Coupon;
import com.example.shop.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    /**
     * GET /api/coupons/validate?code=XXX&orderValue=500000
     * Trả về thông tin coupon + discountAmount (số tiền giảm thực tế)
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal orderValue) {

        Coupon coupon = couponRepository.findByCode(code.toUpperCase()).orElse(null);

        if (coupon == null || !coupon.getIsActive()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Mã giảm giá không hợp lệ."));
        }

        if (coupon.getExpirationDate() != null && coupon.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Mã giảm giá đã hết hạn."));
        }

        if (coupon.getMinOrderValue() != null && orderValue.compareTo(coupon.getMinOrderValue()) < 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", String.format(
                            "Đơn hàng tối thiểu %,.0f₫ để dùng mã này.", coupon.getMinOrderValue())));
        }

        // Kiểm tra số lần dùng tối đa
        if (coupon.getMaxUsage() != null && coupon.getUsedCount() >= coupon.getMaxUsage()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Mã giảm giá đã được dùng hết."));
        }

        // Tính discountAmount thực tế
        BigDecimal discountAmount;
        if ("PERCENT".equalsIgnoreCase(coupon.getDiscountType().name())) {
            discountAmount = orderValue
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.FLOOR);
        } else {
            // FIXED
            discountAmount = coupon.getDiscountValue().min(orderValue);
        }

        return ResponseEntity.ok(CouponResponse.builder()
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType().name())
                .discountValue(coupon.getDiscountValue())
                .minOrderValue(coupon.getMinOrderValue())
                .discountAmount(discountAmount)
                .build());
    }
}
