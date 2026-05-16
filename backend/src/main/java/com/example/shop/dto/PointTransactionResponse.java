package com.example.shop.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointTransactionResponse {
    private Long id;
    private String type;      // EARN | REDEEM
    private Integer points;
    private String description;
    private Long orderId;
    private LocalDateTime createdAt;
}
