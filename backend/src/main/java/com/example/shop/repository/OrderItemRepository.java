package com.example.shop.repository;

import com.example.shop.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Tìm tất cả items của một đơn hàng
    List<OrderItem> findByOrderId(Long orderId);

    // Tìm tất cả items chứa một sản phẩm cụ thể
    List<OrderItem> findByProductId(Long productId);
}
