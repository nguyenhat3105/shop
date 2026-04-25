package com.example.shop.config;

import com.example.shop.entity.User;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Thay đổi email/password admin ở đây ──
    private static final String ADMIN_EMAIL    = "admin@luxeshop.vn";
    private static final String ADMIN_PASSWORD = "Admin@12345";
    private static final String ADMIN_NAME     = "LuxeShop Admin";

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(ADMIN_EMAIL)) {
            User admin = User.builder()
                    .email(ADMIN_EMAIL)
                    .fullName(ADMIN_NAME)
                    .password(passwordEncoder.encode(ADMIN_PASSWORD))
                    .role(User.Role.ADMIN)
                    .enabled(true)   // Admin không cần xác thực email
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin account created: {}", ADMIN_EMAIL);
            log.info("✅ Admin password: {}", ADMIN_PASSWORD);
        } else {
            log.info("ℹ️  Admin account already exists: {}", ADMIN_EMAIL);
        }
    }
}
