# 🚀 NewShop — E-Commerce Platform

> Full-stack e-commerce application with Spring Boot backend and React frontend

---

## 📋 Tổng Quan

NewShop là nền tảng thương mại điện tử hoàn chỉnh với:

- ✅ **Backend:** Spring Boot + MySQL + JWT Authentication
- ✅ **Frontend:** React.js + Tailwind CSS
- ✅ **Tính năng:** Quản lý sản phẩm, giỏ hàng, đơn hàng, thanh toán VNPay
- ✅ **UI/UX:** Professional design, skeleton loading, responsive

---

## 🎯 Tiến Độ Phát Triển

### ✅ Phase 1 — UI/UX & Performance (HOÀN TẤT)

| Tính năng | Trạng thái |
|-----------|------------|
| Skeleton Loading | ✅ |
| ProductCard nâng cấp (badges, hover) | ✅ |
| Filter giá + Sort đa tiêu chí | ✅ |
| Layout toggle (Grid/List) | ✅ |
| HeroSection slideshow | ✅ |
| Categories showcase | ✅ |
| ProductDetail tabs | ✅ |
| Wishlist UI | ✅ |
| Responsive mobile | ✅ |

**Chi tiết:** Xem [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md)

---

### 🚧 Phase 2.1 — Checkout & Address (ĐANG TRIỂN KHAI)

| Tính năng | Trạng thái |
|-----------|------------|
| Address Management Backend | ✅ |
| Address CRUD APIs | ✅ |
| Vietnam Provinces API integration | ✅ |
| AddressForm component | ✅ |
| Multi-step Checkout UI | ✅ |
| Stepper component | ✅ |
| Shipping method selection | ✅ |
| Payment method selection | ✅ |
| Order summary sidebar | ✅ |

**Chi tiết:** Xem [PHASE_2_CHECKOUT.md](./PHASE_2_CHECKOUT.md) (sẽ tạo)

---

### 📅 Roadmap Tiếp Theo

- [ ] **Phase 2.2:** GHN/GHTK API integration
- [ ] **Phase 2.3:** Flash Sale & Khuyến mãi
- [ ] **Phase 2.4:** Loyalty Points
- [ ] **Phase 3:** Admin Dashboard nâng cao
- [ ] **Phase 4:** SEO & Deploy

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.x
- **Database:** MySQL 8.0
- **Security:** Spring Security + JWT
- **Payment:** VNPay API
- **Email:** Spring Mail (Gmail SMTP)

### Frontend
- **Library:** React 18
- **Styling:** Tailwind CSS *(đang migrate từ CSS thuần)*
- **Icons:** Lucide React
- **HTTP:** Axios
- **Routing:** React Router v6
- **Charts:** Recharts (Admin dashboard)

---

## 📦 Cài Đặt & Chạy

### Prerequisites

- Java 17+
- Node.js 16+
- MySQL 8.0
- Maven 3.6+

### 1. Clone Repository

```bash
git clone <repository-url>
cd NewShop
```

### 2. Chạy Backend

```bash
cd backend

# Tạo database
mysql -u root -p
CREATE DATABASE shopdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Cấu hình application.properties
# Sửa username/password MySQL

# Chạy Spring Boot
mvn spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

### 3. Chạy Frontend

```bash
cd frontend

# Cài dependencies (bao gồm Tailwind CSS)
npm install

# Chạy React dev server
npm start
```

Frontend chạy tại: `http://localhost:3000`

---

## 🎨 Tailwind CSS Migration

**Quan trọng:** Dự án đang migrate từ CSS thuần sang **Tailwind CSS** để:
- Giảm số lượng CSS files
- Tăng tính nhất quán
- Responsive tốt hơn
- Easier maintenance

**Xem hướng dẫn chi tiết:** [TAILWIND_MIGRATION.md](./TAILWIND_MIGRATION.md)

### Cài Tailwind (nếu chưa có)

```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Files config đã được tạo sẵn:
- `tailwind.config.js`
- `postcss.config.js`

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register          # Đăng ký
POST   /api/auth/login             # Đăng nhập
POST   /api/auth/refresh           # Refresh token
POST   /api/auth/logout            # Đăng xuất
```

### Products
```
GET    /api/products               # Danh sách sản phẩm (phân trang)
GET    /api/products/{id}          # Chi tiết sản phẩm
GET    /api/products/search        # Tìm kiếm
GET    /api/products/category/{id} # Sản phẩm theo danh mục
```

### Categories
```
GET    /api/categories             # Danh sách danh mục
GET    /api/categories/{id}        # Chi tiết danh mục
```

### Addresses (NEW ✨)
```
GET    /api/addresses              # Danh sách địa chỉ (user)
GET    /api/addresses/default      # Địa chỉ mặc định
GET    /api/addresses/{id}         # Chi tiết địa chỉ
POST   /api/addresses              # Tạo địa chỉ mới
PUT    /api/addresses/{id}         # Cập nhật địa chỉ
PATCH  /api/addresses/{id}/set-default  # Đặt làm mặc định
DELETE /api/addresses/{id}         # Xóa địa chỉ
```

### Orders
```
POST   /api/orders                 # Tạo đơn hàng
GET    /api/orders?email=xxx       # Lịch sử đơn (user)
GET    /api/orders/all             # Tất cả đơn (admin)
PATCH  /api/orders/{id}/status     # Cập nhật trạng thái
```

### Reviews
```
GET    /api/products/{id}/reviews  # Đánh giá sản phẩm
POST   /api/products/{id}/reviews  # Viết đánh giá
```

---

## 🗂️ Cấu Trúc Dự Án

```
NewShop/
├── backend/
│   ├── src/main/java/com/example/shop/
│   │   ├── controller/      # REST Controllers
│   │   ├── service/         # Business Logic
│   │   ├── repository/      # JPA Repositories
│   │   ├── entity/          # JPA Entities
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── security/        # JWT, Auth config
│   │   └── config/          # Spring configs
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React Components
│   │   │   ├── ProductCard.js
│   │   │   ├── ProductGrid.js
│   │   │   ├── HeroSection.js
│   │   │   ├── SkeletonCard.js
│   │   │   ├── AddressForm.js  ← NEW ✨
│   │   │   └── ...
│   │   ├── pages/           # Page Components
│   │   │   ├── HomePage.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── CheckoutPage.js  ← NEW ✨
│   │   │   └── ...
│   │   ├── context/         # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── services/        # API calls
│   │   │   ├── api.js
│   │   │   └── addressApi.js  ← NEW ✨
│   │   └── index.css        # Tailwind imports
│   ├── tailwind.config.js   ← NEW ✨
│   ├── postcss.config.js    ← NEW ✨
│   └── package.json
│
├── PHASE_1_COMPLETE.md      # Phase 1 docs
├── TAILWIND_MIGRATION.md    # Tailwind guide
├── DEMO_GUIDE.md            # Testing guide
└── README.md                # This file
```

---

## 🧪 Testing

### Frontend

```bash
cd frontend

# Test Phase 1 features
npm start
# Then follow DEMO_GUIDE.md checklist

# Test checkout flow
# 1. Add products to cart
# 2. Go to /checkout
# 3. Add address (Vietnam API autocomplete)
# 4. Select shipping method
# 5. Select payment method
# 6. Place order
```

### Backend

```bash
cd backend

# Run tests
mvn test

# Test Address APIs (with JWT)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/addresses
```

---

## 📖 Tài Liệu Bổ Sung

- [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md) — Phase 1 changelog & features
- [TAILWIND_MIGRATION.md](./TAILWIND_MIGRATION.md) — Tailwind CSS migration guide
- [DEMO_GUIDE.md](./DEMO_GUIDE.md) — Quick demo & testing checklist
- [SETUP_AUTH.md](./SETUP_AUTH.md) — Google OAuth setup

---

## 🐛 Known Issues

1. **Wishlist chưa persist:** UI-only, cần backend API
2. **Badges dùng logic giả:** `product.id % 7` → cần thay bằng API data
3. **Layout toggle không persist:** Reset khi reload
4. **CSS migration chưa hoàn tất:** Một số components vẫn dùng CSS thuần

**Fix trong Phase 2.2+**

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**NewShop Development Team**

- Backend: Spring Boot + MySQL
- Frontend: React + Tailwind CSS
- Deployment: TBD (Phase 4)

---

## 📞 Support

Có vấn đề? Tạo issue hoặc xem docs:
- [Phase 1 Guide](./PHASE_1_COMPLETE.md)
- [Tailwind Migration](./TAILWIND_MIGRATION.md)
- [Demo Testing](./DEMO_GUIDE.md)

---

**Last Updated:** 2025-05-10  
**Version:** 2.1.0 (Phase 2.1 — Multi-step Checkout)
