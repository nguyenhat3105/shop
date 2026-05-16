package com.example.shop.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;

    private Long categoryId;
    private String categoryName;

    private Double averageRating;
    private Long reviewCount;

    private java.util.List<String> galleryImages;
    private java.util.List<ProductVariantDto> variants;

    // ─── Flash Sale ───
    private BigDecimal salePrice;
    private LocalDateTime saleStartAt;
    private LocalDateTime saleEndAt;
    private Boolean onSale;          // true nếu đang trong thời gian flash sale
    private BigDecimal effectivePrice; // giá hiệu lực: salePrice nếu onSale, else price
}
