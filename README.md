# Shop - E-Commerce Full Stack

Dự án bán hàng trực tuyến sử dụng **Spring Boot** (Backend) + **ReactJS** (Frontend) + **PostgreSQL** (Database).

---

## 📁 Cấu trúc dự án

```
Shop/
├── backend/                         # Spring Boot API
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/example/shop/
│           │   ├── ShopApplication.java
│           │   ├── entity/
│           │   │   ├── Category.java
│           │   │   ├── Product.java
│           │   │   ├── Order.java
│           │   │   └── OrderItem.java
│           │   └── repository/
│           │       ├── CategoryRepository.java
│           │       ├── ProductRepository.java
│           │       ├── OrderRepository.java
│           │       └── OrderItemRepository.java
│           └── resources/
│               └── application.properties
└── frontend/                        # ReactJS App
    ├── package.json
    └── src/
        ├── App.js
        ├── services/api.js
        └── pages/
            ├── ProductList.js
            ├── ProductDetail.js
            └── Cart.js
```

---

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 15+

### 1. Tạo Database
```sql
CREATE DATABASE shop_db;
```

### 2. Cấu hình Backend
Chỉnh sửa file `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### 3. Chạy Backend
```bash
cd backend
mvn spring-boot:run
```
> API chạy tại: http://localhost:8080

### 4. Chạy Frontend
```bash
cd frontend
npm install
npm start
```
> Web chạy tại: http://localhost:3000

---

## 🗂️ API Endpoints

| Method | Endpoint                   | Mô tả                    |
|--------|----------------------------|--------------------------|
| GET    | /api/products              | Lấy danh sách sản phẩm   |
| GET    | /api/products/{id}         | Chi tiết sản phẩm        |
| GET    | /api/products/search       | Tìm kiếm sản phẩm        |
| GET    | /api/categories            | Lấy danh sách danh mục   |
| POST   | /api/orders                | Tạo đơn hàng mới         |
| GET    | /api/orders/{id}           | Chi tiết đơn hàng        |

---

## 🛠️ Công nghệ sử dụng

- **Backend**: Spring Boot 3.2, Spring Data JPA, Lombok, PostgreSQL
- **Frontend**: React 18, React Router v6, Axios
