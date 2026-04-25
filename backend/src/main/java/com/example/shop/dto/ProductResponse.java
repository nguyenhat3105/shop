package com.example.shop.dto;

import lombok.*;
import java.math.BigDecimal;

/**
 * DTO trả về cho client — che giấu quan hệ JPA Lazy, tránh vòng lặp vô hạn JSON.
 */
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

    // Chỉ trả về thông tin cơ bản của Category, không embed toàn bộ object
    private Long categoryId;
    private String categoryName;
}
