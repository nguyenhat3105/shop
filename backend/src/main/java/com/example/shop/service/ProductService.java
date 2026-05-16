package com.example.shop.service;

import com.example.shop.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {

    Page<ProductResponse> getAllProducts(Pageable pageable);

    ProductResponse getProductById(Long id);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);

    ReviewResponse addReview(Long productId, String userEmail, ReviewRequest request);

    Page<ReviewResponse> getReviewsByProduct(Long productId, Pageable pageable);

    List<ProductResponse> getRelatedProducts(Long categoryId, Long productId);

    ProductVariantDto addVariant(Long productId, ProductVariantDto request);

    void deleteVariant(Long productId, Long variantId);

    List<ProductVariantDto> getVariantsByProduct(Long productId);

    // ─── Flash Sale ───
    List<ProductResponse> getFlashSaleProducts();

    // ─── Recommendations ───
    List<ProductResponse> getFrequentlyBoughtTogether(Long productId, int limit);

    List<ProductResponse> getProductsByIds(List<Long> ids);
}
