package com.example.shop.service;

import com.example.shop.dto.*;
import com.example.shop.entity.*;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.repository.*;
import com.example.shop.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository            userRepository;
    private final RefreshTokenRepository    refreshTokenRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder           passwordEncoder;
    private final JwtUtils                  jwtUtils;
    private final AuthenticationManager     authenticationManager;
    private final UserDetailsService        userDetailsService;
    private final EmailService              emailService;

    @Value("${app.jwt.refresh-token-expiration}")
    private long refreshTokenExpMs;

    @Value("${app.jwt.access-token-expiration}")
    private long accessTokenExpMs;

    // ── REGISTER ────────────────────────────────────────────────
    @Transactional
    public String register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email đã được đăng ký: " + req.getEmail());
        }

        User user = User.builder()
                .email(req.getEmail().toLowerCase().trim())
                .fullName(req.getFullName().trim())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(User.Role.USER)
                .enabled(false)
                .build();

        userRepository.save(user);

        // Tạo verification token (24h)
        String tokenValue = UUID.randomUUID().toString();
        VerificationToken vt = VerificationToken.builder()
                .token(tokenValue)
                .user(user)
                .expiresAt(Instant.now().plusSeconds(86400))
                .build();
        verificationTokenRepository.save(vt);

        // Gửi email xác thực
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), tokenValue);

        return "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.";
    }

    // ── VERIFY EMAIL ─────────────────────────────────────────────
    @Transactional
    public String verifyEmail(String token) {
        VerificationToken vt = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token không hợp lệ hoặc đã được sử dụng."));

        if (vt.isExpired()) {
            verificationTokenRepository.delete(vt);
            throw new IllegalArgumentException("Token đã hết hạn. Vui lòng đăng ký lại.");
        }

        User user = vt.getUser();
        if (user.isEnabled()) {
            return "Tài khoản đã được xác thực trước đó.";
        }

        user.setEnabled(true);
        userRepository.save(user);
        verificationTokenRepository.delete(vt);

        // Gửi email chào mừng
        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());

        return "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.";
    }

    // ── LOGIN ────────────────────────────────────────────────────
    @Transactional
    public AuthResponse login(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (DisabledException e) {
            throw new IllegalArgumentException("Tài khoản chưa được xác thực email. Vui lòng kiểm tra hộp thư.");
        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không đúng.");
        }

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("user", 0L));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessToken  = jwtUtils.generateAccessToken(userDetails);
        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(accessToken, refreshToken, user);
    }

    // ── REFRESH TOKEN ────────────────────────────────────────────
    @Transactional
    public AuthResponse refresh(RefreshTokenRequest req) {
        RefreshToken rt = refreshTokenRepository.findByToken(req.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Refresh token không hợp lệ."));

        if (rt.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(rt);
            throw new IllegalArgumentException("Refresh token đã hết hạn. Vui lòng đăng nhập lại.");
        }

        User user = rt.getUser();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String newAccessToken = jwtUtils.generateAccessToken(userDetails);

        // Rotate refresh token
        refreshTokenRepository.delete(rt);
        String newRefreshToken = createRefreshToken(user);

        return buildAuthResponse(newAccessToken, newRefreshToken, user);
    }

    // ── LOGOUT ──────────────────────────────────────────────────
    @Transactional
    public void logout(String email) {
        userRepository.findByEmail(email).ifPresent(refreshTokenRepository::deleteByUser);
    }

    // ── HELPERS ─────────────────────────────────────────────────
    private String createRefreshToken(User user) {
        // Xóa token cũ để tránh duplicate
        refreshTokenRepository.deleteByUser(user);

        String tokenValue = UUID.randomUUID().toString();
        RefreshToken rt = RefreshToken.builder()
                .token(tokenValue)
                .user(user)
                .expiresAt(Instant.now().plusMillis(refreshTokenExpMs))
                .build();
        refreshTokenRepository.save(rt);
        return tokenValue;
    }

    private AuthResponse buildAuthResponse(String accessToken, String refreshToken, User user) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpMs)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }
}
