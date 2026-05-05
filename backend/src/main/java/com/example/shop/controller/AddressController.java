package com.example.shop.controller;

import com.example.shop.dto.AddressRequest;
import com.example.shop.dto.AddressResponse;
import com.example.shop.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    /**
     * GET /api/addresses — Get all addresses for current user
     */
    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses() {
        List<AddressResponse> addresses = addressService.getMyAddresses();
        return ResponseEntity.ok(addresses);
    }

    /**
     * GET /api/addresses/default — Get default address
     */
    @GetMapping("/default")
    public ResponseEntity<AddressResponse> getDefaultAddress() {
        AddressResponse address = addressService.getDefaultAddress();
        if (address == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(address);
    }

    /**
     * GET /api/addresses/{id} — Get address by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddressById(@PathVariable Long id) {
        AddressResponse address = addressService.getAddressById(id);
        return ResponseEntity.ok(address);
    }

    /**
     * POST /api/addresses — Create new address
     */
    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request
    ) {
        AddressResponse created = addressService.createAddress(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/addresses/{id} — Update address
     */
    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request
    ) {
        AddressResponse updated = addressService.updateAddress(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * PATCH /api/addresses/{id}/set-default — Set address as default
     */
    @PatchMapping("/{id}/set-default")
    public ResponseEntity<AddressResponse> setDefaultAddress(@PathVariable Long id) {
        AddressResponse updated = addressService.setDefaultAddress(id);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/addresses/{id} — Delete address
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
