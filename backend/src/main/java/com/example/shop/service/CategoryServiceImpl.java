package com.example.shop.service;

import com.example.shop.dto.*;
import com.example.shop.entity.Category;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> toResponse(c, false))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        return toResponse(findOrThrow(id), false);
    }

    @Override
    public CategoryResponse getCategoryWithProducts(Long id) {
        return toResponse(findOrThrow(id), true);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category cat = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return toResponse(categoryRepository.save(cat), false);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category cat = findOrThrow(id);
        cat.setName(request.getName());
        cat.setDescription(request.getDescription());
        return toResponse(categoryRepository.save(cat), false);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        findOrThrow(id);
        categoryRepository.deleteById(id);
    }

    // ── Helpers ──────────────────────────────────────────────────
    private Category findOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("danh mục", id));
    }

    private CategoryResponse toResponse(Category c, boolean includeProducts) {
        List<ProductResponse> products = null;
        if (includeProducts && c.getProducts() != null) {
            products = c.getProducts().stream()
                    .map(p -> ProductResponse.builder()
                            .id(p.getId())
                            .name(p.getName())
                            .description(p.getDescription())
                            .price(p.getPrice())
                            .stock(p.getStock())
                            .imageUrl(p.getImageUrl())
                            .categoryId(c.getId())
                            .categoryName(c.getName())
                            .build())
                    .collect(Collectors.toList());
        }
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .productCount(c.getProducts() != null ? c.getProducts().size() : 0)
                .products(products)
                .build();
    }
}
