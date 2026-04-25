package com.example.shop.service;

import com.example.shop.dto.*;
import com.example.shop.entity.*;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository productImageRepository;

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
    @Transactional
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

        // Lưu gallery images
        if (request.getGalleryImages() != null && !request.getGalleryImages().isEmpty()) {
            for (String imgUrl : request.getGalleryImages()) {
                productImageRepository.save(ProductImage.builder()
                        .product(saved)
                        .imageUrl(imgUrl)
                        .build());
            }
        }

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

        Product saved = productRepository.save(product);

        // Cập nhật gallery images
        if (request.getGalleryImages() != null) {
            List<ProductImage> oldImages = productImageRepository.findByProductId(saved.getId());
            productImageRepository.deleteAll(oldImages);

            for (String imgUrl : request.getGalleryImages()) {
                productImageRepository.save(ProductImage.builder()
                        .product(saved)
                        .imageUrl(imgUrl)
                        .build());
            }
        }

        return toResponse(saved);
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

    @Override
    @Transactional
    public ReviewResponse addReview(Long productId, String userEmail, ReviewRequest request) {
        Product product = findProductOrThrow(productId);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user."));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        
        Review saved = reviewRepository.save(review);
        return toReviewResponse(saved);
    }

    @Override
    public Page<ReviewResponse> getReviewsByProduct(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable)
                .map(this::toReviewResponse);
    }

    // ---------------------------------------------------------------
    // RELATED PRODUCTS
    // ---------------------------------------------------------------
    @Override
    public List<ProductResponse> getRelatedProducts(Long categoryId, Long productId) {
        return productRepository.findTop4ByCategoryIdAndIdNot(categoryId, productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ---------------------------------------------------------------
    // PRIVATE HELPERS
    // ---------------------------------------------------------------

    /** Chuyển Entity → DTO Response (tránh trả Lazy object về Controller) */
    private ProductResponse toResponse(Product p) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(p.getId());
        Long reviewCount = reviewRepository.countByProductId(p.getId());
        
        List<String> images = productImageRepository.findByProductId(p.getId())
                .stream()
                .map(ProductImage::getImageUrl)
                .toList();

        List<ProductVariantDto> variantDtos = p.getVariants() != null ? 
                p.getVariants().stream()
                 .map(v -> ProductVariantDto.builder()
                        .id(v.getId())
                        .size(v.getSize())
                        .color(v.getColor())
                        .stock(v.getStock())
                        .build())
                 .toList() : new java.util.ArrayList<>();

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stock(p.getStock())
                .imageUrl(p.getImageUrl())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .averageRating(avgRating != null ? avgRating : 0.0)
                .reviewCount(reviewCount)
                .galleryImages(images)
                .variants(variantDtos)
                .build();
    }

    private ReviewResponse toReviewResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .userName(r.getUser().getFullName())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
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
