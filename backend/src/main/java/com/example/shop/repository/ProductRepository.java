package com.example.shop.repository;

import com.example.shop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findTop4ByCategoryIdAndIdNot(Long categoryId, Long id);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Product> findByStockGreaterThan(int stock);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // ─── Flash Sale ───
    @Query("SELECT p FROM Product p WHERE " +
           "p.salePrice IS NOT NULL AND " +
           "p.saleStartAt <= :now AND p.saleEndAt > :now " +
           "ORDER BY p.saleEndAt ASC")
    List<Product> findActiveFlashSaleProducts(@Param("now") LocalDateTime now);

    // ─── Frequently Bought Together ───
    @Query(value = """
        SELECT oi2.product_id, COUNT(*) as co_count
        FROM order_items oi1
        JOIN order_items oi2 ON oi1.order_id = oi2.order_id
        WHERE oi1.product_id = :productId
          AND oi2.product_id != :productId
        GROUP BY oi2.product_id
        ORDER BY co_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findFrequentlyBoughtWithRaw(
            @Param("productId") Long productId,
            @Param("limit") int limit);

    // ─── Batch fetch by IDs ───
    List<Product> findByIdIn(List<Long> ids);

    // ─── Inventory ───
    List<Product> findByStockLessThanEqual(int threshold);
    List<Product> findByStockLessThanEqualOrderByStockAsc(int threshold);
}
