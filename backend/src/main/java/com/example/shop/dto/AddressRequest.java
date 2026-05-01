package com.example.shop.dto;

import lombok.Data;

@Data
public class AddressRequest {
    private String receiverName;
    private String phoneNumber;
    private String province;
    private String district;
    private String ward;
    private String detailAddress;
    private boolean isDefault;
}
