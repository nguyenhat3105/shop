package com.example.shop.repository;

import com.example.shop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Tìm category theo tên (không phân biệt hoa/thường)
    Optional<Category> findByNameIgnoreCase(String name);

    // Kiểm tra tên đã tồn tại chưa
    boolean existsByNameIgnoreCase(String name);
}
