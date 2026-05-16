package com.example.shop.service;

import com.example.shop.dto.PointTransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoyaltyService {

    /** Tích điểm sau khi tạo order thành công. 1.000đ = 1 điểm */
    void earnPoints(Long userId, java.math.BigDecimal orderAmount, Long orderId);

    /** Đổi điểm thành voucher. 100 điểm = 10.000đ (FIXED coupon) */
    String redeemPoints(Long userId, int points);

    /** Số điểm hiện tại của user */
    int getBalance(Long userId);

    /** Lịch sử giao dịch điểm */
    Page<PointTransactionResponse> getHistory(Long userId, Pageable pageable);
}
