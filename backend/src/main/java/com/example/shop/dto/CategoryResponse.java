package com.example.shop.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private int productCount;
    private List<ProductResponse> products; // null khi gọi list, có khi gọi detail
}
