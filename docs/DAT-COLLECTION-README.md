# Postman Collection - Phần của Đạt

## 📦 File Collection
`dat-postman-collection.json`

## 📋 Nội dung

### Module 03 — Client Cart (15 tests)
- **03.1 View Cart** (2 tests)
- **03.2 Add to Cart** (8 tests)
- **03.3 Update Cart** (4 tests)
- **03.4 Remove from Cart** (3 tests)

### Module 04 — Client Checkout (8 tests)
- **04.1 Place Order** (8 tests)
- **04.2 Post-order Assertions** (1 test)

### Module 05 — Client Orders (10 tests)
- **05.1 My Orders** (8 tests)
- **05.2 Cancel Order** (2 tests)

### Module 06 — Client Profile (6 tests)
- Profile CRUD operations (6 tests)

### Module 16 — E2E Scenarios (3 flows)
- **E2E-03**: Full Shopping Flow (6 steps)
- **E2E-04**: Multi-product Cart & Checkout (9 steps)
- **E2E-05**: Cancel Order Flow (6 steps)

**Tổng cộng: 39 unit tests + 3 E2E flows**

---

## 🚀 Cách sử dụng

### 1. Import vào Postman
1. Mở Postman
2. Click **Import** → chọn file `dat-postman-collection.json`
3. Collection sẽ xuất hiện trong sidebar

### 2. Cấu hình Collection Variables
Sau khi import, cần cập nhật các biến:

```
base_url: http://localhost:3000
test_product_id: 69bd766c8f031f668361a5ab (Vitamin A-Z)
test_product_id_2: 69bd766c8f031f668361a5e7 (Whey Protein)
test_product_id_3: 69bd766c8f031f668361a5ce (Trà Atiso)
test_order_id: (sẽ tự động set sau khi đặt hàng)
shipped_order_id: 69bd766c8f031f668361a61f
other_user_order_id: 69bd766c8f031f668361a632
```

### 3. Cấu hình Postman Settings
**QUAN TRỌNG:**
- ✅ Bật **Cookie Jar** để lưu session
- ❌ Tắt **Automatically follow redirects**
- ✅ Bật **Save cookies**

### 4. Thứ tự chạy test

#### Chạy từng module:
1. **Login trước** (dùng request từ collection khác hoặc browser)
2. Chạy Module 03 - Cart
3. Chạy Module 04 - Checkout
4. Chạy Module 05 - Orders
5. Chạy Module 06 - Profile

#### Chạy E2E flows:
- E2E flows đã bao gồm login, chạy độc lập được
- Dùng **Collection Runner** để chạy tuần tự

---

## 🔑 Điểm quan trọng

### Code đã fix:
1. **Cart delete** - Xóa 1 sản phẩm (không phải toàn bộ)
2. **Cart controller** - Trả JSON khi có header `Accept: application/json`
3. **Checkout** - Validation đầy đủ, trả `orderId` khi thành công
4. **Orders** - Dùng helper `respond()` để tự động JSON/HTML
5. **Profile** - Hỗ trợ JSON response, upload avatar

### Request format:
- **Cart/Orders/Profile**: `Content-Type: application/json`
- **Checkout**: `Content-Type: application/x-www-form-urlencoded`
- **Profile upload**: `Content-Type: multipart/form-data`

### Response format:
- Tất cả đều có header `Accept: application/json` để nhận JSON response
- Success response: `{ success: true, ... }`
- Error response: `{ success: false, message: "..." }`

---

## 📊 Test Coverage

| Module | Happy Path | Error Cases | Auth Guard | Total |
|--------|-----------|-------------|------------|-------|
| Cart | 3 | 5 | 1 | 15 |
| Checkout | 2 | 5 | 1 | 8 |
| Orders | 5 | 3 | 2 | 10 |
| Profile | 2 | 2 | 2 | 6 |
| **Total** | **12** | **15** | **6** | **39** |

---

## 🐛 Troubleshooting

### Lỗi "Chưa đăng nhập"
- Kiểm tra cookie session có được lưu không
- Login lại bằng browser hoặc Postman
- Đảm bảo Cookie Jar đã bật

### Test fail do productId không tồn tại
- Chạy script `get-products.js` để lấy product IDs mới
- Cập nhật Collection Variables

### Checkout fail "Giỏ hàng trống"
- Chạy lại "Add to Cart" trước khi checkout
- Kiểm tra cart có items: GET `/cart`

### Order không tìm thấy
- Kiểm tra `test_order_id` đã được set chưa
- Chạy lại E2E-03 để tạo order mới

---

## 📝 Notes

- Collection này khớp 100% với code đã fix
- Tất cả test cases theo đúng master plan
- Tên request và folder structure giống hệt file MD
- Sử dụng product IDs thực từ database
- E2E flows có thể chạy độc lập

---

## 👤 Tác giả
**Đạt** - Module 03, 04, 05, 06 + E2E-03, E2E-04, E2E-05
