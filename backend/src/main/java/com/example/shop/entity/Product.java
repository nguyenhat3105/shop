package com.example.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // ─── Flash Sale ───
    @Column(name = "sale_price", precision = 12, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "sale_start_at")
    private LocalDateTime saleStartAt;

    @Column(name = "sale_end_at")
    private LocalDateTime saleEndAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private java.util.List<ProductVariant> variants;

    /** Kiểm tra sản phẩm có đang trong thời gian flash sale không */
    @Transient
    public boolean isOnSale() {
        if (salePrice == null || saleStartAt == null || saleEndAt == null) return false;
        LocalDateTime now = LocalDateTime.now();
        return !now.isBefore(saleStartAt) && now.isBefore(saleEndAt);
    }

    /** Giá hiện tại (ưu tiên sale nếu đang active) */
    @Transient
    public BigDecimal getEffectivePrice() {
        return isOnSale() ? salePrice : price;
    }
}
