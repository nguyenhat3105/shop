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
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    // ─── Lấy user hiện tại từ SecurityContext ───────────────────────────────

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại: " + email));
    }

    // ─── Public API ──────────────────────────────────────────────────────────

    @Override
    public List<AddressResponse> getMyAddresses() {
        User user = getCurrentUser();
        return addressRepository
                .findByUserIdOrderByIsDefaultDescIdDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse getAddressById(Long id) {
        User user = getCurrentUser();
        Address address = findAddressOfUser(id, user.getId());
        return mapToResponse(address);
    }

    @Override
    public AddressResponse getDefaultAddress() {
        User user = getCurrentUser();
        return addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Override
    @Transactional
    public AddressResponse createAddress(AddressRequest request) {
        User user = getCurrentUser();

        // Nếu là địa chỉ đầu tiên hoặc request yêu cầu đặt mặc định → reset rồi set
        long count = addressRepository.countByUserId(user.getId());
        boolean shouldBeDefault = count == 0 || request.isDefault();

        if (shouldBeDefault) {
            addressRepository.resetAllDefaultsByUserId(user.getId());
        }

        Address address = Address.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .phoneNumber(request.getPhoneNumber())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .detailAddress(request.getDetailAddress())
                .isDefault(shouldBeDefault)
                .build();

        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long id, AddressRequest request) {
        User user = getCurrentUser();
        Address address = findAddressOfUser(id, user.getId());

        if (request.isDefault() && !address.isDefault()) {
            addressRepository.resetAllDefaultsByUserId(user.getId());
        }

        address.setReceiverName(request.getReceiverName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setDetailAddress(request.getDetailAddress());
        address.setDefault(request.isDefault());

        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse setDefaultAddress(Long id) {
        User user = getCurrentUser();
        Address address = findAddressOfUser(id, user.getId());

        // Reset tất cả rồi set cái này
        addressRepository.resetAllDefaultsByUserId(user.getId());
        address.setDefault(true);

        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(Long id) {
        User user = getCurrentUser();
        Address address = findAddressOfUser(id, user.getId());

        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);

        // Nếu xoá địa chỉ mặc định → tự động gán cho địa chỉ đầu tiên còn lại
        if (wasDefault) {
            List<Address> remaining =
                    addressRepository.findByUserIdOrderByIsDefaultDescIdDesc(user.getId());
            if (!remaining.isEmpty()) {
                Address next = remaining.get(0);
                next.setDefault(true);
                addressRepository.save(next);
            }
        }
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    private Address findAddressOfUser(Long addressId, Long userId) {
        return addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Địa chỉ không tồn tại hoặc bạn không có quyền truy cập (id=" + addressId + ")"
                ));
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .userId(address.getUser().getId())
                .receiverName(address.getReceiverName())
                .phoneNumber(address.getPhoneNumber())
                .province(address.getProvince())
                .district(address.getDistrict())
                .ward(address.getWard())
                .detailAddress(address.getDetailAddress())
                .isDefault(address.isDefault())
                .createdAt(address.getCreatedAt() != null
                        ? address.getCreatedAt().toString() : null)
                .build();
    }
}
