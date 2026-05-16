package com.example.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Ghi lại từng giao dịch điểm thưởng của user.
 * EARN = tích điểm khi mua hàng
 * REDEEM = đổi điểm lấy voucher
 */
@Entity
@Table(name = "point_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TransactionType type; // EARN | REDEEM

    @Column(nullable = false)
    private Integer points; // số điểm thêm vào (EARN) hoặc trừ đi (REDEEM)

    @Column(length = 255)
    private String description; // "Mua đơn hàng #42" hoặc "Đổi 100 điểm → voucher REWARD_xxx"

    @Column(name = "order_id")
    private Long orderId; // nullable, liên kết với đơn hàng nếu là EARN

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum TransactionType {
        EARN, REDEEM
    }
}
