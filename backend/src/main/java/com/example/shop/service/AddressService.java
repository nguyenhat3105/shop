package com.example.shop.service;

import com.example.shop.dto.AddressRequest;
import com.example.shop.dto.AddressResponse;

import java.util.List;

public interface AddressService {

    /**
     * Lấy tất cả địa chỉ của user đang đăng nhập
     */
    List<AddressResponse> getMyAddresses();

    /**
     * Lấy địa chỉ theo ID (chỉ địa chỉ thuộc về user hiện tại)
     */
    AddressResponse getAddressById(Long id);

    /**
     * Lấy địa chỉ mặc định của user hiện tại (null nếu chưa có)
     */
    AddressResponse getDefaultAddress();

    /**
     * Tạo địa chỉ mới cho user hiện tại
     */
    AddressResponse createAddress(AddressRequest request);

    /**
     * Cập nhật địa chỉ (chỉ địa chỉ thuộc về user hiện tại)
     */
    AddressResponse updateAddress(Long id, AddressRequest request);

    /**
     * Đặt địa chỉ làm mặc định (chỉ địa chỉ thuộc về user hiện tại)
     */
    AddressResponse setDefaultAddress(Long id);

    /**
     * Xoá địa chỉ (chỉ địa chỉ thuộc về user hiện tại)
     * Nếu địa chỉ bị xoá là mặc định → tự động gán mặc định cho địa chỉ kế tiếp
     */
    void deleteAddress(Long id);
}
