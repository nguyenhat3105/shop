package com.example.shop.service;

import com.example.shop.dto.AddressRequest;
import com.example.shop.dto.AddressResponse;
import com.example.shop.entity.Address;
import com.example.shop.entity.User;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.repository.AddressRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public List<AddressResponse> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AddressResponse> getAddressesByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return getAddressesByUserId(user.getId());
    }

    @Override
    @Transactional
    public AddressResponse addAddress(String email, AddressRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (request.isDefault()) {
            resetDefaultAddress(user.getId());
        }

        Address address = new Address();
        mapToEntity(address, request);
        address.setUser(user);

        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long addressId, String email, AddressRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId());
        if (address == null) {
            throw new ResourceNotFoundException("Address not found or not owned by user");
        }

        if (request.isDefault() && !address.isDefault()) {
            resetDefaultAddress(user.getId());
        }

        mapToEntity(address, request);
        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(Long addressId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId());
        if (address == null) {
            throw new ResourceNotFoundException("Address not found or not owned by user");
        }
        addressRepository.delete(address);
    }

    @Override
    @Transactional
    public AddressResponse setDefaultAddress(Long addressId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        resetDefaultAddress(user.getId());
        
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId());
        if (address == null) {
            throw new ResourceNotFoundException("Address not found or not owned by user");
        }
        
        address.setDefault(true);
        return mapToResponse(addressRepository.save(address));
    }

    private void resetDefaultAddress(Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        for (Address addr : addresses) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    private void mapToEntity(Address address, AddressRequest request) {
        address.setReceiverName(request.getReceiverName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setDetailAddress(request.getDetailAddress());
        address.setDefault(request.isDefault());
    }

    private AddressResponse mapToResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setReceiverName(address.getReceiverName());
        response.setPhoneNumber(address.getPhoneNumber());
        response.setProvince(address.getProvince());
        response.setDistrict(address.getDistrict());
        response.setWard(address.getWard());
        response.setDetailAddress(address.getDetailAddress());
        response.setDefault(address.isDefault());
        return response;
    }
}
