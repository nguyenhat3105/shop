package com.example.shop.repository;

import com.example.shop.entity.Order;
import com.example.shop.entity.Order.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerEmail(String customerEmail);
    Page<Order> findByCustomerEmail(String customerEmail, Pageable pageable);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    List<Order> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
    List<Order> findByCustomerEmailAndStatus(String email, OrderStatus status);

    // ─── Analytics Queries ───────────────────────────────────

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    BigDecimal sumTotalRevenue();

    @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at::date = CURRENT_DATE",
           nativeQuery = true)
    java.math.BigDecimal getTodayRevenue();

    @Query(value = "SELECT COUNT(*) FROM orders WHERE created_at::date = CURRENT_DATE",
           nativeQuery = true)
    Long countTodayOrders();

    @Query("SELECT NEW map(FUNCTION('MONTH', o.createdAt) as month, SUM(o.totalAmount) as revenue) " +
           "FROM Order o " +
           "WHERE FUNCTION('YEAR', o.createdAt) = FUNCTION('YEAR', CURRENT_DATE) " +
           "GROUP BY FUNCTION('MONTH', o.createdAt) " +
           "ORDER BY FUNCTION('MONTH', o.createdAt)")
    List<Map<String, Object>> getMonthlyRevenue();

    @Query(value =
        "SELECT status::text AS status, COUNT(*) AS count FROM orders GROUP BY status",
        nativeQuery = true)
    List<Map<String, Object>> getOrderStatusDistribution();

    @Query(value =
        "SELECT p.name AS name, SUM(oi.quantity) AS totalSold, SUM(oi.price * oi.quantity) AS revenue " +
        "FROM order_items oi " +
        "JOIN products p ON p.id = oi.product_id " +
        "GROUP BY p.id, p.name " +
        "ORDER BY totalSold DESC " +
        "LIMIT :limit",
        nativeQuery = true)
    List<Map<String, Object>> getTopSellingProducts(int limit);
}
