package com.example.shop.controller;

import com.example.shop.dto.AddressRequest;
import com.example.shop.dto.AddressResponse;
import com.example.shop.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    /**
     * GET /api/addresses
     * Lấy tất cả địa chỉ của user hiện tại
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AddressResponse>> getMyAddresses() {
        return ResponseEntity.ok(addressService.getMyAddresses());
    }

    /**
     * GET /api/addresses/default
     * Lấy địa chỉ mặc định của user hiện tại
     */
    @GetMapping("/default")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> getDefaultAddress() {
        AddressResponse address = addressService.getDefaultAddress();
        if (address == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(address);
    }

    /**
     * GET /api/addresses/{id}
     * Lấy địa chỉ theo ID (chỉ của user hiện tại)
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> getAddressById(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.getAddressById(id));
    }

    /**
     * POST /api/addresses
     * Tạo địa chỉ mới
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request) {
        AddressResponse created = addressService.createAddress(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/addresses/{id}
     * Cập nhật địa chỉ
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.updateAddress(id, request));
    }

    /**
     * PATCH /api/addresses/{id}/set-default
     * Đặt địa chỉ làm mặc định
     */
    @PatchMapping("/{id}/set-default")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> setDefaultAddress(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.setDefaultAddress(id));
    }

    /**
     * DELETE /api/addresses/{id}
     * Xoá địa chỉ
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
