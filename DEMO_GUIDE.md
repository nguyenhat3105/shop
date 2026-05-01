# 🚀 Quick Start — Demo Phase 1

## Chạy dự án để xem kết quả

### 1. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

Frontend chạy tại: `http://localhost:3000`

---

## 🎯 Demo Features — Theo Thứ Tự

### 1️⃣ **Trang Chủ** (`/`)

**Xem ngay:**
- ✨ HeroSection với slideshow tự động (đợi 5 giây xem slide thay đổi)
- 📦 Categories Grid — hover vào từng danh mục
- 🛡️ Trust Bar với 4 lợi ích

**Thao tác:**
1. Scroll xuống → Categories showcase
2. Hover vào category → xem animation zoom
3. Click "Khám Phá Ngay" → scroll to products

---

### 2️⃣ **Product Grid** (scroll down homepage)

**Skeleton Loading:**
1. Refresh page (`Ctrl+R`)
2. Quan sát skeleton cards xuất hiện → smooth loading

**Filter & Sort:**
1. Click "Lọc" button (mobile) hoặc thấy filters ngay (desktop)
2. Chọn khoảng giá: "200.000 – 500.000₫"
3. Thay đổi Sort: "Giá: Cao → Thấp"
4. Toggle layout: Grid ⇄ List view

**Search:**
1. Gõ keyword vào ô search
2. Đợi 400ms debounce
3. Kết quả lọc theo keyword

---

### 3️⃣ **Product Card** (scroll products grid)

**Hover Effects:**
1. Hover vào 1 product card
2. Quan sát:
   - ✅ Image zoom
   - ✅ Gradient overlay xuất hiện
   - ✅ Action buttons (Eye, Heart) slide in
   - ✅ Card lift up (`translateY(-4px)`)

**Badges:**
- 🔴 Tìm card có badge `-20%` (sale)
- 🆕 Tìm card có badge `Mới`
- 🔥 Tìm card có badge `🔥 Hot`
- ⚠️ Tìm card `Còn X sản phẩm`

**Wishlist:**
1. Click icon Heart trên card
2. Icon đổi màu đỏ + filled
3. Click lại → unfilled

**Add to Cart:**
1. Click button "Thêm"
2. Button chuyển thành `✓ Đã thêm` (màu xanh)
3. Toast notification xuất hiện góc phải
4. Cart badge (navbar) tăng số lượng

---

### 4️⃣ **Product Detail** (click vào 1 product)

**Skeleton Loading:**
1. Click vào bất kỳ product nào
2. Quan sát skeleton ProductDetail xuất hiện

**Gallery:**
1. Nếu product có nhiều ảnh:
   - Click arrows trái/phải
   - Click thumbnails phía dưới
2. Hover vào ảnh → arrows xuất hiện

**Variants:**
1. Nếu có Size/Color:
   - Click chọn size khác
   - Click chọn màu khác
   - Variant sold out → button disabled + gạch ngang

**Quantity:**
1. Click `+` / `-` để tăng/giảm số lượng
2. Giới hạn: min = 1, max = stock available

**Add to Cart:**
1. Click "Thêm vào giỏ hàng"
2. Button → `✓ Đã thêm vào giỏ!` (xanh)
3. Link "Xem giỏ hàng →" xuất hiện
4. Click link → CartModal mở

**Wishlist:**
1. Click icon Heart (góc phải name)
2. Hoặc click button Heart (actions row)
3. Icon đổi màu đỏ

**Tabs:**
1. Click tab "Đánh giá (X)"
2. Quan sát review form
3. Hover vào stars → label thay đổi
4. Click star để chọn rating

**Related Products:**
1. Scroll xuống cuối page
2. Xem grid "Sản phẩm tương tự"
3. Hover vào card → zoom effect

---

### 5️⃣ **Responsive Testing**

**Desktop (>1024px):**
- ProductDetail gallery sticky
- ProductGrid 4 columns
- Categories 6 columns

**Tablet (768px - 1024px):**
- ProductGrid 3 columns
- Categories 3 columns
- Filter panel collapse

**Mobile (<768px):**
- ProductGrid 2 columns
- Categories 2 columns
- Filter toggle button hiện
- Nav burger menu

**Test:**
1. Mở DevTools (`F12`)
2. Toggle Device Toolbar (`Ctrl+Shift+M`)
3. Chọn iPhone 12 Pro
4. Refresh page → test mobile UX

---

## 🎨 CSS Variables Customization

Muốn đổi màu brand? Edit `src/index.css`:

```css
:root {
  --brand:   #1a1a1a;  /* Brand color */
  --accent:  #b8955a;  /* Accent gold */
  --success: #3a7d52;  /* Success green */
  --error:   #c0392b;  /* Error red */
}
```

Refresh page → toàn bộ UI đổi màu theo.

---

## 🐛 Troubleshooting

### Skeleton không hiện?
```bash
# Kiểm tra import
grep -r "SkeletonGrid" frontend/src/components/ProductGrid.js
```

### Image không load?
- Kiểm tra `product.imageUrl` trong API response
- Fallback: Picsum placeholder `https://picsum.photos/seed/${id}/...`

### Filter không hoạt động?
1. Mở DevTools Console
2. Kiểm tra API call `getProducts(page, size, sortBy, direction)`
3. Xem response data structure

### Hover effects không mượt?
- Kiểm tra GPU acceleration: `transform: translateZ(0)`
- Reduce motion setting (OS): effects tự động disable

---

## 📊 Performance Testing

### Lighthouse Audit (Chrome DevTools)

```bash
# Desktop
1. F12 → Lighthouse tab
2. Mode: Desktop
3. Categories: Performance, Accessibility
4. Generate Report

# Mobile
1. Same steps
2. Mode: Mobile
```

**Target Scores:**
- Performance: >85
- Accessibility: >90
- Best Practices: >90

### Network Throttling

```bash
# Test slow 3G
1. DevTools → Network tab
2. Throttling: Slow 3G
3. Refresh page
4. Quan sát skeleton loading
```

---

## ✅ Acceptance Criteria

Phase 1 được coi là **PASS** nếu:

- [ ] Skeleton hiện khi loading (không còn spinner)
- [ ] ProductCard có ít nhất 2 badges (sale/new/hot)
- [ ] Hover card → image zoom smoothly
- [ ] Filter giá hoạt động (client-side)
- [ ] Sort hoạt động (API call)
- [ ] Layout toggle Grid/List
- [ ] HeroSection slideshow auto 5s
- [ ] ProductDetail tabs switch
- [ ] Wishlist button toggle state
- [ ] Mobile responsive (test 375px width)
- [ ] No console errors
- [ ] No layout shift (CLS < 0.1)

---

## 🎉 Next Steps

Sau khi test Phase 1 xong:

### Báo cáo bugs
1. Screenshot issue
2. Console errors (nếu có)
3. Steps to reproduce

### Suggest improvements
- UX enhancements
- Color scheme tweaks
- Animation timing

### Chuẩn bị Phase 2
- Backend endpoints cho wishlist
- Multi-step checkout flow
- GHN/GHTK API integration

---

**Happy Testing! 🚀**

Nếu có vấn đề, check console hoặc tham khảo `PHASE_1_COMPLETE.md`
