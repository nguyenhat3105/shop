package com.example.shop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "addresses")
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String receiverName; // Tên người nhận
    private String phoneNumber;
    private String province;     // Tỉnh/Thành phố
    private String district;     // Quận/Huyện
    private String ward;         // Phường/Xã
    private String detailAddress; // Số nhà, tên đường
    private boolean isDefault = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}