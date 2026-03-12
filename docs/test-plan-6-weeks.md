# 📋 Kế hoạch Test Case 6 Tuần - Verdish E-Commerce Platform

## 📊 Tổng quan

**Mục tiêu**: Xây dựng test suite đầy đủ cho toàn bộ project trong 6 tuần với 6 bản release version.

**Phương pháp**: Ưu tiên các tính năng quan trọng trước, sau đó mở rộng coverage dần.

**Framework đề xuất**: 
- **Jest** - Unit & Integration testing
- **Supertest** - API testing
- **Puppeteer/Playwright** - E2E testing (tuần 5-6)

---

## 🎯 Phân bổ công việc theo tuần

### **Tuần 1: Setup & Authentication Testing** 
**Release Version: v1.0.0-test**

#### Mục tiêu
- Setup môi trường testing
- Test các tính năng authentication cơ bản

#### Công việc chi tiết

**1. Setup Testing Environment (2 ngày)**
- [ ] Cài đặt Jest, Supertest
- [ ] Tạo file `jest.config.js`
- [ ] Setup test database (MongoDB Memory Server)
- [ ] Tạo folder structure: `tests/unit/`, `tests/integration/`, `tests/e2e/`
- [ ] Viết helper functions: `setupTestDB()`, `clearTestDB()`, `createTestUser()`

**2. Unit Tests - Helper Functions (1 ngày)**
- [ ] `helper/generateOtp.js` - Test OTP generation (6 digits)
- [ ] `helper/pagination.js` - Test pagination logic
- [ ] `helper/search.js` - Test search functionality
- [ ] `helper/filterStatus.js` - Test status filtering
- [ ] `helper/createTree.js` - Test nested category tree

**3. Unit Tests - Authentication Services (2 ngày)**
- [ ] `services/client/register.service.js`
  - Test tạo pending registration
  - Test OTP generation & hashing
  - Test email validation
  - Test duplicate email check
- [ ] `services/client/login.service.js`
  - Test login với email/password đúng
  - Test login với credentials sai
  - Test account bị khóa
- [ ] `services/client/password.service.js`
  - Test forgot password flow
  - Test OTP verification
  - Test password reset

**4. Integration Tests - Auth API (2 ngày)**
- [ ] POST `/register` - Đăng ký bước 1 (gửi OTP)
- [ ] POST `/register/verify-otp` - Xác thực OTP
- [ ] POST `/register/create-account` - Tạo tài khoản
- [ ] POST `/login` - Đăng nhập
- [ ] POST `/password/forgot` - Quên mật khẩu
- [ ] POST `/password/verify-otp` - Xác thực OTP reset
- [ ] POST `/password/reset-password` - Đặt lại mật khẩu

#### Deliverables
- ✅ 25-30 test cases
- ✅ Test coverage: Helper functions (100%), Auth services (80%+)
- ✅ CI/CD pipeline setup (GitHub Actions)

---

### **Tuần 2: Product & Category Testing**
**Release Version: v1.1.0-test**

#### Mục tiêu
- Test CRUD operations cho Products & Categories
- Test business logic quan trọng

#### Công việc chi tiết

**1. Unit Tests - Product Services (2 ngày)**
- [ ] `services/admin/product.service.js`
  - Test create product với đầy đủ fields
  - Test update product
  - Test delete product (soft delete)
  - Test change status
  - Test change position
  - Test stock validation
  - Test price calculation với discount
- [ ] `services/client/product.service.js`
  - Test get products với pagination
  - Test filter by category
  - Test search products
  - Test get product detail by slug

**2. Unit Tests - Category Services (1 ngày)**
- [ ] `services/admin/category.service.js`
  - Test create category
  - Test create nested category (parent_id)
  - Test update category
  - Test delete category (check products)
  - Test build category tree

**3. Integration Tests - Product API (2 ngày)**
- [ ] Admin Product Routes:
  - GET `/admin/products` - List với pagination
  - POST `/admin/products/create` - Tạo sản phẩm
  - PATCH `/admin/products/edit/:id` - Cập nhật
  - PATCH `/admin/products/change-status/:status/:id` - Đổi status
  - DELETE `/admin/products/delete-product/:id` - Xóa
  - GET `/admin/products/history/:id` - Lịch sử thay đổi
- [ ] Client Product Routes:
  - GET `/products` - Danh sách sản phẩm
  - GET `/product/:slug` - Chi tiết sản phẩm

**4. Integration Tests - Category API (1 ngày)**
- [ ] POST `/admin/categories/create`
- [ ] PATCH `/admin/categories/edit/:id`
- [ ] DELETE `/admin/categories/delete-category/:id`
- [ ] GET `/categories` - Client view

#### Deliverables
- ✅ 35-40 test cases
- ✅ Test coverage: Product services (85%+), Category services (80%+)
- ✅ Mock Cloudinary upload trong tests

---

### **Tuần 3: Cart & Checkout Testing**
**Release Version: v1.2.0-test**

#### Mục tiêu
- Test shopping cart functionality
- Test checkout process & order creation
- Test inventory management

#### Công việc chi tiết

**1. Unit Tests - Cart Services (2 ngày)**
- [ ] `services/client/cart.service.js`
  - Test add product to cart
  - Test update quantity (increase/decrease)
  - Test remove product from cart
  - Test calculate cart total
  - Test merge cart khi login
  - Test validate stock availability
  - Test cart với product đã xóa
  - Test cart với product hết hàng

**2. Unit Tests - Checkout Services (2 ngày)**
- [ ] `services/client/checkout.service.js`
  - Test validate shipping info
  - Test create order từ cart
  - Test calculate order total
  - Test reduce stock sau order
  - Test clear cart sau order
  - Test order với product không đủ stock
  - Test order với cart rỗng

**3. Integration Tests - Cart API (1 ngày)**
- [ ] POST `/cart/add` - Thêm vào giỏ
- [ ] POST `/cart/update` - Cập nhật số lượng
- [ ] POST `/cart/delete` - Xóa khỏi giỏ
- [ ] GET `/cart` - Xem giỏ hàng

**4. Integration Tests - Checkout API (2 ngày)**
- [ ] POST `/checkout` - Tạo đơn hàng
- [ ] Test full checkout flow:
  - User login → Add to cart → Update quantity → Checkout → Verify order created
  - Verify stock reduced
  - Verify cart cleared

#### Deliverables
- ✅ 30-35 test cases
- ✅ Test coverage: Cart services (85%+), Checkout services (90%+)
- ✅ Test concurrent checkout scenarios

---

### **Tuần 4: Order Management & Admin Features**
**Release Version: v1.3.0-test**

#### Mục tiêu
- Test order management
- Test admin dashboard
- Test role & permissions

#### Công việc chi tiết

**1. Unit Tests - Order Services (2 ngày)**
- [ ] `services/client/orders.service.js`
  - Test get user orders
  - Test get order detail
  - Test filter orders by status
- [ ] `services/admin/orders.service.js`
  - Test get all orders
  - Test update order status (pending → confirmed → shipping → completed)
  - Test cancel order
  - Test restore stock khi cancel
  - Test order statistics

**2. Unit Tests - Dashboard Services (1 ngày)**
- [ ] `services/admin/dashboard.service.js`
  - Test calculate revenue by day
  - Test calculate revenue by month
  - Test calculate revenue by quarter
  - Test calculate revenue by year
  - Test export to Excel
  - Test export to Word

**3. Unit Tests - Role & Permission (1 ngày)**
- [ ] `services/admin/role.service.js`
  - Test create role
  - Test assign permissions
  - Test check user permission
  - Test permission middleware

**4. Integration Tests - Order API (2 ngày)**
- [ ] Client:
  - GET `/orders` - Danh sách đơn hàng
  - GET `/orders/:id` - Chi tiết đơn hàng
- [ ] Admin:
  - GET `/admin/orders` - Tất cả đơn hàng
  - POST `/admin/orders/:id/status` - Cập nhật trạng thái
  - Test permission-based access

#### Deliverables
- ✅ 30-35 test cases
- ✅ Test coverage: Order services (85%+), Dashboard (75%+)
- ✅ Test role-based access control

---

### **Tuần 5: Blog, Profile & Advanced Features**
**Release Version: v1.4.0-test**

#### Mục tiêu
- Test blog functionality
- Test user profile management
- Test audit logging
- Bắt đầu E2E testing

#### Công việc chi tiết

**1. Unit Tests - Blog Services (1 ngày)**
- [ ] `services/admin/blog.service.js`
  - Test create blog post
  - Test update blog post
  - Test delete blog post
  - Test publish/unpublish
- [ ] `services/client/blog.service.js`
  - Test get published blogs
  - Test get blog by slug
  - Test search blogs

**2. Unit Tests - Profile Services (1 ngày)**
- [ ] `services/client/profile.service.js`
  - Test update profile info
  - Test change password
  - Test upload avatar
  - Test validate phone number

**3. Unit Tests - Account Management (1 ngày)**
- [ ] `services/admin/account.service.js`
  - Test create admin account
  - Test update account
  - Test lock/unlock account
  - Test delete account
  - Test assign role

**4. E2E Tests - Critical User Flows (2 ngày)**
- [ ] Setup Puppeteer/Playwright
- [ ] Test complete registration flow (UI)
- [ ] Test complete login flow (UI)
- [ ] Test complete shopping flow:
  - Browse products → Add to cart → Checkout → View order

#### Deliverables
- ✅ 25-30 test cases
- ✅ Test coverage: Blog (80%+), Profile (85%+)
- ✅ 3-4 E2E test scenarios

---

### **Tuần 6: E2E Testing & Final Integration**
**Release Version: v1.5.0-test (Production Ready)**

#### Mục tiêu
- Hoàn thiện E2E testing
- Test performance & security
- Final integration testing
- Documentation

#### Công việc chi tiết

**1. E2E Tests - Admin Panel (2 ngày)**
- [ ] Admin login flow
- [ ] Product management flow:
  - Create product → Upload image → Publish → Edit → Delete
- [ ] Order management flow:
  - View orders → Update status → Export report
- [ ] Category management flow
- [ ] User management flow

**2. E2E Tests - Client Flows (1 ngày)**
- [ ] Password reset flow (full)
- [ ] Profile update flow
- [ ] Blog reading flow
- [ ] Multiple products checkout

**3. Performance & Security Tests (1 ngày)**
- [ ] Load testing với Artillery/k6:
  - Test 100 concurrent users
  - Test API response time < 500ms
- [ ] Security tests:
  - Test SQL injection prevention
  - Test XSS prevention
  - Test CSRF protection
  - Test rate limiting
  - Test authentication bypass attempts

**4. Integration & Regression Testing (1 ngày)**
- [ ] Run toàn bộ test suite
- [ ] Fix failing tests
- [ ] Improve test coverage lên 85%+
- [ ] Test trên staging environment

**5. Documentation (1 ngày)**
- [ ] Viết README cho test suite
- [ ] Document test data setup
- [ ] Document CI/CD pipeline
- [ ] Tạo test report template

#### Deliverables
- ✅ 20-25 E2E test cases
- ✅ Performance test report
- ✅ Security test report
- ✅ Overall test coverage: 85%+
- ✅ Complete test documentation

---

## 📈 Tổng kết Test Coverage

| Module | Target Coverage | Test Types |
|--------|----------------|------------|
| Authentication | 90%+ | Unit, Integration, E2E |
| Products | 85%+ | Unit, Integration, E2E |
| Categories | 80%+ | Unit, Integration |
| Cart | 85%+ | Unit, Integration, E2E |
| Checkout | 90%+ | Unit, Integration, E2E |
| Orders | 85%+ | Unit, Integration, E2E |
| Blog | 80%+ | Unit, Integration |
| Profile | 85%+ | Unit, Integration |
| Admin Dashboard | 75%+ | Unit, Integration |
| Roles & Permissions | 80%+ | Unit, Integration |

**Tổng số test cases dự kiến**: 180-200 test cases

---

## 🛠️ Setup Testing Environment

### Cài đặt dependencies

```bash
npm install --save-dev jest supertest mongodb-memory-server
npm install --save-dev @types/jest @types/supertest
npm install --save-dev puppeteer # Cho E2E testing
```

### File `jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'services/**/*.js',
    'controllers/**/*.js',
    'helper/**/*.js',
    '!**/node_modules/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000
};
```

### File `tests/setup.js`

```javascript
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
```

---

## 📊 Metrics & KPIs

### Mỗi tuần cần đạt:
- ✅ Hoàn thành 100% test cases theo kế hoạch
- ✅ Test coverage tăng ít nhất 15% mỗi tuần
- ✅ Không có critical bugs trong test suite
- ✅ CI/CD pipeline chạy thành công

### Cuối 6 tuần:
- ✅ 180-200 test cases
- ✅ 85%+ overall test coverage
- ✅ Tất cả critical paths được test
- ✅ E2E tests cho main user flows
- ✅ Performance benchmarks established
- ✅ Security tests passed

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - run: npm install
    - run: npm test
    - run: npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v2
```

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

## 🎯 Success Criteria

Sau 6 tuần, project sẽ có:

✅ Test suite đầy đủ với 180-200 test cases  
✅ 85%+ code coverage  
✅ CI/CD pipeline tự động  
✅ E2E tests cho critical flows  
✅ Performance benchmarks  
✅ Security tests passed  
✅ Documentation đầy đủ  
✅ Team có kinh nghiệm viết tests  

---

**Lưu ý**: Kế hoạch này có thể điều chỉnh dựa trên:
- Độ phức tạp thực tế của code
- Bugs phát hiện trong quá trình test
- Thay đổi requirements
- Team capacity

**Nguyên tắc**: Ưu tiên quality over quantity. Tốt hơn có 150 test cases chất lượng cao hơn là 200 test cases kém.
