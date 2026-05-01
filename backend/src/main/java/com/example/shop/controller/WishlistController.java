package com.example.shop.controller;

import com.example.shop.entity.Product;
import com.example.shop.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(wishlistService.getWishlist(userDetails.getUsername()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, String>> addToWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId
    ) {
        wishlistService.addToWishlist(userDetails.getUsername(), productId);
        return ResponseEntity.ok(Map.of("message", "Đã thêm vào danh sách yêu thích."));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId
    ) {
        wishlistService.removeFromWishlist(userDetails.getUsername(), productId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa khỏi danh sách yêu thích."));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> checkInWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId
    ) {
        if (userDetails == null) return ResponseEntity.ok(false);
        return ResponseEntity.ok(wishlistService.isInWishlist(userDetails.getUsername(), productId));
    }
}
