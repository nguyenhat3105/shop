package com.example.shop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {
    
    @NotBlank(message = "Tên người nhận không được để trống")
    private String receiverName;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    private String phoneNumber;
    
    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    private String province;
    
    @NotBlank(message = "Quận/Huyện không được để trống")
    private String district;
    
    @NotBlank(message = "Phường/Xã không được để trống")
    private String ward;
    
    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    private String detailAddress;
    
    private Boolean isDefault = false;
}
