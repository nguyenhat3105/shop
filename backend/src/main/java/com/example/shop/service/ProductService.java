package com.example.shop.service;

import com.example.shop.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Interface định nghĩa contract cho ProductService.
 * Controller chỉ phụ thuộc vào interface này — dễ test và mở rộng.
 */
public interface ProductService {

    /** Lấy danh sách sản phẩm có phân trang */
    Page<ProductResponse> getAllProducts(Pageable pageable);

    /** Lấy chi tiết 1 sản phẩm theo ID */
    ProductResponse getProductById(Long id);

    /** Thêm sản phẩm mới */
    ProductResponse createProduct(ProductRequest request);

    /** Cập nhật sản phẩm */
    ProductResponse updateProduct(Long id, ProductRequest request);

    /** Xoá sản phẩm */
    void deleteProduct(Long id);

    /** Tìm kiếm theo từ khoá */
    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);

    /** Thêm review */
    ReviewResponse addReview(Long productId, String userEmail, ReviewRequest request);

    /** Lấy danh sách review của 1 product */
    Page<ReviewResponse> getReviewsByProduct(Long productId, Pageable pageable);
}
