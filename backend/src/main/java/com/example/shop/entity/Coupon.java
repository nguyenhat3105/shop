package com.example.shop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType; // PERCENT hoặc FIXED

    @Column(nullable = false)
    private BigDecimal discountValue;

    private BigDecimal minOrderValue;

    @Column(nullable = false)
    private LocalDateTime expirationDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // ─── Usage tracking ───
    @Column(name = "max_usage")
    private Integer maxUsage; // null = unlimited

    @Column(name = "used_count", nullable = false)
    @Builder.Default
    private Integer usedCount = 0;

    @Column(name = "max_usage_per_user")
    private Integer maxUsagePerUser; // null = unlimited per user

    public enum DiscountType {
        PERCENT, FIXED
    }

    /** Tính toán số tiền giảm giá */
    public BigDecimal calculateDiscount(BigDecimal orderValue) {
        if (discountType == DiscountType.PERCENT) {
            return orderValue.multiply(discountValue).divide(BigDecimal.valueOf(100));
        }
        return discountValue.min(orderValue); // FIXED, không được vượt tổng đơn
    }

    /** Kiểm tra coupon có hợp lệ với đơn hàng này không */
    public boolean isValidFor(BigDecimal orderValue) {
        if (!isActive) return false;
        if (expirationDate.isBefore(LocalDateTime.now())) return false;
        if (maxUsage != null && usedCount >= maxUsage) return false;
        if (minOrderValue != null && orderValue.compareTo(minOrderValue) < 0) return false;
        return true;
    }
}
