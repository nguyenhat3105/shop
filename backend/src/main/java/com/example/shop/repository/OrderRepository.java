package com.example.shop.repository;

import com.example.shop.entity.Order;
import com.example.shop.entity.Order.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Tìm đơn hàng theo email khách hàng
    List<Order> findByCustomerEmail(String customerEmail);
    Page<Order> findByCustomerEmail(String customerEmail, Pageable pageable);

    // Tìm đơn hàng theo trạng thái (có phân trang)
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    // Tìm đơn hàng trong khoảng thời gian
    List<Order> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    // Tìm đơn hàng theo email và trạng thái
    List<Order> findByCustomerEmailAndStatus(String email, OrderStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    java.math.BigDecimal sumTotalRevenue();

    @org.springframework.data.jpa.repository.Query("SELECT " +
            "NEW map(FUNCTION('MONTH', o.createdAt) as month, SUM(o.totalAmount) as revenue) " +
            "FROM Order o " +
            "WHERE FUNCTION('YEAR', o.createdAt) = FUNCTION('YEAR', CURRENT_DATE) " +
            "GROUP BY FUNCTION('MONTH', o.createdAt) " +
            "ORDER BY FUNCTION('MONTH', o.createdAt)")
    List<java.util.Map<String, Object>> getMonthlyRevenue();
}
