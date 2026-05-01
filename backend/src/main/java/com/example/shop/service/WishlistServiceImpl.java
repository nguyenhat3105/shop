package com.example.shop.service;

import com.example.shop.entity.Product;
import com.example.shop.entity.User;
import com.example.shop.entity.Wishlist;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import com.example.shop.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public void addToWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        if (!wishlistRepository.existsByUserAndProduct(user, product)) {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(wishlist);
        }
    }

    @Override
    @Transactional
    public void removeFromWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();
        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    @Override
    public List<Product> getWishlist(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return wishlistRepository.findByUser(user).stream()
                .map(Wishlist::getProduct)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isInWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return false;
        
        return productRepository.findById(productId)
                .map(product -> wishlistRepository.existsByUserAndProduct(user, product))
                .orElse(false);
    }
}
