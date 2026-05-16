package com.example.shop.service;

import com.example.shop.dto.*;
import com.example.shop.entity.*;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public ProductResponse getProductById(Long id) {
        return toResponse(findProductOrThrow(id));
    }

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
        if (request.getGalleryImages() != null && !request.getGalleryImages().isEmpty()) {
            for (String imgUrl : request.getGalleryImages()) {
                productImageRepository.save(ProductImage.builder()
                        .product(saved).imageUrl(imgUrl).build());
            }
        }
        return toResponse(saved);
    }

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
        if (request.getGalleryImages() != null) {
            productImageRepository.deleteAll(productImageRepository.findByProductId(saved.getId()));
            for (String imgUrl : request.getGalleryImages()) {
                productImageRepository.save(ProductImage.builder()
                        .product(saved).imageUrl(imgUrl).build());
            }
        }
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        findProductOrThrow(id);
        productRepository.deleteById(id);
    }

    @Override
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchByKeyword(keyword, pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public ReviewResponse addReview(Long productId, String userEmail, ReviewRequest request) {
        Product product = findProductOrThrow(productId);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user."));
        Review review = Review.builder()
                .product(product).user(user)
                .rating(request.getRating()).comment(request.getComment())
                .build();
        return toReviewResponse(reviewRepository.save(review));
    }

    @Override
    public Page<ReviewResponse> getReviewsByProduct(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable).map(this::toReviewResponse);
    }

    @Override
    public List<ProductResponse> getRelatedProducts(Long categoryId, Long productId) {
        return productRepository.findTop4ByCategoryIdAndIdNot(categoryId, productId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<ProductVariantDto> getVariantsByProduct(Long productId) {
        findProductOrThrow(productId);
        return productVariantRepository.findByProductId(productId)
                .stream().map(this::toVariantDto).toList();
    }

    @Override
    @Transactional
    public ProductVariantDto addVariant(Long productId, ProductVariantDto request) {
        Product product = findProductOrThrow(productId);
        ProductVariant variant = ProductVariant.builder()
                .product(product).size(request.getSize())
                .color(request.getColor())
                .stock(request.getStock() != null ? request.getStock() : 0)
                .build();
        return toVariantDto(productVariantRepository.save(variant));
    }

    @Override
    @Transactional
    public void deleteVariant(Long productId, Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Biến thể", variantId));
        if (!variant.getProduct().getId().equals(productId))
            throw new IllegalArgumentException("Biến thể không thuộc sản phẩm này.");
        productVariantRepository.deleteById(variantId);
    }

    // ─── Flash Sale ───
    @Override
    public List<ProductResponse> getFlashSaleProducts() {
        return productRepository.findActiveFlashSaleProducts(LocalDateTime.now())
                .stream().map(this::toResponse).toList();
    }

    // ─── Frequently Bought Together ───
    @Override
    public List<ProductResponse> getFrequentlyBoughtTogether(Long productId, int limit) {
        List<Object[]> rows = productRepository.findFrequentlyBoughtWithRaw(productId, limit);
        if (rows.isEmpty()) {
            // Fallback: lấy sản phẩm cùng category
            Product p = findProductOrThrow(productId);
            return getRelatedProducts(p.getCategory().getId(), productId);
        }
        List<Long> ids = rows.stream()
                .map(row -> ((Number) row[0]).longValue())
                .toList();
        return productRepository.findByIdIn(ids).stream().map(this::toResponse).toList();
    }

    @Override
    public List<ProductResponse> getProductsByIds(List<Long> ids) {
        return productRepository.findByIdIn(ids).stream().map(this::toResponse).toList();
    }

    // ─── Private helpers ───
    private ProductResponse toResponse(Product p) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(p.getId());
        Long reviewCount = reviewRepository.countByProductId(p.getId());
        List<String> images = productImageRepository.findByProductId(p.getId())
                .stream().map(ProductImage::getImageUrl).toList();
        List<ProductVariantDto> variantDtos = p.getVariants() != null
                ? p.getVariants().stream().map(this::toVariantDto).toList()
                : new ArrayList<>();

        boolean onSale = p.isOnSale();
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
                // Flash sale fields
                .salePrice(p.getSalePrice())
                .saleStartAt(p.getSaleStartAt())
                .saleEndAt(p.getSaleEndAt())
                .onSale(onSale)
                .effectivePrice(p.getEffectivePrice())
                .build();
    }

    private ReviewResponse toReviewResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId()).userId(r.getUser().getId())
                .userName(r.getUser().getFullName())
                .rating(r.getRating()).comment(r.getComment())
                .createdAt(r.getCreatedAt()).build();
    }

    private ProductVariantDto toVariantDto(ProductVariant v) {
        return ProductVariantDto.builder()
                .id(v.getId()).size(v.getSize())
                .color(v.getColor()).stock(v.getStock()).build();
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
