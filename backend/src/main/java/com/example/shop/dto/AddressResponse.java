package com.example.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    
    private Long id;
    private String receiverName;
    private String phoneNumber;
    private String province;
    private String district;
    private String ward;
    private String detailAddress;
    private Boolean isDefault;
    
    // Full formatted address
    public String getFullAddress() {
        return String.format("%s, %s, %s, %s", 
            detailAddress, ward, district, province);
    }
}
