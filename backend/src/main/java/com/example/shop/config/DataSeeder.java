package com.example.shop.config;

import com.example.shop.entity.*;
import com.example.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CouponRepository couponRepository;
    private final ReviewRepository reviewRepository;
    private final ProductVariantRepository productVariantRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Đang kiểm tra và tạo dữ liệu mẫu (Seeding data)...");

        User admin = null;
        User customer = null;
        Category catElectronics = null;
        Category catFashion = null;
        Category catHome = null;

        // 1. Tạo Users
        if (userRepository.count() == 0) {
            admin = User.builder()
                    .email("admin@shop.com")
                    .fullName("Administrator")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .build();

            customer = User.builder()
                    .email("customer@shop.com")
                    .fullName("Customer")
                    .password(passwordEncoder.encode("user123"))
                    .role(User.Role.USER)
                    .enabled(true)
                    .build();

            userRepository.saveAll(List.of(admin, customer));
        } else {
            admin = userRepository.findByEmail("admin@shop.com").orElse(null);
            customer = userRepository.findByEmail("customer@shop.com").orElse(null);
        }

        // 2. Tạo Categories
        if (categoryRepository.count() == 0) {
            catElectronics = Category.builder().name("Điện tử").description("Điện thoại, laptop, thiết bị công nghệ").build();
            catFashion = Category.builder().name("Thời trang").description("Quần áo, giày dép, phụ kiện").build();
            catHome = Category.builder().name("Nhà cửa").description("Đồ gia dụng, trang trí nhà cửa").build();
            categoryRepository.saveAll(List.of(catElectronics, catFashion, catHome));
        } else {
            List<Category> cats = categoryRepository.findAll();
            if (cats.size() >= 3) {
                catElectronics = cats.get(0);
                catFashion = cats.get(1);
                catHome = cats.get(2);
            }
        }

        // 3. Tạo Products
        if (productRepository.count() == 0 && catElectronics != null && catFashion != null) {
            Product p1 = Product.builder()
                    .name("Điện thoại iPhone 15 Pro Max")
                    .description("Siêu phẩm điện thoại mới nhất từ Apple với vỏ Titan.")
                    .price(new BigDecimal("29990000"))
                    .stock(50)
                    .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop")
                    .category(catElectronics)
                    .build();

            Product p2 = Product.builder()
                    .name("Laptop MacBook Pro 14 M3")
                    .description("Laptop chuyên nghiệp dành cho thiết kế và lập trình.")
                    .price(new BigDecimal("39990000"))
                    .stock(30)
                    .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop")
                    .category(catElectronics)
                    .build();

            Product p3 = Product.builder()
                    .name("Áo thun Cotton Nam")
                    .description("Áo thun chất liệu 100% cotton thoáng mát.")
                    .price(new BigDecimal("250000"))
                    .stock(200)
                    .imageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop")
                    .category(catFashion)
                    .build();

            Product p4 = Product.builder()
                    .name("Giày Sneaker Thể Thao")
                    .description("Giày chạy bộ cực êm ái, thích hợp dạo phố.")
                    .price(new BigDecimal("1200000"))
                    .stock(100)
                    .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop")
                    .category(catFashion)
                    .build();
                    
            Product p5 = Product.builder()
                    .name("Bàn phím cơ Keychron K8")
                    .description("Bàn phím cơ không dây TKL cực ngon cho Mac và Windows.")
                    .price(new BigDecimal("1800000"))
                    .stock(80)
                    .imageUrl("https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop")
                    .category(catElectronics)
                    .build();

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5));

            // 4. Tạo Product Images (Gallery)
            if (productImageRepository.count() == 0) {
                ProductImage pi1 = ProductImage.builder().product(p1).imageUrl("https://images.unsplash.com/photo-1696446700622-09c314b9cb2e?q=80&w=2070&auto=format&fit=crop").build();
                ProductImage pi2 = ProductImage.builder().product(p1).imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop").build();
                ProductImage pi3 = ProductImage.builder().product(p4).imageUrl("https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop").build();
                productImageRepository.saveAll(List.of(pi1, pi2, pi3));
            }

            // 5. Tạo Product Variants
            if (productVariantRepository.count() == 0) {
                ProductVariant v1 = ProductVariant.builder().product(p3).size("M").color("Trắng").stock(100).build();
                ProductVariant v2 = ProductVariant.builder().product(p3).size("L").color("Trắng").stock(50).build();
                ProductVariant v3 = ProductVariant.builder().product(p3).size("M").color("Đen").stock(50).build();
                
                ProductVariant v4 = ProductVariant.builder().product(p4).size("41").color("Xanh").stock(60).build();
                ProductVariant v5 = ProductVariant.builder().product(p4).size("42").color("Xanh").stock(40).build();

                productVariantRepository.saveAll(List.of(v1, v2, v3, v4, v5));
            }

            // 6. Tạo Đánh giá (Reviews) mẫu
            if (reviewRepository.count() == 0 && customer != null && admin != null) {
                Review r1 = Review.builder().product(p1).user(customer).rating(5).comment("Sản phẩm quá tuyệt vời, thiết kế rất đẹp!").build();
                Review r2 = Review.builder().product(p2).user(customer).rating(4).comment("Dùng rất mượt nhưng giá hơi cao.").build();
                Review r3 = Review.builder().product(p1).user(admin).rating(5).comment("Giao hàng siêu tốc độ, đóng gói cực kỳ cẩn thận.").build();
                reviewRepository.saveAll(List.of(r1, r2, r3));
            }
        }

        // 5. Tạo Coupons
        if (couponRepository.count() == 0) {
            Coupon c1 = Coupon.builder()
                    .code("TET2026")
                    .discountType(Coupon.DiscountType.PERCENT)
                    .discountValue(new BigDecimal("10")) // 10%
                    .minOrderValue(new BigDecimal("500000"))
                    .expirationDate(LocalDateTime.now().plusMonths(1))
                    .isActive(true)
                    .build();

            Coupon c2 = Coupon.builder()
                    .code("FREESHIP")
                    .discountType(Coupon.DiscountType.FIXED)
                    .discountValue(new BigDecimal("30000")) // 30.000 VNĐ
                    .minOrderValue(new BigDecimal("0"))
                    .expirationDate(LocalDateTime.now().plusMonths(2))
                    .isActive(true)
                    .build();

            couponRepository.saveAll(List.of(c1, c2));
        }

        System.out.println("Tạo dữ liệu mẫu thành công!");
    }
}
