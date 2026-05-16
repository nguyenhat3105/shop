# 🎨 MIGRATE TO TAILWIND CSS

## Bước 1: Cài đặt Tailwind CSS

```bash
cd frontend

# Cài Tailwind và dependencies
npm install -D tailwindcss postcss autoprefixer

# Tạo config files
npx tailwindcss init -p
```

Lệnh trên tạo 2 files:
- `tailwind.config.js`
- `postcss.config.js`

---

## Bước 2: Cấu hình Tailwind

### File: `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1a1a1a',
          dark: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#b8955a',
          light: '#d4b983',
          dim: 'rgba(184, 149, 90, 0.08)',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#fafafa',
          3: '#f5f5f5',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          2: 'rgba(0, 0, 0, 0.12)',
          3: 'rgba(0, 0, 0, 0.18)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.06)',
        DEFAULT: '0 4px 16px rgba(0, 0, 0, 0.08)',
        'md': '0 6px 24px rgba(0, 0, 0, 0.1)',
        'lg': '0 12px 40px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.4s ease-in-out',
        'fadeUp': 'fadeUp 0.5s ease-out',
        'shimmer': 'shimmer 1.6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
      },
    },
  },
  plugins: [],
}
```

---

## Bước 3: Import Tailwind vào CSS

### File: `src/index.css`

**THAY THẾ toàn bộ** nội dung hiện tại bằng:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ══════════════════════════════════════
   CUSTOM BASE STYLES
══════════════════════════════════════ */

@layer base {
  * {
    @apply box-border;
  }

  body {
    @apply m-0 font-sans text-gray-900 bg-gray-50 antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold;
  }

  a {
    @apply no-underline text-inherit;
  }

  button {
    @apply font-sans;
  }

  input, textarea, select {
    @apply font-sans;
  }
}

/* ══════════════════════════════════════
   CUSTOM COMPONENTS
══════════════════════════════════════ */

@layer components {
  /* Buttons */
  .btn {
    @apply inline-flex items-center justify-center gap-2 px-6 py-3 
           rounded-lg font-semibold text-sm transition-all duration-200
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-dark {
    @apply bg-brand text-white hover:bg-brand-dark 
           active:scale-95;
  }

  .btn-outline {
    @apply border border-border-2 bg-white text-gray-700
           hover:border-brand hover:bg-gray-50;
  }

  .btn-sm {
    @apply px-4 py-2 text-xs;
  }

  /* Card */
  .card {
    @apply bg-white border border-border rounded-lg overflow-hidden
           transition-all duration-300 hover:shadow-md hover:-translate-y-1;
  }

  /* Skeleton */
  .skeleton {
    @apply bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
           bg-[length:600px_100%] animate-shimmer rounded;
  }

  /* Form inputs */
  .form-input {
    @apply w-full px-3 py-2 border border-border rounded-lg
           focus:outline-none focus:border-brand focus:ring-4 
           focus:ring-black/5 transition-colors;
  }

  .form-label {
    @apply flex items-center gap-2 text-sm font-semibold 
           text-gray-700 mb-2;
  }
}

/* ══════════════════════════════════════
   CUSTOM UTILITIES
══════════════════════════════════════ */

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

/* ══════════════════════════════════════
   LEGACY CSS VARIABLES (compatibility)
══════════════════════════════════════ */

:root {
  --brand: #1a1a1a;
  --accent: #b8955a;
  --accent-lt: #d4b983;
  --accent-dim: rgba(184, 149, 90, 0.08);
  --surface: #ffffff;
  --surface-2: #fafafa;
  --bg: #fafafa;
  --bg-2: #f5f5f5;
  --bg-3: #efefef;
  --text: #1a1a1a;
  --text-2: #4a4a4a;
  --text-muted: #999999;
  --border: rgba(0, 0, 0, 0.08);
  --border-2: rgba(0, 0, 0, 0.12);
  --border-3: rgba(0, 0, 0, 0.18);
  --success: #3a7d52;
  --error: #c0392b;
  --radius: 8px;
  --radius-lg: 12px;
  --max-w: 1280px;
  --nav-h: 64px;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Bước 4: Ví dụ Component với Tailwind

### TRƯỚC (CSS thuần):

```jsx
// ProductCard.js
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} className="card__img" />
      <div className="card__body">
        <h3 className="card__name">{product.name}</h3>
        <p className="card__price">{product.price}</p>
      </div>
    </div>
  );
}
```

```css
/* ProductCard.css */
.card {
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
}

.card__img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}

.card__body {
  padding: 1rem;
}

.card__name {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.card__price {
  font-weight: 700;
  color: #b8955a;
}
```

### SAU (Tailwind):

```jsx
// ProductCard.js - KHÔNG cần import CSS

function ProductCard({ product }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden 
                    hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <img 
        src={product.image} 
        className="w-full aspect-[3/4] object-cover" 
      />
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-base font-bold text-accent">
          {product.price}
        </p>
      </div>
    </div>
  );
}
```

**XÓA file** `ProductCard.css` ✅

---

## Bước 5: Migration Checklist

### Components cần migrate:

- [ ] `ProductCard.js` + xóa `.css`
- [ ] `ProductGrid.js` + xóa `.css`
- [ ] `HeroSection.js` + xóa `.css`
- [ ] `Navbar.js` + xóa `.css`
- [ ] `ProductDetail.js` + xóa `.css`
- [ ] `SkeletonCard.js` + xóa `.css`
- [ ] `CartModal.js` + xóa `.css`
- [ ] `CheckoutPage.js` + xóa `.css`
- [ ] `AddressForm.js` + xóa `.css`

### CSS files cần xóa sau migration:

```bash
frontend/src/components/
├── ProductCard.css        ❌ XÓA
├── ProductGrid.css        ❌ XÓA
├── HeroSection.css        ❌ XÓA
├── Navbar.css             ❌ XÓA
├── SkeletonCard.css       ❌ XÓA
├── CartModal.css          ❌ XÓA
└── AddressForm.css        ❌ XÓA

frontend/src/pages/
├── ProductDetail.css      ❌ XÓA
└── CheckoutPage.css       ❌ XÓA
```

Chỉ GIỮ LẠI: `index.css` (với Tailwind imports)

---

## Bước 6: Chạy thử

```bash
npm start
```

Nếu thấy lỗi:
1. Clear cache: `rm -rf node_modules/.cache`
2. Restart: `npm start`

---

## Lợi ích Tailwind CSS

### ✅ SO VỚI CSS thuần:

| Vấn đề CSS thuần | Giải pháp Tailwind |
|-------------------|---------------------|
| 15+ file CSS riêng lẻ | 1 file `index.css` + inline classes |
| Khó maintain naming (BEM) | Utility-first, không lo naming |
| CSS conflicts giữa components | Scoped tự động trong className |
| Responsive khó nhất quán | `sm:` `md:` `lg:` prefixes |
| Dark mode phức tạp | `dark:` prefix built-in |
| File size lớn (unused CSS) | PurgeCSS tự động xóa unused |
| Styling không nhất quán | Design tokens trong config |

### 📊 So sánh code:

**CSS thuần:**
```jsx
// 1 component = 2 files
ProductCard.js (50 lines)
ProductCard.css (120 lines)
```

**Tailwind:**
```jsx
// 1 component = 1 file
ProductCard.js (50 lines)
// NO CSS FILE ✅
```

**Kết quả:**
- Giảm 50% số files
- Code dễ đọc hơn (HTML + styles cùng chỗ)
- Responsive tự nhiên hơn (`md:grid-cols-3`)

---

## Ví dụ Responsive với Tailwind

```jsx
// Trước (CSS):
<div className="product-grid">...</div>

/* CSS */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

```jsx
// Sau (Tailwind):
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  ...
</div>

// KHÔNG cần CSS file! ✅
```

---

## Next Steps

1. **Cài Tailwind** (Bước 1-3 ở trên)
2. **Migrate 1 component thử** (VD: ProductCard)
3. **Test xem UI vẫn giống nhau**
4. **Migrate hết các components còn lại**
5. **Xóa CSS files cũ**

Bạn muốn tôi bắt đầu migrate components ngay không?
