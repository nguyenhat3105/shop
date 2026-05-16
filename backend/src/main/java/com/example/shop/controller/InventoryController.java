package com.example.shop.controller;

import com.example.shop.entity.Product;
import com.example.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final ProductRepository productRepository;

    private static final int LOW_STOCK_THRESHOLD = 5;

    /** GET /api/admin/inventory — tất cả sản phẩm với thông tin tồn kho */
    @GetMapping
    public ResponseEntity<List<Product>> getInventory() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    /** GET /api/admin/inventory/low-stock — chỉ sản phẩm sắp hết */
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStock() {
        return ResponseEntity.ok(
                productRepository.findByStockLessThanEqual(LOW_STOCK_THRESHOLD)
        );
    }

    /** PATCH /api/admin/inventory/{id} — cập nhật số lượng tồn */
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        Integer newStock = body.get("stock");
        if (newStock == null || newStock < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Số lượng không hợp lệ."));
        }

        product.setStock(newStock);
        productRepository.save(product);

        return ResponseEntity.ok(Map.of(
                "id",    product.getId(),
                "name",  product.getName(),
                "stock", product.getStock()
        ));
    }
}
