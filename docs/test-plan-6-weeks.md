# 📋 Kế hoạch Test Case 6 Tuần - Verdish E-Commerce Platform (SIMPLIFIED)

## 📊 Tổng quan

**Mục tiêu**: Xây dựng test suite CHỈ CHO CORE FEATURES trong 6 tuần - dễ làm, đủ dùng.

**Phương pháp**: Chỉ test HAPPY PATH + 1-2 ERROR CASES quan trọng. Bỏ qua edge cases phức tạp.

**Framework đề xuất**: 
- **Jest** - Unit & Integration testing
- **Supertest** - API testing
- **Puppeteer** - E2E testing (chỉ 2-3 flows chính)

**Giảm từ 180-200 test cases → 80-100 test cases**

---

## 🎯 Phân bổ công việc theo tuần (RÚT GỌN)

### **Tuần 1 (Sprint 1): Setup & Authentication** 
**Release Version: v1.0.0-auth**

#### Mục tiêu
- Setup môi trường testing cơ bản
- Test CORE authentication flows (login, register)

#### Công việc chi tiết

**1. Setup Testing Environment (1 ngày)**
- [ ] Cài đặt Jest, Supertest
- [ ] Tạo file `jest.config.js` đơn giản
- [ ] Setup test database (dùng MongoDB thật, không dùng Memory Server)
- [ ] Tạo folder: `tests/auth/`, `tests/helpers/`
- [ ] Viết 2 helper functions: `createTestUser()`, `loginTestUser()`

**2. Unit Tests - Helper Functions (0.5 ngày) - CHỈ TEST QUAN TRỌNG**
- [ ] `helper/generateOtp.js` - Test OTP có 6 digits
- [ ] `helper/pagination.js` - Test 1 case cơ bản

**3. Integration Tests - Auth API (1.5 ngày) - CHỈ HAPPY PATH**
- [ ] POST `/register` + `/register/verify-otp` + `/register/create-account`
  - Test full flow: Gửi OTP → Verify → Tạo account (1 test dài)
- [ ] POST `/login` 
  - Test login thành công
  - Test login sai password (1 error case)
- [ ] POST `/password/forgot` + `/password/reset-password`
  - Test full flow reset password (1 test dài)

#### Deliverables
- ✅ 8-10 test cases (thay vì 25-30)
- ✅ Test coverage: Auth core flows (60%+)
- ✅ KHÔNG CẦN CI/CD (làm sau nếu có thời gian)

---

### **Tuần 2 (Sprint 2): Product Management**
**Release Version: v1.1.0-product**

#### Mục tiêu
- Test CRUD cơ bản cho Products
- BỎ QUA Category testing (không quan trọng lắm)

#### Công việc chi tiết

**1. Integration Tests - Product API (2 ngày) - CHỈ ADMIN**
- [ ] POST `/admin/products/create` 
  - Test tạo product thành công với đầy đủ fields
  - Mock Cloudinary upload (return fake URL)
- [ ] PATCH `/admin/products/edit/:id`
  - Test update product thành công
- [ ] DELETE `/admin/products/delete-product/:id`
  - Test soft delete thành công

**2. Integration Tests - Client Product View (1 ngày)**
- [ ] GET `/products`
  - Test lấy danh sách products
  - Test pagination (page 1, page 2)
- [ ] GET `/product/:slug`
  - Test xem chi tiết 1 product

#### Deliverables
- ✅ 10-12 test cases (thay vì 35-40)
- ✅ Test coverage: Product CRUD (60%+)
- ✅ BỎ QUA: Category, Product history, change status, search

---

### **Tuần 3 (Sprint 3): Cart Management**
**Release Version: v1.2.0-cart**

#### Mục tiêu
- Test shopping cart cơ bản
- BỎ QUA checkout (để tuần 4)

#### Công việc chi tiết

**1. Integration Tests - Cart API (2 ngày) - CHỈ HAPPY PATH**
- [ ] POST `/cart/add`
  - Test thêm product vào cart thành công
  - Test thêm product đã có (tăng quantity)
- [ ] POST `/cart/update`
  - Test tăng quantity
  - Test giảm quantity
- [ ] POST `/cart/delete`
  - Test xóa product khỏi cart
- [ ] GET `/cart`
  - Test xem cart với items
  - Test xem cart rỗng

#### Deliverables
- ✅ 8-10 test cases (thay vì 30-35)
- ✅ Test coverage: Cart CRUD (60%+)
- ✅ BỎ QUA: Stock validation, merge cart, edge cases

---

### **Tuần 4 (Sprint 4): Checkout & Orders**
**Release Version: v1.3.0-checkout**

#### Mục tiêu
- Test checkout flow
- Test xem orders
- BỎ QUA dashboard, roles, permissions

#### Công việc chi tiết

**1. Integration Tests - Checkout API (1.5 ngày)**
- [ ] POST `/checkout`
  - Test tạo order từ cart thành công
  - Test với shipping info đầy đủ
  - Verify order được tạo
  - Verify cart được clear

**2. Integration Tests - Orders API (1.5 ngày)**
- [ ] GET `/orders` (Client)
  - Test user xem danh sách orders của mình
- [ ] GET `/orders/:id` (Client)
  - Test user xem chi tiết 1 order
- [ ] GET `/admin/orders` (Admin)
  - Test admin xem tất cả orders
- [ ] POST `/admin/orders/:id/status` (Admin)
  - Test admin update order status

#### Deliverables
- ✅ 8-10 test cases (thay vì 30-35)
- ✅ Test coverage: Checkout + Orders view (60%+)
- ✅ BỎ QUA: Dashboard, statistics, export, roles, permissions

---

### **Tuần 5 (Sprint 5): Orders Management & E2E Setup**
**Release Version: v1.4.0-orders**

#### Mục tiêu
- Test order status update
- Setup E2E framework
- BỎ QUA blog, profile, account management

#### Công việc chi tiết

**1. Integration Tests - Order Status Flow (1 ngày)**
- [ ] Test update order status flow:
  - pending → confirmed → shipping → completed
  - Test mỗi transition 1 lần

**2. Setup E2E Framework (1 ngày)**
- [ ] Cài đặt Puppeteer (đơn giản hơn Playwright)
- [ ] Tạo helper: `loginE2E()`, `waitForElement()`
- [ ] Test chạy browser thành công

**3. E2E Test - Registration Flow (1 ngày)**
- [ ] Test full registration flow trên UI:
  - Fill form → Submit → Verify OTP (mock) → Success

#### Deliverables
- ✅ 6-8 test cases (thay vì 25-30)
- ✅ E2E framework ready
- ✅ BỎ QUA: Blog, Profile, Account management (không quan trọng)

---

### **Tuần 6 (Sprint 6): E2E Critical Flows**
**Release Version: v1.5.0-e2e (Production Ready)**

#### Mục tiêu
- Test 2-3 E2E flows quan trọng nhất
- Viết documentation
- BỎ QUA performance, security testing

#### Công việc chi tiết

**1. E2E Tests - Shopping Flow (2 ngày)**
- [ ] Test complete shopping flow:
  - Login → Browse products → Add to cart → Checkout → View order
  - Đây là flow QUAN TRỌNG NHẤT

**2. E2E Tests - Admin Product Management (1 ngày)**
- [ ] Test admin flow:
  - Login admin → Create product → View product list

**3. Documentation (1 ngày)**
- [ ] Viết README đơn giản:
  - How to run tests
  - Test structure
  - Test data setup
- [ ] Tạo test report đơn giản (Excel/Word)

#### Deliverables
- ✅ 3-4 E2E test cases (thay vì 20-25)
- ✅ Overall test coverage: 60%+ (thay vì 85%+)
- ✅ Simple documentation
- ✅ BỎ QUA: Performance, Security, Regression testing

---

## 📈 Tổng kết Test Coverage (SIMPLIFIED)

| Module | Target Coverage | Test Types |
|--------|----------------|------------|
| Authentication | 60%+ | Integration, E2E |
| Products | 60%+ | Integration |
| Cart | 60%+ | Integration, E2E |
| Checkout | 60%+ | Integration, E2E |
| Orders | 60%+ | Integration |
| ~~Categories~~ | ❌ Bỏ qua | - |
| ~~Blog~~ | ❌ Bỏ qua | - |
| ~~Profile~~ | ❌ Bỏ qua | - |
| ~~Dashboard~~ | ❌ Bỏ qua | - |
| ~~Roles~~ | ❌ Bỏ qua | - |

**Tổng số test cases dự kiến**: 80-100 test cases (giảm 50%)

---

## 🛠️ Setup Testing Environment (SIMPLIFIED)

### Cài đặt dependencies (CHỈ CẦN THIẾT)

```bash
npm install --save-dev jest supertest
npm install --save-dev puppeteer # Cho E2E (tuần 5-6)
```

**KHÔNG CẦN**: mongodb-memory-server (phức tạp) → Dùng MongoDB thật

### File `jest.config.js` (ĐƠN GIẢN)

```javascript
module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  testMatch: ['**/tests/**/*.test.js']
};
```

### File `tests/setup.js` (ĐƠN GIẢN)

```javascript
const mongoose = require('mongoose');

beforeAll(async () => {
  // Kết nối MongoDB thật (test database)
  await mongoose.connect(process.env.MONGO_URL_TEST);
});

afterAll(async () => {
  await mongoose.disconnect();
});

// Helper: Tạo user test
global.createTestUser = async () => {
  const User = require('../models/user-client');
  return await User.create({
    fullName: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'hashedpassword123',
    token: 'test-token-' + Date.now()
  });
};
```

---

## 📊 Metrics & KPIs (REALISTIC)

### Mỗi tuần cần đạt:
- ✅ Hoàn thành 80% test cases theo kế hoạch (không cần 100%)
- ✅ Test coverage tăng ~10% mỗi tuần
- ✅ Tests chạy được và pass

### Cuối 6 tuần:
- ✅ 80-100 test cases (đủ dùng)
- ✅ 60%+ overall test coverage (chấp nhận được)
- ✅ Core flows được test (Auth, Product, Cart, Checkout, Orders)
- ✅ 2-3 E2E tests cho main flows
- ✅ KHÔNG CẦN: Performance, Security testing (làm sau nếu cần)

---

## 🚀 CI/CD Integration (OPTIONAL - Làm sau nếu có thời gian)

**Hiện tại**: Chạy tests manual bằng `npm test`

**Sau này** (nếu muốn): Setup GitHub Actions

```yaml
# .github/workflows/test.yml (TẠO SAU)
name: Test Suite

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - run: npm install
    - run: npm test
```

**Ưu tiên**: Viết tests trước, CI/CD sau!

---

## 📝 Best Practices

1. **Test Naming Convention**
   - `describe('ServiceName.methodName', () => {})`
   - `it('should do something when condition', () => {})`

2. **Test Data**
   - Sử dụng factories để tạo test data
   - Không hardcode data trong tests
   - Clean up sau mỗi test

3. **Mocking**
   - Mock external services (Cloudinary, Email)
   - Mock database cho unit tests
   - Use real database cho integration tests

4. **Assertions**
   - Test cả happy path và error cases
   - Test edge cases (empty, null, invalid)
   - Test boundary conditions

5. **Performance**
   - Keep unit tests < 100ms
   - Keep integration tests < 1s
   - Run E2E tests separately

---

## 🎯 Success Criteria (REALISTIC)

Sau 6 tuần, project sẽ có:

✅ Test suite với 80-100 test cases (đủ dùng)  
✅ 60%+ code coverage (chấp nhận được)  
✅ E2E tests cho 2-3 critical flows  
✅ Documentation cơ bản  
✅ Team biết cách viết tests  

❌ KHÔNG CẦN:
- CI/CD pipeline (làm sau)
- Performance testing (làm sau)
- Security testing (làm sau)
- High coverage (60% là đủ)

---

**Lưu ý quan trọng**: 

⚠️ **Kế hoạch này ĐÃ RÚT GỌN 50%** so với bản đầy đủ:
- Chỉ test CORE features (Auth, Product, Cart, Checkout, Orders)
- Chỉ test HAPPY PATH + 1-2 error cases
- Bỏ qua: Blog, Profile, Category, Dashboard, Roles, Permissions
- Bỏ qua: Performance, Security, Advanced scenarios

**Nguyên tắc**: DONE IS BETTER THAN PERFECT. Làm được 80-100 test cases chạy được là thành công rồi!
