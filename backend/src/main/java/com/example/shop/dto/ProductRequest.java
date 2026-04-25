package com.example.shop.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * DTO nhận dữ liệu từ client khi tạo / cập nhật sản phẩm.
 * Tách biệt hoàn toàn với Entity để bảo vệ dữ liệu nội bộ.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 200, message = "Tên sản phẩm tối đa 200 ký tự")
    private String name;

    private String description;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer stock;

    @Size(max = 500, message = "URL ảnh tối đa 500 ký tự")
    private String imageUrl;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;
}
