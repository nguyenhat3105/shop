package com.example.shop.repository;

import com.example.shop.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    /**
     * Lấy tất cả địa chỉ của user, ưu tiên địa chỉ mặc định lên đầu
     */
    List<Address> findByUserIdOrderByIsDefaultDescIdDesc(Long userId);

    /**
     * Tìm địa chỉ theo id VÀ userId (bảo vệ quyền truy cập)
     */
    Optional<Address> findByIdAndUserId(Long id, Long userId);

    /**
     * Tìm địa chỉ mặc định của user
     */
    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);

    /**
     * Đếm số địa chỉ của user
     */
    long countByUserId(Long userId);

    /**
     * Đặt tất cả địa chỉ của user thành không mặc định (batch update)
     */
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId")
    void resetAllDefaultsByUserId(@Param("userId") Long userId);
}
