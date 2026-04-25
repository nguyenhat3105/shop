package com.example.shop.service;

import com.example.shop.dto.*;
import com.example.shop.entity.*;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Toàn bộ business logic cho Product nằm ở đây.
 * Controller không xử lý logic — chỉ gọi Service và trả kết quả.
 */
@Service
@RequiredArgsConstructor   // Lombok tự tạo constructor inject tất cả final fields
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // ---------------------------------------------------------------
    // GET ALL — có phân trang
    // ---------------------------------------------------------------
    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::toResponse);
    }

    // ---------------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------------
    @Override
    public ProductResponse getProductById(Long id) {
        Product product = findProductOrThrow(id);
        return toResponse(product);
    }

    // ---------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------
    @Override
    @Transactional   // ghi dữ liệu — cần override readOnly = true ở class level
    public ProductResponse createProduct(ProductRequest request) {
        Category category = findCategoryOrThrow(request.getCategoryId());

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .category(category)
                .build();

        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    // ---------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------
    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductOrThrow(id);
        Category category = findCategoryOrThrow(request.getCategoryId());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);

        return toResponse(productRepository.save(product));
    }

    // ---------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        findProductOrThrow(id);  // Đảm bảo tồn tại trước khi xoá
        productRepository.deleteById(id);
    }

    // ---------------------------------------------------------------
    // SEARCH
    // ---------------------------------------------------------------
    @Override
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchByKeyword(keyword, pageable)
                .map(this::toResponse);
    }

    // ---------------------------------------------------------------
    // PRIVATE HELPERS
    // ---------------------------------------------------------------

    /** Chuyển Entity → DTO Response (tránh trả Lazy object về Controller) */
    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stock(p.getStock())
                .imageUrl(p.getImageUrl())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .build();
    }

    private Product findProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("sản phẩm", id));
    }

    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("danh mục", id));
    }
}
