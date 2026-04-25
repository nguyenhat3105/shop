# ═══════════════════════════════════════════════════
#  HƯỚNG DẪN CẤU HÌNH JWT + EMAIL
#  LuxeShop — Spring Boot + React
# ═══════════════════════════════════════════════════

## 1. CẤU HÌNH EMAIL GMAIL

Mở file: backend/src/main/resources/application.properties

Thay 2 dòng:
  spring.mail.username=your-email@gmail.com
  spring.mail.password=your-app-password
  app.mail.from=your-email@gmail.com

### Cách tạo App Password Gmail:
  1. Vào https://myaccount.google.com/security
  2. Bật "Xác minh 2 bước" nếu chưa bật
  3. Tìm "Mật khẩu ứng dụng" (App passwords)
  4. Chọn: Other → Đặt tên "LuxeShop" → Tạo
  5. Copy mật khẩu 16 ký tự vào spring.mail.password


## 2. THAY ĐỔI ADMIN MẶC ĐỊNH

Mở file: backend/.../config/AdminSeeder.java

  private static final String ADMIN_EMAIL    = "admin@luxeshop.vn";
  private static final String ADMIN_PASSWORD = "Admin@12345";  ← đổi mật khẩu này
  private static final String ADMIN_NAME     = "LuxeShop Admin";


## 3. JWT SECRET KEY

Key mặc định trong application.properties chỉ dùng để dev.
Trong production, thay bằng key random 256-bit base64:

  # Tạo key mới (PowerShell):
  [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

  # Hoặc online: https://generate-random.org/encryption-key-generator


## 4. CHẠY DỰ ÁN

### Backend:
  cd backend
  mvn spring-boot:run

  Khi chạy lần đầu, tự động tạo:
  ✅ Bảng users, refresh_tokens, verification_tokens
  ✅ Tài khoản admin: admin@luxeshop.vn / Admin@12345

### Frontend:
  cd frontend
  npm install
  npm start


## 5. API ENDPOINTS

| Method | URL                    | Mô tả                          | Auth |
|--------|------------------------|-------------------------------|------|
| POST   | /api/auth/register     | Đăng ký → gửi email xác thực | No   |
| GET    | /api/auth/verify?token | Xác thực email                | No   |
| POST   | /api/auth/login        | Đăng nhập → JWT tokens        | No   |
| POST   | /api/auth/refresh      | Làm mới access token          | No   |
| POST   | /api/auth/logout       | Đăng xuất                     | Yes  |
| GET    | /api/auth/me           | Thông tin user hiện tại       | Yes  |


## 6. LUỒNG HOẠT ĐỘNG

  ĐĂNG KÝ:
  User điền form → POST /register → Gửi email xác thực
  → User click link trong email → GET /verify?token=...
  → Tài khoản được kích hoạt → Redirect /login

  ĐĂNG NHẬP:
  User điền email/password → POST /login
  → Nhận { accessToken (15 phút), refreshToken (7 ngày) }
  → Lưu vào localStorage → Tự động đính vào header mọi request

  AUTO-REFRESH:
  Khi nhận 401 → Tự động gọi POST /refresh với refreshToken
  → Nhận token mới → Thử lại request gốc

  ĐĂNG XUẤT:
  POST /logout → Xóa refreshToken khỏi DB → Xóa localStorage
