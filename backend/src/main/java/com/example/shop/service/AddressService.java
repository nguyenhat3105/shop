package com.example.shop.service;

import com.example.shop.dto.AddressRequest;
import com.example.shop.dto.AddressResponse;
import com.example.shop.entity.Address;
import com.example.shop.entity.User;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.repository.AddressRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    /**
     * Get current authenticated user
     */
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    /**
     * Get all addresses for current user
     */
    public List<AddressResponse> getMyAddresses() {
        User user = getCurrentUser();
        List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDescIdDesc(user.getId());
        return addresses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get address by ID (must belong to current user)
     */
    public AddressResponse getAddressById(Long id) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or access denied"));
        return mapToResponse(address);
    }

    /**
     * Create new address
     */
    @Transactional
    public AddressResponse createAddress(AddressRequest request) {
        User user = getCurrentUser();

        // If this is set as default, unset all other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetAllDefaults(user.getId());
        }

        // If this is user's first address, make it default automatically
        long count = addressRepository.countByUserId(user.getId());
        boolean shouldBeDefault = count == 0 || Boolean.TRUE.equals(request.getIsDefault());

        Address address = new Address();
        address.setReceiverName(request.getReceiverName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setDetailAddress(request.getDetailAddress());
        address.setDefault(shouldBeDefault);
        address.setUser(user);

        Address saved = addressRepository.save(address);
        return mapToResponse(saved);
    }

    /**
     * Update existing address
     */
    @Transactional
    public AddressResponse updateAddress(Long id, AddressRequest request) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or access denied"));

        // If setting as default, unset all other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetAllDefaults(user.getId());
        }

        address.setReceiverName(request.getReceiverName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setDetailAddress(request.getDetailAddress());
        address.setDefault(Boolean.TRUE.equals(request.getIsDefault()));

        Address updated = addressRepository.save(address);
        return mapToResponse(updated);
    }

    /**
     * Set an address as default
     */
    @Transactional
    public AddressResponse setDefaultAddress(Long id) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or access denied"));

        // Unset all other defaults
        unsetAllDefaults(user.getId());

        // Set this as default
        address.setDefault(true);
        Address updated = addressRepository.save(address);
        return mapToResponse(updated);
    }

    /**
     * Delete address
     */
    @Transactional
    public void deleteAddress(Long id) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or access denied"));

        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);

        // If deleted address was default, set first remaining as default
        if (wasDefault) {
            List<Address> remaining = addressRepository.findByUserIdOrderByIsDefaultDescIdDesc(user.getId());
            if (!remaining.isEmpty()) {
                Address first = remaining.get(0);
                first.setDefault(true);
                addressRepository.save(first);
            }
        }
    }

    /**
     * Get default address for current user
     */
    public AddressResponse getDefaultAddress() {
        User user = getCurrentUser();
        Address address = addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .orElse(null);
        return address != null ? mapToResponse(address) : null;
    }

    // ─── Private helpers ───

    private void unsetAllDefaults(Long userId) {
        List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
        addresses.forEach(a -> a.setDefault(false));
        addressRepository.saveAll(addresses);
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .receiverName(address.getReceiverName())
                .phoneNumber(address.getPhoneNumber())
                .province(address.getProvince())
                .district(address.getDistrict())
                .ward(address.getWard())
                .detailAddress(address.getDetailAddress())
                .isDefault(address.isDefault())
                .build();
    }
}
