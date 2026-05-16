package com.example.shop.service;

import com.example.shop.dto.PointTransactionResponse;
import com.example.shop.entity.Coupon;
import com.example.shop.entity.PointTransaction;
import com.example.shop.entity.User;
import com.example.shop.repository.CouponRepository;
import com.example.shop.repository.PointTransactionRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyServiceImpl implements LoyaltyService {

    // Tỷ lệ tích điểm: 1.000đ = 1 điểm
    private static final int EARN_RATE = 1000;
    // Tỷ lệ đổi điểm: 100 điểm = 10.000đ
    private static final int REDEEM_RATE = 100;       // 100 điểm
    private static final int REDEEM_VALUE = 10_000;   // = 10.000đ
    private static final int MIN_REDEEM = 100;         // tối thiểu 100 điểm/lần đổi

    private final UserRepository userRepository;
    private final PointTransactionRepository transactionRepository;
    private final CouponRepository couponRepository;

    @Override
    @Transactional
    public void earnPoints(Long userId, BigDecimal orderAmount, Long orderId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        int earned = orderAmount.divide(BigDecimal.valueOf(EARN_RATE), 0,
                java.math.RoundingMode.FLOOR).intValue();
        if (earned <= 0) return;

        user.setLoyaltyPoints(user.getLoyaltyPoints() + earned);
        userRepository.save(user);

        transactionRepository.save(PointTransaction.builder()
                .user(user)
                .type(PointTransaction.TransactionType.EARN)
                .points(earned)
                .description("Tích điểm từ đơn hàng #" + orderId)
                .orderId(orderId)
                .build());

        log.info("User {} earned {} points from order {}", userId, earned, orderId);
    }

    @Override
    @Transactional
    public String redeemPoints(Long userId, int points) {
        if (points < MIN_REDEEM) {
            throw new IllegalArgumentException("Cần ít nhất " + MIN_REDEEM + " điểm để đổi.");
        }
        if (points % REDEEM_RATE != 0) {
            throw new IllegalArgumentException("Số điểm phải là bội số của " + REDEEM_RATE + ".");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user."));

        if (user.getLoyaltyPoints() < points) {
            throw new IllegalArgumentException("Không đủ điểm. Số điểm hiện tại: " + user.getLoyaltyPoints());
        }

        // Tính giá trị voucher
        int voucherValue = (points / REDEEM_RATE) * REDEEM_VALUE;

        // Tạo coupon tự động
        String code = "REWARD_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Coupon coupon = Coupon.builder()
                .code(code)
                .discountType(Coupon.DiscountType.FIXED)
                .discountValue(BigDecimal.valueOf(voucherValue))
                .isActive(true)
                .maxUsage(1)
                .usedCount(0)
                .expirationDate(LocalDateTime.now().plusDays(30))
                .build();
        couponRepository.save(coupon);

        // Trừ điểm
        user.setLoyaltyPoints(user.getLoyaltyPoints() - points);
        userRepository.save(user);

        // Ghi lịch sử
        transactionRepository.save(PointTransaction.builder()
                .user(user)
                .type(PointTransaction.TransactionType.REDEEM)
                .points(-points)
                .description("Đổi " + points + " điểm → voucher " + code + " (trị giá "
                        + String.format("%,d", voucherValue) + "đ)")
                .build());

        log.info("User {} redeemed {} points for coupon {}", userId, points, code);
        return code;
    }

    @Override
    @Transactional(readOnly = true)
    public int getBalance(Long userId) {
        return userRepository.findById(userId)
                .map(User::getLoyaltyPoints)
                .orElse(0);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PointTransactionResponse> getHistory(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user."));
        return transactionRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(t -> PointTransactionResponse.builder()
                        .id(t.getId())
                        .type(t.getType().name())
                        .points(t.getPoints())
                        .description(t.getDescription())
                        .orderId(t.getOrderId())
                        .createdAt(t.getCreatedAt())
                        .build());
    }
}
