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
    private String code; // Ví dụ: TET2026, FREESHIP

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType; // PERCENT hoặc FIXED

    @Column(nullable = false)
    private BigDecimal discountValue; // Ví dụ: 10 (%) hoặc 50000 (VNĐ)

    private BigDecimal minOrderValue; // Đơn hàng tối thiểu để được áp dụng

    @Column(nullable = false)
    private LocalDateTime expirationDate; // Ngày hết hạn

    @Column(nullable = false)
    private Boolean isActive = true;

    public enum DiscountType {
        PERCENT, FIXED
    }
}
