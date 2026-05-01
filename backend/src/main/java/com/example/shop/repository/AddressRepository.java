package com.example.shop.repository;

import com.example.shop.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address,Long> {
    List<Address> findByUserId(Long userId);
    Address findByIdAndUserId(Long id, Long userId);
}
