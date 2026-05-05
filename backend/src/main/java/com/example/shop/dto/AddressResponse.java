package com.example.shop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    private Long userId;
    private String receiverName;
    private String phoneNumber;
    private String province;
    private String district;
    private String ward;
    private String detailAddress;

    @JsonProperty("isDefault")
    private boolean isDefault;

    private String createdAt;

    /**
     * Trả về địa chỉ đầy đủ dạng chuỗi
     */
    public String getFullAddress() {
        return String.format("%s, %s, %s, %s",
                detailAddress, ward, district, province);
    }
}
