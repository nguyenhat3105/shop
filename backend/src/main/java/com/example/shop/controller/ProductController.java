package com.example.shop.controller;

import com.example.shop.dto.*;
import com.example.shop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;

/**
 * REST Controller cho Product.
 *
 * Base URL : /api/products
 *
 * GET    /api/products              → Danh sách (có phân trang)
 * GET    /api/products/{id}         → Chi tiết 1 sản phẩm
 * GET    /api/products/search       → Tìm kiếm theo keyword
 * POST   /api/products              → Thêm mới
 * PUT    /api/products/{id}         → Cập nhật
 * DELETE /api/products/{id}         → Xoá
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ---------------------------------------------------------------
    // GET ALL — Phân trang: ?page=0&size=12&sort=price,asc
    // ---------------------------------------------------------------
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "12")  int size,
            @RequestParam(defaultValue = "id")  String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductResponse> result = productService.getAllProducts(pageable);
        return ResponseEntity.ok(result);
    }

    // ---------------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
        // Nếu không tìm thấy → GlobalExceptionHandler trả 404 tự động
    }

    // ---------------------------------------------------------------
    // SEARCH — ?keyword=áo&page=0&size=12
    // ---------------------------------------------------------------
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> result = productService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(result);
    }

    // ---------------------------------------------------------------
    // CREATE — POST /api/products
    // ---------------------------------------------------------------
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request
    ) {
        ProductResponse created = productService.createProduct(request);

        // Trả về HTTP 201 Created + Location header trỏ đến resource mới
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    // ---------------------------------------------------------------
    // UPDATE — PUT /api/products/{id}
    // ---------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        ProductResponse updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    // ---------------------------------------------------------------
    // DELETE — DELETE /api/products/{id}
    // ---------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();  // HTTP 204 No Content
    }
}
