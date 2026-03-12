# 🎓 Postman Automation - 6 Sprints cho Sinh Viên

## 📊 Tổng quan

**Công cụ**: Postman (GUI) + Newman (optional)  
**Mục tiêu**: 80 API test cases (VỪA PHẢI, CHẤT LƯỢNG)  
**Thời gian**: 6 tuần, mỗi tuần ~6-10 giờ  

---

## 👥 Phân bổ Team (4 sinh viên)

| Thành viên | Workload | Test Cases | Giờ/tuần |
|------------|----------|------------|----------|
| **Bạn** | 12% | ~10 tests | 4-5 giờ (NHẸ NHẤT) |
| **Thành viên A** | 33% | ~26 tests | 9-11 giờ |
| **Thành viên B** | 30% | ~24 tests + Docs | 8-10 giờ |
| **Thành viên C** | 25% | ~20 tests | 7-9 giờ |

**Tổng Story Points**: 100 points (~17 points/sprint)

---

## 🎯 Sprint 1: Setup & Auth (2 tuần)
**Goal**: Setup Postman + Test đăng nhập/đăng ký  
**Total**: 17 points | **Test cases**: 12-14

### Tasks

**KIEM-101: Setup Postman** (A - 2 pts)
- Tạo workspace
- Setup environment (base_url, token)
- Import sample request

**KIEM-102: POST /register (Full Flow)** (A - 4 pts)
- Test register step 1: Gửi OTP
- Test register step 2: Verify OTP
- Test register step 3: Create account
- Test với email đã tồn tại (error case)

**KIEM-103: POST /login** (C - 3 pts)
- Test login thành công
- Test login sai password
- Test login với email không tồn tại
- Save token to environment

**KIEM-104: POST /password/forgot + reset** (C - 3 pts)
- Test gửi OTP reset password
- Test verify OTP
- Test reset password thành công

**KIEM-105: Test Auth Edge Cases** (Bạn - 2 pts) ⭐
- Test login với empty fields
- Test register với invalid email format

**KIEM-106: Viết Report Sprint 1** (B - 3 pts) 📄
- Tổng kết: Setup xong, có bao nhiêu tests
- Screenshot Postman
- Test results summary
- 2-3 trang Word

---

## 🎯 Sprint 2: Product APIs (2 tuần)
**Goal**: Test CRUD sản phẩm  
**Total**: 17 points | **Test cases**: 14-16

### Tasks

**KIEM-201: Admin Product CRUD** (A - 5 pts)
- POST /admin/products/create - Test tạo product thành công
- POST /admin/products/create - Test với missing fields (error)
- PATCH /admin/products/edit/:id - Test update product
- DELETE /admin/products/delete-product/:id - Test soft delete
- Mock image = URL string

**KIEM-202: Client Product List** (C - 4 pts)
- GET /products - Test lấy danh sách products
- GET /products?page=1 - Test pagination page 1
- GET /products?page=2 - Test pagination page 2
- GET /products?search=vitamin - Test search

**KIEM-203: Client Product Detail** (C - 2 pts)
- GET /product/:slug - Test xem chi tiết product
- GET /product/invalid-slug - Test 404 error

**KIEM-204: Product Validation Tests** (B - 3 pts)
- Test create product với price = 0 (error)
- Test create product với stock âm (error)
- Test update product không tồn tại (404)

**KIEM-205: Review Product Collection** (Bạn - 1 pt) ⭐
- Check tất cả tests pass
- Verify assertions đúng

**KIEM-206: Viết Report Sprint 2** (B - 2 pts) 📄
- Tổng kết sprint 2
- Screenshot kết quả test
- Bug report (nếu có)

---

## 🎯 Sprint 3: Cart APIs (2 tuần)
**Goal**: Test giỏ hàng  
**Total**: 17 points | **Test cases**: 14-16

### Tasks

**KIEM-301: Cart Add Operations** (A - 5 pts)
- POST /cart/add - Test thêm product mới vào cart
- POST /cart/add - Test thêm product đã có (tăng quantity)
- POST /cart/add - Test với quantity = 0 (error)
- POST /cart/add - Test với invalid productId (404)
- POST /cart/add - Test without authentication (401)

**KIEM-302: Cart Update Operations** (C - 4 pts)
- POST /cart/update - Test tăng quantity
- POST /cart/update - Test giảm quantity
- POST /cart/update - Test update quantity = 0 (remove)
- POST /cart/update - Test với invalid productId

**KIEM-303: Cart View & Delete** (C - 2 pts)
- GET /cart - Test xem giỏ hàng có items
- GET /cart - Test xem giỏ hàng rỗng
- POST /cart/delete - Test xóa product khỏi cart

**KIEM-304: Cart Calculation Tests** (B - 3 pts)
- Test cart total calculation
- Test cart với multiple products
- Test cart item count

**KIEM-305: Test Cart Edge Cases** (Bạn - 1 pt) ⭐
- Test add product với quantity âm (error)
- Test cart với product đã bị xóa

**KIEM-306: Viết Report Sprint 3** (B - 2 pts) 📄
- Mid-project report
- Đã làm được 50% (~40 tests)
- Coverage analysis

---

## 🎯 Sprint 4: Checkout & Orders (2 tuần)
**Goal**: Test thanh toán & xem đơn hàng  
**Total**: 17 points | **Test cases**: 12-14

### Tasks

**KIEM-401: Checkout Operations** (A - 5 pts)
- POST /checkout - Test tạo order từ cart thành công
- POST /checkout - Test với shipping info đầy đủ
- POST /checkout - Test với empty cart (error)
- POST /checkout - Test với missing shipping info (error)
- Verify: order created, cart cleared, stock reduced

**KIEM-402: Client Orders View** (C - 4 pts)
- GET /orders - Test xem danh sách orders
- GET /orders - Test pagination
- GET /orders?status=pending - Test filter by status
- GET /orders/:id - Test xem chi tiết order

**KIEM-403: Order Validation Tests** (B - 4 pts)
- Test get order với invalid ID (404)
- Test user chỉ xem được orders của mình
- Test order detail có đầy đủ items
- Test order total calculation

**KIEM-404: Review Checkout Flow** (Bạn - 2 pts) ⭐
- Test checkout với multiple products
- Verify cart cleared after checkout

**KIEM-405: Viết Report Sprint 4** (B - 2 pts) 📄
- Tổng kết checkout & orders
- Test execution results
- Demo video (optional)

---

## 🎯 Sprint 5: Admin Orders & Newman (2 tuần)
**Goal**: Test quản lý đơn hàng + Setup automation  
**Total**: 16 points | **Test cases**: 12-14

### Tasks

**KIEM-501: Admin Orders Management** (A - 5 pts)
- GET /admin/orders - Test admin xem tất cả orders
- GET /admin/orders?status=pending - Test filter by status
- GET /admin/orders?page=1 - Test pagination
- POST /admin/orders/:id/status - Test update status: pending → confirmed
- POST /admin/orders/:id/status - Test update status: confirmed → shipping → completed

**KIEM-502: Order Status Transitions** (C - 3 pts)
- Test valid status transitions
- Test invalid status transitions (error)
- Test update status với invalid order ID (404)

**KIEM-503: Order Permissions Tests** (C - 2 pts)
- Test user chỉ xem order của mình (403 nếu xem order người khác)
- Test admin xem tất cả orders
- Test user không thể update order status (403)

**KIEM-504: Setup Newman CLI** (B - 3 pts)
- Install Newman
- Run collection via CLI
- Generate HTML report

**KIEM-505: Test Order Edge Cases** (Bạn - 1 pt) ⭐
- Test update status với invalid value
- Test cancel order

**KIEM-506: Viết Report Sprint 5** (B - 2 pts) 📄
- Tổng kết sprint 5
- Newman setup guide
- Chuẩn bị báo cáo cuối

---

## 🎯 Sprint 6: E2E Testing & Final Report (2 tuần)
**Goal**: E2E scenarios + Regression + Báo cáo cuối  
**Total**: 16 points | **Test cases**: 10-12

### Tasks

**KIEM-601: E2E Shopping Flow** (A - 4 pts)
- E2E: Register → Login → Browse Products → Add to Cart → Checkout → View Order
- Chain multiple requests với variables
- Verify toàn bộ flow thành công

**KIEM-602: E2E Admin Flow** (A - 3 pts)
- E2E: Admin Login → Create Product → View Products → Update Order Status
- Verify admin operations

**KIEM-603: Regression Testing** (C - 3 pts)
- Run tất cả collections via Newman
- Generate HTML report
- Fix failing tests

**KIEM-604: Additional E2E Scenarios** (B - 2 pts)
- E2E: Password Reset Flow (full)
- E2E: Multiple Products Checkout

**KIEM-605: Final Review & Approval** (Bạn - 2 pts) ⭐
- Review toàn bộ 80 test cases
- Run full regression
- Approve for submission

**KIEM-606: Viết Báo Cáo Cuối** (B - 2 pts) 📄
- Báo cáo tổng kết (8-12 trang)
- Tổng số test cases: 80
- Screenshots, test results
- Video demo (5-7 phút)
- Kết luận + Kiến nghị

---

## 📊 Tổng kết 6 Sprints

### Phân bổ Story Points

| Thành viên | Total Points | Test Cases | Nhiệm vụ |
|------------|--------------|------------|----------|
| **Bạn** | 12 points | ~10 tests | Review + Edge cases (RẢI RÁC) |
| **Thành viên A** | 33 points | ~26 tests | Main APIs + E2E |
| **Thành viên B** | 30 points | ~24 tests + Docs | APIs + **BÁO CÁO MỖI TUẦN** |
| **Thành viên C** | 25 points | ~20 tests | CRUD APIs + Validation |
| **TOTAL** | **100 points** | **~80 tests** | - |

### Công việc của BẠN (12 points - NHẸ NHẤT)

| Sprint | Task | Points | Test Cases | Thời gian |
|--------|------|--------|------------|-----------|
| Sprint 1 | Test Auth Edge Cases | 2 | 2 tests | 1-2 giờ |
| Sprint 2 | Review Product Collection | 1 | - | 1 giờ |
| Sprint 3 | Test Cart Edge Cases | 1 | 2 tests | 1-2 giờ |
| Sprint 4 | Review Checkout Flow | 2 | 2 tests | 2 giờ |
| Sprint 5 | Test Order Edge Cases | 1 | 2 tests | 1-2 giờ |
| Sprint 6 | Final Review & Approval | 2 | 2 tests | 2-3 giờ |
| **TOTAL** | **6 tasks** | **12** | **~10 tests** | **4-5 giờ/tuần** |

**Đặc điểm:**
- ✅ RẢI ĐỀU qua 6 sprints
- ✅ Chủ yếu review + test edge cases nhẹ
- ✅ KHÔNG viết báo cáo
- ✅ 4-5 giờ/tuần (1-2 BUỔI)

---

## 🛠️ Postman Setup (ĐƠN GIẢN)

### 1. Cài đặt
- Download Postman Desktop: https://www.postman.com/downloads/
- Tạo account (free)
- Tạo workspace: "Verdish Testing"

### 2. Environment Setup

```
base_url: http://localhost:3000
user_token: (để trống, sẽ tự động set)
admin_token: (để trống, sẽ tự động set)
```

### 3. Collection Structure (ĐƠN GIẢN)

```
Verdish Testing/
├── 01-Auth (6-8 tests)
│   ├── POST Register
│   ├── POST Login
│   └── POST Forgot Password
│
├── 02-Products (6-8 tests)
│   ├── POST Create Product
│   ├── GET Product List
│   ├── GET Product Detail
│   └── PATCH Update Product
│
├── 03-Cart (6-8 tests)
│   ├── POST Add to Cart
│   ├── POST Update Cart
│   ├── GET View Cart
│   └── POST Delete from Cart
│
├── 04-Checkout (4-6 tests)
│   ├── POST Checkout
│   ├── GET My Orders
│   └── GET Order Detail
│
├── 05-Admin-Orders (4-6 tests)
│   ├── GET All Orders
│   └── POST Update Status
│
└── 06-E2E (2-4 tests)
    └── E2E Shopping Flow
```

**Tổng: 40-50 test cases**

---

## 📝 Test Script Template (COPY-PASTE)

### Template 1: Test Status Code

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

### Template 2: Test Response Body

```javascript
pm.test("Response has data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});
```

### Template 3: Save Token

```javascript
// Sau khi login
var jsonData = pm.response.json();
pm.environment.set("user_token", jsonData.token);
```

### Template 4: Use Token

```javascript
// Trong Headers tab
Authorization: Bearer {{user_token}}
```

---

## 📊 Ví dụ Test Case

### Test 1: POST /login

**Request:**
```json
POST {{base_url}}/login
Body:
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Tests:**
```javascript
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
});

pm.test("Token received", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.exist;
    pm.environment.set("user_token", jsonData.token);
});
```

### Test 2: POST /cart/add

**Request:**
```json
POST {{base_url}}/cart/add
Headers:
  Authorization: Bearer {{user_token}}
Body:
{
  "productId": "673abc123def456",
  "quantity": 2
}
```

**Tests:**
```javascript
pm.test("Product added to cart", function () {
    pm.response.to.have.status(200);
});

pm.test("Cart has items", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.cart.items.length).to.be.above(0);
});
```

---

## 📄 Báo Cáo Mỗi Tuần (Thành viên B làm)

### 3. Collection Structure

```
Verdish Testing/
├── 01-Auth (12-14 tests)
│   ├── POST Register (Step 1, 2, 3)
│   ├── POST Login (Success, Fail, Invalid)
│   ├── POST Forgot Password
│   ├── POST Verify OTP
│   ├── POST Reset Password
│   └── Edge Cases (Empty fields, Invalid email)
│
├── 02-Products (14-16 tests)
│   ├── 📁 Admin
│   │   ├── POST Create Product (Success, Error)
│   │   ├── PATCH Update Product
│   │   ├── DELETE Delete Product
│   │   └── Validation Tests
│   └── 📁 Client
│       ├── GET Product List (Page 1, 2, Search)
│       ├── GET Product Detail
│       └── Error Cases (404)
│
├── 03-Cart (14-16 tests)
│   ├── POST Add to Cart (New, Existing, Errors)
│   ├── POST Update Cart (Increase, Decrease, Zero)
│   ├── GET View Cart (With items, Empty)
│   ├── POST Delete from Cart
│   ├── Cart Calculations
│   └── Edge Cases (Invalid ID, Auth)
│
├── 04-Checkout-Orders (12-14 tests)
│   ├── POST Checkout (Success, Errors)
│   ├── GET My Orders (List, Pagination, Filter)
│   ├── GET Order Detail
│   └── Validation Tests
│
├── 05-Admin-Orders (12-14 tests)
│   ├── GET All Orders (List, Filter, Pagination)
│   ├── POST Update Status (Transitions)
│   ├── Permissions Tests
│   └── Edge Cases
│
└── 06-E2E (10-12 tests)
    ├── E2E Shopping Flow
    ├── E2E Admin Flow
    ├── E2E Password Reset
    └── E2E Multiple Products
```

**Tổng: ~80 test cases**

---

## 📄 Báo Cáo Mỗi Tuần (Thành viên B làm)

### Template Báo Cáo (2-3 trang)

```
BÁO CÁO TUẦN [X] - POSTMAN AUTOMATION TESTING

1. Mục tiêu tuần này:
   - [Liệt kê mục tiêu]

2. Công việc đã hoàn thành:
   - [Thành viên A]: [X] test cases
   - [Thành viên B]: [X] test cases
   - [Thành viên C]: [X] test cases
   - [Bạn]: Review/Testing

3. Kết quả:
   - Tổng test cases: [X]/80
   - Tests pass: [X]
   - Tests fail: [X]
   - Screenshot: [Chèn ảnh Postman]

4. Vấn đề gặp phải:
   - [Liệt kê nếu có]

5. Kế hoạch tuần sau:
   - [Liệt kê]
```

---

## 📄 Báo Cáo Cuối (5-10 trang)

### Outline Báo Cáo Cuối (8-12 trang)

```
1. GIỚI THIỆU (1-2 trang)
   - Mục tiêu đồ án
   - Công cụ sử dụng: Postman
   - Phạm vi testing

2. PHƯƠNG PHÁP (1 trang)
   - API Testing là gì?
   - Tại sao dùng Postman?
   - Quy trình testing

3. THIẾT KẾ TEST CASES (2-3 trang)
   - Collection structure
   - Environment setup
   - Test script examples
   - Screenshots

4. KẾT QUẢ THỰC HIỆN (3-4 trang)
   - Tổng số test cases: 80
   - Phân bổ theo module:
     * Auth: 12-14 tests
     * Products: 14-16 tests
     * Cart: 14-16 tests
     * Checkout & Orders: 12-14 tests
     * Admin Orders: 12-14 tests
     * E2E: 10-12 tests
   - Screenshots kết quả
   - Bugs tìm được (nếu có)

5. VIDEO DEMO (5-7 phút)
   - Chạy collection
   - Xem kết quả
   - Giải thích 2-3 test cases

6. KẾT LUẬN (1 trang)
   - Đã đạt được gì
   - Khó khăn
   - Kiến nghị
```

---

## 🎯 Checklist Để PASS MÔN

### Yêu cầu tối thiểu:

✅ **80 test cases** (chất lượng tốt)  
✅ **6 collections** (Auth, Product, Cart, Checkout, Orders, E2E)  
✅ **Tests pass** (ít nhất 85%)  
✅ **Báo cáo mỗi tuần** (6 báo cáo, 2-3 trang/báo cáo)  
✅ **Báo cáo cuối** (8-12 trang)  
✅ **Video demo** (5-7 phút)  
✅ **Screenshots** (Postman UI, test results, Newman reports)  

### Bonus (nếu muốn điểm cao):

⭐ Newman CLI (chạy tests từ command line)  
⭐ HTML Report (newman-reporter-htmlextra)  
⭐ E2E test case (chain requests)  
⭐ Tìm được bugs thật  

---

## 💡 Tips cho Sinh Viên

### 1. Phân công hợp lý
- **Bạn**: Review + test edge cases (4-5 giờ/tuần)
- **A**: Làm nhiều nhất (9-11 giờ/tuần)
- **B**: Vừa phải + viết báo cáo (8-10 giờ/tuần)
- **C**: Vừa phải (7-9 giờ/tuần)

### 2. Làm việc nhóm
- Họp online 30 phút/tuần
- Share Postman workspace
- Ai làm xong phần nào thì update Jira

### 3. Cân bằng chất lượng
- 80 tests là VỪA PHẢI (không ít, không nhiều)
- Test happy path + error cases quan trọng
- Không cần 100% coverage, 70-80% là tốt

### 4. Copy-paste thông minh
- Dùng test script templates
- Copy từ test này sang test khác
- Chỉ sửa URL và assertions

### 5. Screenshots quan trọng
- Chụp Postman UI
- Chụp test results
- Chụp collection structure
- Để vào báo cáo

---

## 🎓 Grading Rubric (Dự đoán)

| Tiêu chí | Điểm | Ghi chú |
|----------|------|---------|
| Test Cases (40-50) | 40% | Đủ số lượng, chạy được |
| Báo cáo tuần (6 báo cáo) | 15% | Đầy đủ, có screenshots |
| Báo cáo cuối | 25% | 5-10 trang, có structure |
| Video demo | 10% | 3-5 phút, rõ ràng |
| Presentation | 10% | Trình bày tốt |
| **TOTAL** | **100%** | - |

---

## 🚀 Timeline Thực Tế

### Tuần 1-2 (Sprint 1):
- Ngày 1-2: Setup Postman, học cách dùng
- Ngày 3-9: Viết Auth tests (12-14 tests)
- Ngày 10-12: Review, fix bugs
- Ngày 13-14: Viết báo cáo tuần 1

### Tuần 3-4 (Sprint 2):
- Viết Product tests (14-16 tests)
- Báo cáo tuần 2

### Tuần 5-6 (Sprint 3):
- Viết Cart tests (14-16 tests)
- Báo cáo tuần 3 (mid-project, ~40 tests done)

### Tuần 7-8 (Sprint 4):
- Viết Checkout & Orders tests (12-14 tests)
- Báo cáo tuần 4

### Tuần 9-10 (Sprint 5):
- Viết Admin Orders tests (12-14 tests)
- Setup Newman CLI
- Báo cáo tuần 5

### Tuần 11-12 (Sprint 6):
- E2E tests (10-12 tests)
- Regression testing (chạy lại 80 tests)
- Viết báo cáo cuối (8-12 trang)
- Làm video demo (5-7 phút)
- Chuẩn bị presentation

---

## 🎉 Kết luận

### Tại sao phiên bản này phù hợp sinh viên?

✅ **Ít test cases**: 40-50 thay vì 80-100  
✅ **Đơn giản**: Chỉ Postman GUI, không cần code  
✅ **Ít giờ**: 5-8 giờ/tuần thay vì 20-30 giờ  
✅ **Bạn nhẹ nhất**: 3-4 giờ/tuần  
✅ **Realistic**: Sinh viên làm được  
✅ **Đủ để pass**: 40-50 tests + báo cáo = PASS  

### Phân bổ hợp lý:

- **Bạn**: 10% workload, rải rác, KHÔNG viết báo cáo
- **Thành viên B**: Viết BÁO CÁO MỖI TUẦN (nhưng ít tests hơn)
- **Thành viên A**: Làm nhiều nhất (nhưng vẫn OK)
- **Thành viên C**: Vừa phải

**Chúc các bạn làm đồ án thành công! 🎓🚀**
