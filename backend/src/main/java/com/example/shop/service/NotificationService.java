package com.example.shop.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Service phát thông báo realtime qua WebSocket/STOMP.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Thông báo admin khi có đơn hàng mới.
     * Admin subscribe: /topic/admin/orders
     */
    public void notifyNewOrder(Long orderId, String customerName, double total) {
        Map<String, Object> payload = Map.of(
                "type",         "NEW_ORDER",
                "orderId",      orderId,
                "customerName", customerName,
                "total",        total,
                "timestamp",    System.currentTimeMillis()
        );
        messagingTemplate.convertAndSend("/topic/admin/orders", payload);
        log.info("WS notification sent: NEW_ORDER #{} from {}", orderId, customerName);
    }

    /**
     * Thông báo user khi trạng thái đơn thay đổi.
     * User subscribe: /queue/orders/{userId}
     */
    public void notifyOrderStatus(Long userId, Long orderId, String status) {
        Map<String, Object> payload = Map.of(
                "type",    "ORDER_STATUS",
                "orderId", orderId,
                "status",  status,
                "timestamp", System.currentTimeMillis()
        );
        messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/orders", payload);
        log.info("WS notification sent to user {}: order #{} -> {}", userId, orderId, status);
    }
}
