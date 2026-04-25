-- ============================================================
--  SHOP DATABASE — SEED DATA
--  Chạy tự động khi Spring Boot khởi động
--  (spring.sql.init.mode=always trong application.properties)
-- ============================================================

-- Xóa dữ liệu cũ theo đúng thứ tự để tránh lỗi FK
TRUNCATE TABLE order_items  RESTART IDENTITY CASCADE;
TRUNCATE TABLE orders       RESTART IDENTITY CASCADE;
TRUNCATE TABLE products     RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories   RESTART IDENTITY CASCADE;

-- ============================================================
--  CATEGORIES (8 danh mục)
-- ============================================================
INSERT INTO categories (name, description) VALUES
  ('Thời Trang Nam',    'Quần áo, phụ kiện thời trang dành cho nam giới'),
  ('Thời Trang Nữ',    'Quần áo, phụ kiện thời trang dành cho nữ giới'),
  ('Điện Tử',          'Điện thoại, laptop, tai nghe và thiết bị điện tử'),
  ('Gia Dụng',         'Đồ dùng nhà bếp, nội thất và thiết bị gia đình'),
  ('Sách & Văn Phòng', 'Sách, dụng cụ học tập và văn phòng phẩm'),
  ('Thể Thao',         'Dụng cụ thể thao, gym và hoạt động ngoài trời'),
  ('Làm Đẹp',         'Mỹ phẩm, chăm sóc da và sản phẩm làm đẹp'),
  ('Thực Phẩm',        'Thực phẩm sạch, đồ uống và thực phẩm chức năng');

-- ============================================================
--  PRODUCTS (40 sản phẩm — 5 sản phẩm mỗi danh mục)
-- ============================================================

-- ── Thời Trang Nam (category_id = 1) ──
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
(
  'Áo Thun Nam Basic Oversize',
  'Chất liệu 100% cotton cao cấp, form oversize thoải mái. Phù hợp mặc hàng ngày hoặc đi chơi cuối tuần. Đa dạng màu sắc: đen, trắng, xám, be.',
  189000, 120,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  1
),
(
  'Quần Jean Nam Slim Fit',
  'Denim co giãn 4 chiều, form slim ôm gọn chân. Wash stone nhạt thời trang, bền màu sau nhiều lần giặt. Size 28-36.',
  459000, 85,
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
  1
),
(
  'Áo Polo Nam Pique Cotton',
  'Vải pique cotton thoáng mát, cổ bẻ lịch sự. Phù hợp đi làm casual hoặc đi chơi. Logo thêu tinh tế ở ngực trái.',
  320000, 60,
  'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80',
  1
),
(
  'Quần Short Nam Kaki',
  'Vải kaki dày dặn, form regular thoải mái. Lưng thun co giãn tiện lợi. Màu be, navy, olive. Phù hợp đi biển và dã ngoại.',
  275000, 95,
  'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80',
  1
),
(
  'Áo Khoác Bomber Nam',
  'Chất liệu polyester chống gió nhẹ, lót lưới thoáng mát. Thiết kế cổ đứng, khóa kéo chất lượng cao. Màu đen, xanh navy.',
  650000, 40,
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
  1
),

-- ── Thời Trang Nữ (category_id = 2) ──
(
  'Váy Maxi Hoa Nhí Dáng Dài',
  'Vải voan mềm mại nhẹ nhàng, họa tiết hoa nhí tinh tế. Thiết kế cổ V quyến rũ, dáng suông thanh lịch. Phù hợp đi biển hoặc dạo phố.',
  385000, 75,
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80',
  2
),
(
  'Áo Blouse Nữ Tay Phồng',
  'Chất liệu cotton linen tự nhiên, thoáng mát. Tay phồng bồng bềnh trẻ trung, cổ tròn nhẹ nhàng. Màu trắng, hồng pastel, xanh mint.',
  295000, 90,
  'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80',
  2
),
(
  'Quần Culottes Nữ Lưng Cao',
  'Vải tuyết mưa cao cấp, dáng culottes ống rộng cá tính. Lưng cao tôn dáng, bo eo tạo điểm nhấn. Size S-XL.',
  340000, 65,
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80',
  2
),
(
  'Đầm Bodycon Ôm Dáng',
  'Vải thun gân co giãn 4 chiều, ôm sát tôn đường cong. Thiết kế cổ tròn đơn giản, dài đến gối. Màu đen, đỏ đô, xanh emerald.',
  420000, 55,
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80',
  2
),
(
  'Áo Len Nữ Cổ Lọ Dệt Kim',
  'Len mềm mại giữ ấm tốt, dệt kim họa tiết nổi bắt mắt. Cổ lọ cao thời thượng. Phù hợp mùa thu đông. Màu kem, caramel, xanh slate.',
  480000, 45,
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80',
  2
),

-- ── Điện Tử (category_id = 3) ──
(
  'Tai Nghe Bluetooth Sony WH-1000XM5',
  'Chống ồn chủ động hàng đầu thế giới, âm thanh Hi-Res Audio. Pin 30 giờ, sạc nhanh 10 phút = 5 giờ. Kết nối multipoint 2 thiết bị đồng thời.',
  8900000, 30,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  3
),
(
  'Chuột Gaming Logitech G502 X',
  'Cảm biến HERO 25K độ chính xác cao, 13 nút lập trình. Trọng lượng có thể điều chỉnh 79-101g. DPI 100-25600, polling rate 1000Hz.',
  1650000, 50,
  'https://images.unsplash.com/photo-1527864550417-7519e1d6c52c?w=400&q=80',
  3
),
(
  'Bàn Phím Cơ Keychron K8 Pro',
  'Switch Gateron G Pro Brown, layout TKL 87 phím. Kết nối không dây Bluetooth 5.1 hoặc có dây USB-C. Hot-swap thay switch dễ dàng. Đèn RGB backlit.',
  2200000, 25,
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  3
),
(
  'Sạc Dự Phòng Anker 20000mAh',
  'Dung lượng 20000mAh sạc được 4-5 lần điện thoại. Sạc nhanh PowerIQ 3.0 & PD 20W. 2 cổng USB-A + 1 cổng USB-C. Nhỏ gọn, an toàn với pin Li-Polymer.',
  750000, 80,
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
  3
),
(
  'Đồng Hồ Thông Minh Samsung Galaxy Watch 6',
  'Màn hình Super AMOLED 1.5", theo dõi sức khỏe 24/7. Đo nhịp tim, SpO2, ECG, theo dõi giấc ngủ. Chống nước 5ATM, GPS tích hợp. Pin 40 giờ.',
  6500000, 20,
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  3
),

-- ── Gia Dụng (category_id = 4) ──
(
  'Nồi Chiên Không Dầu Xiaomi 5L',
  'Dung tích 5L phù hợp gia đình 3-5 người. Công suất 1800W, nhiệt độ 40-200°C điều chỉnh linh hoạt. Màn hình cảm ứng, hẹn giờ 60 phút. Không dùng dầu, ăn uống lành mạnh hơn.',
  1290000, 35,
  'https://images.unsplash.com/photo-1648997773786-5d8a89598ca7?w=400&q=80',
  4
),
(
  'Máy Xay Sinh Tố Philips HR2221',
  'Công suất 600W mạnh mẽ, 2 tốc độ + chế độ xung. Cối thủy tinh 1.25L bền, không BPA. Lưỡi dao thép không gỉ 4 cánh. Bảo hành 2 năm chính hãng.',
  890000, 45,
  'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80',
  4
),
(
  'Bộ Dao Bếp Inox 5 Món',
  'Thép inox 420 không gỉ, cứng và sắc bén lâu dài. Bao gồm: dao chủ bếp, dao thái, dao gọt, dao chặt, kéo bếp. Cán nhựa ABS chống trơn trượt.',
  450000, 60,
  'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&q=80',
  4
),
(
  'Chảo Chống Dính Ceramic 28cm',
  'Lớp phủ ceramic không độc hại, không chứa PTFE/PFOA. Đáy từ dùng được tất cả bếp kể cả bếp từ. Tay cầm silicon cách nhiệt. Đường kính 28cm phù hợp gia đình.',
  380000, 70,
  'https://images.unsplash.com/photo-1584990347449-39bbd34efb1a?w=400&q=80',
  4
),
(
  'Máy Lọc Không Khí Xiaomi 4 Lite',
  'Lọc bụi mịn PM2.5, vi khuẩn và mùi hôi hiệu quả. Bộ lọc HEPA H13 3 lớp. Diện tích lọc 28m², tiêu thụ điện chỉ 33W. Kết nối app Mihome điều khiển từ xa.',
  1850000, 22,
  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
  4
),

-- ── Sách & Văn Phòng (category_id = 5) ──
(
  'Sách "Đắc Nhân Tâm" Dale Carnegie',
  'Cuốn sách self-help kinh điển nhất mọi thời đại. Bản dịch tiếng Việt chuẩn xác, bìa cứng cao cấp. Hơn 30 triệu bản được bán trên toàn thế giới. NXB Tổng hợp TP.HCM.',
  89000, 200,
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
  5
),
(
  'Bút Máy LAMY Safari Màu Xanh',
  'Thân bút nhựa ABS bền chắc, thiết kế ergonomic cầm thoải mái. Ngòi thép không gỉ EF/F/M. Bơm mực cartridge tiện lợi. Kèm 1 hộp mực xanh.',
  420000, 40,
  'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80',
  5
),
(
  'Sổ Tay Bullet Journal A5 Dotted',
  'Giấy Tomoe River 52gsm mỏng không lem mực. Bìa cứng vải canvas, gáy dán chắc chắn. 240 trang, chấm dot 5mm tiện vẽ layout. Kèm bookmark và elastic band.',
  185000, 150,
  'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80',
  5
),
(
  'Bộ Màu Chì Faber-Castell 48 Màu',
  'Ruột chì mềm cho màu sắc tươi sáng, không gãy khi vót. Lõi 3.8mm chất lượng cao, bền màu. Hộp kim loại sang trọng, có thể tái sử dụng. Phù hợp học sinh và người đam mê vẽ.',
  320000, 80,
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80',
  5
),
(
  'Đèn Bàn LED Chống Cận',
  'Ánh sáng 3 màu (ấm/trung/lạnh), 10 mức độ sáng. Không flicker bảo vệ mắt, chỉ số CRI>95. Cổng USB-A sạc điện thoại. Cần đèn linh hoạt 360°, kẹp bàn đa năng.',
  285000, 55,
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
  5
),

-- ── Thể Thao (category_id = 6) ──
(
  'Giày Chạy Bộ Nike Air Zoom Pegasus 40',
  'Đệm Air Zoom phản hồi năng lượng tốt, êm chân khi chạy dài. Mũi giày rộng thoải mái cho ngón chân. Độ bền cao với đế ReactX foam. Phù hợp runner mọi trình độ.',
  2850000, 28,
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  6
),
(
  'Tạ Tay Cao Su 5kg (1 đôi)',
  'Lớp phủ cao su dày không trầy sàn, chống ồn khi tập. Tay cầm inox khía chống trơn. Trọng lượng chính xác ±2%. Phù hợp tập gym tại nhà.',
  380000, 50,
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  6
),
(
  'Thảm Yoga TPE 6mm Cao Cấp',
  'Chất liệu TPE thân thiện môi trường, không mùi. Độ dày 6mm êm ái bảo vệ khớp gối. Bề mặt vân lưới chống trơn 2 mặt. Kèm dây buộc tiện mang đi.',
  290000, 65,
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  6
),
(
  'Bình Nước Thể Thao 750ml',
  'Nhựa Tritan không BPA an toàn sức khỏe. Nắp flip-top mở 1 tay tiện lợi, khóa chống rò rỉ. Vạch đo ml/oz hai mặt. Phù hợp đựng đá, giữ lạnh 12 giờ.',
  145000, 120,
  'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&q=80',
  6
),
(
  'Dây Nhảy Thể Thao Có Bộ Đếm',
  'Dây PVC siêu nhẹ tốc độ cao, vòng bi ổ đỡ trơn mượt. Tay cầm nhựa ABS có bộ đếm số lần nhảy kỹ thuật số. Có thể điều chỉnh độ dài. Phù hợp cardio tại nhà.',
  125000, 100,
  'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&q=80',
  6
),

-- ── Làm Đẹp (category_id = 7) ──
(
  'Serum Vitamin C 20% L''Oreal Revitalift',
  'Nồng độ Vitamin C thuần 20% làm sáng da, mờ thâm nám. Kết hợp Hyaluronic Acid giữ ẩm sâu. Texture nhẹ thấm nhanh, không nhờn rít. 30ml dùng 1-2 tháng.',
  485000, 60,
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
  7
),
(
  'Kem Chống Nắng Anessa SPF50+ PA++++',
  'Chỉ số bảo vệ SPF50+ PA++++ chống UVA/UVB toàn diện. Công thức Aqua Booster không trôi khi đổ mồ hôi. Kết cấu sữa lỏng dễ tán đều, không gây bít lỗ chân lông.',
  420000, 75,
  'https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?w=400&q=80',
  7
),
(
  'Mặt Nạ Dưỡng Ẩm Laneige Water Sleeping Mask',
  'Mặt nạ ngủ cấp ẩm chuyên sâu, thức dậy da mềm mượt. Công nghệ SLEEPSCENT™ giúp ngủ sâu hơn. Chiết xuất hoa anh đào và dâu tây. 70ml dùng được 2-3 tháng.',
  650000, 45,
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80',
  7
),
(
  'Son Môi Lì MAC Matte Lipstick',
  'Công thức matte lì mịn, màu sắc chuẩn, lên màu đẹp chỉ một lần kẻ. Không gây khô môi nhờ bổ sung dưỡng chất. Hơn 20 shade đa dạng từ nude đến đỏ đô.',
  520000, 80,
  'https://images.unsplash.com/photo-1586495777744-4e6232bf2fd7?w=400&q=80',
  7
),
(
  'Máy Rửa Mặt Foreo Luna 3',
  'Sóng siêu âm T-Sonic 8000 rung/phút làm sạch sâu lỗ chân lông. Silicon y tế mềm mại an toàn cho da nhạy cảm. Chống nước IPX7, sạc USB 1 lần dùng 1 năm. Kết nối app FOREO.',
  3200000, 15,
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
  7
),

-- ── Thực Phẩm (category_id = 8) ──
(
  'Yến Mạch Cán Dẹt Quaker Organic 1kg',
  'Yến mạch hữu cơ nguyên cám, không chất bảo quản. Giàu beta-glucan giúp no lâu, tốt cho tim mạch. Nấu chín trong 5 phút. Dùng ăn sáng hoặc làm bánh.',
  185000, 150,
  'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=400&q=80',
  8
),
(
  'Hạnh Nhân Rang California 500g',
  'Hạnh nhân California loại 1, rang mộc không muối không dầu. Giàu Vitamin E, protein và chất béo lành mạnh. Bảo quản túi zip giữ độ giòn. Nhập khẩu chính ngạch.',
  245000, 90,
  'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80',
  8
),
(
  'Mật Ong Rừng Tây Nguyên 500ml',
  'Mật ong rừng nguyên chất 100%, thu hoạch tự nhiên từ Tây Nguyên. Không pha đường, không qua xử lý nhiệt. Hàm lượng HMF thấp, enzym tự nhiên còn nguyên vẹn. Cô đặc, màu vàng sậm.',
  320000, 60,
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
  8
),
(
  'Trà Matcha Uji Nhật Bản 100g',
  'Matcha ceremonial grade xuất xứ Uji, Kyoto. Màu xanh ngọc tươi sáng, hương thơm dịu, vị umami đặc trưng. Nghiền bằng đá granite truyền thống. Dùng pha trà hoặc làm bánh.',
  480000, 40,
  'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80',
  8
),
(
  'Protein Whey Optimum Nutrition Gold Standard 2lb',
  '24g protein tinh khiết mỗi serving, BCAA và Glutamine tự nhiên. Tan nhanh không vón cục, hơn 20 hương vị. Không chứa aspartame. Chứng nhận GMP, Informed-Sport. Phù hợp sau tập gym.',
  850000, 35,
  'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80',
  8
);
