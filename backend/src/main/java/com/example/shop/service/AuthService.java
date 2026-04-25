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
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository            userRepository;
    private final RefreshTokenRepository    refreshTokenRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
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

    @Value("${app.google.client-id}")
    private String googleClientId;

    // ── GOOGLE LOGIN ─────────────────────────────────────────────
    @Transactional
    public AuthResponse loginWithGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                User user = userRepository.findByEmail(email).orElse(null);

                if (user == null) {
                    // Tài khoản chưa tồn tại -> Đăng ký mới
                    String randomPassword = UUID.randomUUID().toString().substring(0, 10);
                    user = User.builder()
                            .email(email.toLowerCase().trim())
                            .fullName(name != null ? name : "User")
                            .password(passwordEncoder.encode(randomPassword))
                            .role(User.Role.USER)
                            .enabled(true) // Google đã xác thực email
                            .build();
                    userRepository.save(user);

                    // Gửi email báo password
                    emailService.sendGoogleRegisterPasswordEmail(user.getEmail(), user.getFullName(), randomPassword);
                } else if (!user.isEnabled()) {
                    // Nếu đã đk bằng form thường nhưng chưa verify email, nay đăng nhập google thì enable luôn
                    user.setEnabled(true);
                    userRepository.save(user);
                }

                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                String accessToken  = jwtUtils.generateAccessToken(userDetails);
                String refreshToken = createRefreshToken(user);

                return buildAuthResponse(accessToken, refreshToken, user);
            } else {
                throw new IllegalArgumentException("Google ID Token không hợp lệ.");
            }
        } catch (Exception e) {
            log.error("Lỗi xác thực Google Token", e);
            throw new IllegalArgumentException("Lỗi xác thực với Google: " + e.getMessage());
        }
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

    // ── FORGOT PASSWORD ───────────────────────────────────────────
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với email này."));

        // Xoá token cũ
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Tạo token mới (15 phút)
        String tokenValue = UUID.randomUUID().toString();
        PasswordResetToken prt = PasswordResetToken.builder()
                .token(tokenValue)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();
        passwordResetTokenRepository.save(prt);

        // Gửi email
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), tokenValue);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token không hợp lệ hoặc đã được sử dụng."));

        if (prt.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(prt);
            throw new IllegalArgumentException("Token đã hết hạn. Vui lòng gửi lại yêu cầu.");
        }

        User user = prt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Xoá token
        passwordResetTokenRepository.delete(prt);
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
