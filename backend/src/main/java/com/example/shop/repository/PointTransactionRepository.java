package com.example.shop.repository;

import com.example.shop.entity.PointTransaction;
import com.example.shop.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PointTransactionRepository extends JpaRepository<PointTransaction, Long> {

    Page<PointTransaction> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    long countByUserId(Long userId);
}
