package com.example.shop.service;

import com.example.shop.entity.Product;
import java.util.List;

public interface WishlistService {
    void addToWishlist(String email, Long productId);
    void removeFromWishlist(String email, Long productId);
    List<Product> getWishlist(String email);
    boolean isInWishlist(String email, Long productId);
}
