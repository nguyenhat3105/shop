package com.example.shop.service;

import com.example.shop.dto.AddressRequest;
import com.example.shop.dto.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getAddressesByUserId(Long userId);
    AddressResponse addAddress(AddressRequest request);

}
