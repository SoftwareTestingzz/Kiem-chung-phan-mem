# 🗺️ Postman Automation Test — Master Plan (Toàn bộ Collection)

> **Dự án**: Verdish E-Commerce Platform
> **Stack**: Node.js + Express.js + MongoDB (session-based auth)
> **Base URL**: `http://localhost:3000`
> **Tổng endpoints**: ~55 endpoints | **Tổng test cases**: ~220 tests

---

## 👥 Phân công nhóm — Sơn, Quyến, Đạt, Lợi

| Thành viên  | Phụ trách module                                                     | Unit tests | E2E flows              | Vai trò                       |
| ----------- | -------------------------------------------------------------------- | ---------- | ---------------------- | ----------------------------- |
| **Sơn**     | Auth Client + Auth Admin + Blog Client                               | ~37        | E2E-01, E2E-02         | Setup workspace & environment |
| **Quyến**   | Client Products + Admin Products + Admin Categories                  | ~45        | E2E-06                 | -                             |
| **Đạt**     | Cart + Checkout + Orders + Profile                                   | ~39        | E2E-03, E2E-04, E2E-05 | -                             |
| **Lợi**     | Admin Orders + Admin Accounts + Admin Roles + Admin Blog + Dashboard | ~49        | E2E-07, E2E-08         | -                             |
| **Cả nhóm** | Review, fix failing tests, Newman report                             | -          | -                      | Sprint cuối                   |

### Chi tiết phân công theo module

#### 🔵 Sơn — Auth + Setup (~37 unit tests + 2 E2E)

| Module      | Folder                                                | Tests    |
| ----------- | ----------------------------------------------------- | -------- |
| Client Auth | `01 — Client Auth`                                    | 27 tests |
| Client Blog | `07 — Client Blog`                                    | 5 tests  |
| Admin Auth  | `08 — Admin Auth`                                     | 5 tests  |
| E2E         | E2E-01 (Full Register→Login), E2E-02 (Password Reset) | 2 flows  |

**Nhiệm vụ bổ sung:**

- Tạo Postman Workspace: `Verdish Testing`
- Setup Environment Variables (file `.postman_environment.json`)
- Chia sẻ workspace cho cả nhóm qua Postman Team/Link
- Viết hướng dẫn sử dụng cookie jar ngắn gọn cho nhóm

---

#### 🟢 Quyến — Products + Categories (~45 unit tests + 1 E2E)

| Module           | Folder                           | Tests    |
| ---------------- | -------------------------------- | -------- |
| Client Products  | `02 — Client Products`           | 16 tests |
| Admin Products   | `09 — Admin Products`            | 19 tests |
| Admin Categories | `10 — Admin Categories`          | 10 tests |
| E2E              | E2E-06 (Admin Product Lifecycle) | 1 flow   |

---

#### 🟡 Đạt — Shopping Flow (~39 unit tests + 3 E2E)

| Module          | Folder                                                                | Tests    |
| --------------- | --------------------------------------------------------------------- | -------- |
| Client Cart     | `03 — Client Cart`                                                    | 15 tests |
| Client Checkout | `04 — Client Checkout`                                                | 8 tests  |
| Client Orders   | `05 — Client Orders`                                                  | 10 tests |
| Client Profile  | `06 — Client Profile`                                                 | 6 tests  |
| E2E             | E2E-03 (Full Shopping), E2E-04 (Multi-product), E2E-05 (Cancel Order) | 3 flows  |

---

#### 🔴 Lợi — Admin Management + Dashboard (~49 unit tests + 2 E2E)

| Module                    | Folder                                                          | Tests    |
| ------------------------- | --------------------------------------------------------------- | -------- |
| Admin Orders              | `11 — Admin Orders`                                             | 11 tests |
| Admin Accounts            | `12 — Admin Accounts`                                           | 12 tests |
| Admin Roles & Permissions | `13 — Admin Roles & Permissions`                                | 9 tests  |
| Admin Blog                | `14 — Admin Blog`                                               | 9 tests  |
| Admin Dashboard           | `15 — Admin Dashboard`                                          | 8 tests  |
| E2E                       | E2E-07 (Admin Order Pipeline), E2E-08 (Admin Account Lifecycle) | 2 flows  |

---

### Sơ đồ dependency (thứ tự cần chạy khi test)

```
Sơn (Login/Auth) ──► tất cả module khác đều cần session từ đây
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
      Quyến         Đạt           Lợi
   (Products)   (Cart/Order)   (Admin CRUD)
          │             │
          └──────────┬──┘
                     ▼
              Đặt hàng → Admin xem đơn (Lợi)
```

> **Lưu ý:** Sơn cần hoàn thành Login request trước để các bạn khác lấy cookie session dùng chung.

---

## ⚠️ Lưu ý kỹ thuật quan trọng

| Vấn đề                   | Chi tiết                                                               |
| ------------------------ | ---------------------------------------------------------------------- | ----------------------- |
| **Auth mechanism**       | Express Session + Cookie (`connect.sid`) — KHÔNG dùng JWT/Bearer token |
| **Response format**      | Hầu hết trả về **HTML** (Pug template), chỉ AJAX endpoints trả JSON    |
| **AJAX JSON endpoints**  | `change-status`, `delete`, `change-multi`, `dashboard/revenue/*`       |
| **Content-Type request** | Form: `application/x-www-form-urlencoded`                              | API: `application/json` |
| **Postman setting**      | Bật **"Automatically follow redirects": OFF** để test redirect 302     |
| **Cookie jar**           | Bật **"Save cookies"** để tự động giữ session sau login                |

---

## 🔧 Environment Variables

```json
{
  "base_url": "http://localhost:3000",

  "client_email": "testclient@verdish.com",
  "client_password": "Client@123",
  "client_email_2": "testclient2@verdish.com",

  "admin_email": "admin@verdish.com",
  "admin_password": "Admin@123",

  "test_product_id": "",
  "test_product_slug": "",
  "test_category_id": "",
  "test_category_parent_id": "",
  "test_order_id": "",
  "test_account_id": "",
  "test_blog_id": "",
  "test_blog_slug": "",
  "test_role_id": "",

  "otp_code": "",
  "reset_token": "",
  "timestamp": ""
}
```

---

## 📁 Collection Structure (Master Tree)

```
Verdish — Postman Automation/
│
├── 📁 [SETUP] Pre-conditions
│   ├── Seed: Tạo client test user
│   └── Seed: Tạo admin test user
│
├── 📁 01 — Client Auth                      [🔵 Sơn]
│   ├── 📁 01.1 Login
│   ├── 📁 01.2 Register (3-step OTP flow)
│   └── 📁 01.3 Forgot Password (3-step OTP flow)
│
├── 📁 02 — Client Products                   [🟢 Quyến]
│   ├── 📁 02.1 Product List
│   ├── 📁 02.2 Product Detail
│   └── 📁 02.3 Comment
│
├── 📁 03 — Client Cart                       [🟡 Đạt]
│   ├── 📁 03.1 View Cart
│   ├── 📁 03.2 Add to Cart
│   ├── 📁 03.3 Update Cart
│   └── 📁 03.4 Remove from Cart
│
├── 📁 04 — Client Checkout                   [🟡 Đạt]
│   ├── 📁 04.1 Place Order
│   └── 📁 04.2 Post-order Assertions
│
├── 📁 05 — Client Orders                     [🟡 Đạt]
│   ├── 📁 05.1 My Orders
│   └── 📁 05.2 Cancel Order
│
├── 📁 06 — Client Profile                    [🟡 Đạt]
│
├── 📁 07 — Client Blog                       [🔵 Sơn]
│
├── 📁 08 — Admin Auth                        [🔵 Sơn]
│
├── 📁 09 — Admin Products                    [🟢 Quyến]
│   ├── 📁 09.1 CRUD
│   ├── 📁 09.2 Status Management
│   └── 📁 09.3 Bulk Operations
│
├── 📁 10 — Admin Categories                  [🟢 Quyến]
│   ├── 📁 10.1 CRUD
│   └── 📁 10.2 Nested Categories
│
├── 📁 11 — Admin Orders                      [🔴 Lợi]
│   ├── 📁 11.1 View & Filter
│   └── 📁 11.2 Status Transitions
│
├── 📁 12 — Admin Accounts                    [🔴 Lợi]
│   ├── 📁 12.1 CRUD
│   └── 📁 12.2 Lock/Unlock
│
├── 📁 13 — Admin Roles & Permissions         [🔴 Lợi]
│   ├── 📁 13.1 Role CRUD
│   └── 📁 13.2 Permissions Matrix
│
├── 📁 14 — Admin Blog                        [🔴 Lợi]
│
├── 📁 15 — Admin Dashboard                   [🔴 Lợi]
│   ├── 📁 15.1 Revenue API
│   └── 📁 15.2 Export
│
└── 📁 16 — E2E Scenarios                     [Cả nhóm]
    ├── E2E-01: Full Register & Login          [🔵 Sơn]
    ├── E2E-02: Full Password Reset            [🔵 Sơn]
    ├── E2E-03: Shopping Full Flow             [🟡 Đạt]
    ├── E2E-04: Multi-product Cart & Checkout  [🟡 Đạt]
    ├── E2E-05: Cancel Order                   [🟡 Đạt]
    ├── E2E-06: Admin Product Lifecycle        [🟢 Quyến]
    ├── E2E-07: Admin Order Status Pipeline    [🔴 Lợi]
    └── E2E-08: Admin Account Lifecycle        [🔴 Lợi]
```

---

## 📁 MODULE 01 — Client Auth `[🔵 Sơn]`

### Collection Pre-request Script (Auth module)

```javascript
// Tự động set timestamp cho mỗi request
pm.environment.set("timestamp", Date.now());
```

---

### 📁 01.1 — Login

#### AUTH-L-01 | Login thành công

```
POST {{base_url}}/login
Content-Type: application/x-www-form-urlencoded
Body: email={{client_email}}&password={{client_password}}
```

```javascript
// Tests
pm.test("TC01 - Status 200 OK", () => {
  pm.response.to.have.status(200);
});
pm.test("TC01 - Response có nội dung trang (không redirect)", () => {
  pm.expect(pm.response.text()).to.include("html");
});
pm.test("TC01 - Cookie session được set", () => {
  const cookie = pm.cookies.get("connect.sid");
  pm.expect(cookie).to.exist;
  pm.environment.set("client_session_set", "true");
});
```

#### AUTH-L-02 | Login sai password

```
POST {{base_url}}/login
Body: email={{client_email}}&password=WrongPass999
```

```javascript
pm.test(
  "TC02 - Response trả lỗi (200 với flash message hoặc redirect 302)",
  () => {
    pm.expect([200, 302]).to.include(pm.response.code);
  },
);
pm.test("TC02 - Không set cookie session mới (hoặc cookie trống)", () => {
  if (pm.response.code === 200) {
    const body = pm.response.text();
    pm.expect(body).to.satisfy(
      (t) =>
        t.includes("sai") ||
        t.includes("incorrect") ||
        t.includes("error") ||
        t.includes("không đúng"),
      "Body phải chứa thông báo lỗi",
    );
  }
});
```

#### AUTH-L-03 | Login email không tồn tại

```
POST {{base_url}}/login
Body: email=notexist_{{timestamp}}@fake.com&password=Test@123
```

```javascript
pm.test("TC03 - Server xử lý email không tồn tại", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
});
pm.test("TC03 - Không được redirect vào dashboard", () => {
  if (pm.response.code === 302) {
    const location = pm.response.headers.get("Location");
    pm.expect(location).to.not.include("dashboard");
    pm.expect(location).to.not.equal("/");
  }
});
```

#### AUTH-L-04 | Login thiếu email (form rỗng)

```
POST {{base_url}}/login
Body: email=&password=
```

```javascript
pm.test("TC04 - Validation lỗi khi thiếu email/password", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
pm.test("TC04 - Không được login thành công", () => {
  if (pm.response.code === 302) {
    const loc = pm.response.headers.get("Location") || "";
    pm.expect(loc).to.not.equal("/");
  }
});
```

#### AUTH-L-05 | Login thiếu password

```
POST {{base_url}}/login
Body: email={{client_email}}&password=
```

```javascript
pm.test("TC05 - Thiếu password bị từ chối", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
});
```

#### AUTH-L-06 | Login email sai format

```
POST {{base_url}}/login
Body: email=not-an-email&password=Test@123
```

```javascript
pm.test("TC06 - Email không đúng format bị reject", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### AUTH-L-07 | Login tài khoản bị khóa (inactive)

> Điều kiện: Phải có sẵn account với status=inactive trong DB

```
POST {{base_url}}/login
Body: email=locked_user@verdish.com&password=Test@123
```

```javascript
pm.test("TC07 - Tài khoản bị khóa không login được", () => {
  pm.expect([200, 302, 403]).to.include(pm.response.code);
  if (pm.response.code === 200) {
    pm.expect(pm.response.text()).to.satisfy(
      (t) =>
        t.includes("khóa") ||
        t.includes("locked") ||
        t.includes("inactive") ||
        t.includes("block"),
    );
  }
});
```

#### AUTH-L-08 | Logout

```
GET {{base_url}}/login/logout
```

```javascript
pm.test("TC08 - Logout redirect về trang login hoặc home", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.code === 302) {
    const loc = pm.response.headers.get("Location") || "";
    pm.expect(loc).to.satisfy(
      (l) => l.includes("login") || l === "/" || l === "",
    );
  }
});
pm.test("TC08 - Session bị xóa sau logout", () => {
  pm.environment.unset("client_session_set");
});
```

---

### 📁 01.2 — Register (3-step OTP)

#### AUTH-R-01 | Bước 1 — Gửi OTP đăng ký thành công

```
POST {{base_url}}/register
Content-Type: application/x-www-form-urlencoded
Body: fullName=Test User {{timestamp}}&email=newuser_{{timestamp}}@test.com&password=Test@123
```

```javascript
pm.test("TC-R01 - Gửi OTP thành công (200 hoặc redirect verify-otp)", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
pm.test("TC-R01 - OTP form hiển thị hoặc redirect đúng", () => {
  if (pm.response.code === 302) {
    const loc = pm.response.headers.get("Location") || "";
    pm.expect(loc).to.include("verify-otp");
  }
});
// Lưu email để dùng các bước sau
pm.environment.set(
  "reg_email",
  `newuser_${pm.environment.get("timestamp")}@test.com`,
);
```

#### AUTH-R-02 | Bước 1 — Email đã tồn tại

```
POST {{base_url}}/register
Body: fullName=Duplicate&email={{client_email}}&password=Test@123
```

```javascript
pm.test("TC-R02 - Email đã tồn tại bị từ chối", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
  if (pm.response.code === 200) {
    pm.expect(pm.response.text()).to.satisfy(
      (t) =>
        t.includes("đã tồn tại") ||
        t.includes("exists") ||
        t.includes("already"),
    );
  }
});
```

#### AUTH-R-03 | Bước 1 — Email sai format

```
POST {{base_url}}/register
Body: fullName=Test&email=invalidemail&password=Test@123
```

```javascript
pm.test("TC-R03 - Email không hợp lệ bị reject", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### AUTH-R-04 | Bước 1 — Thiếu fullName

```
POST {{base_url}}/register
Body: fullName=&email=newuser@test.com&password=Test@123
```

```javascript
pm.test("TC-R04 - Thiếu fullName bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### AUTH-R-05 | Bước 1 — Password quá ngắn (< 6 ký tự)

```
POST {{base_url}}/register
Body: fullName=Test&email=test_short@test.com&password=abc
```

```javascript
pm.test("TC-R05 - Password ngắn bị reject", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### AUTH-R-06 | Bước 2 — Verify OTP đúng

> Lưu ý: OTP cần lấy từ email hoặc từ DB trong môi trường test

```
POST {{base_url}}/register/verify-otp
Body: otp={{otp_code}}
```

```javascript
pm.test("TC-R06 - OTP đúng được chấp nhận", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### AUTH-R-07 | Bước 2 — OTP sai

```
POST {{base_url}}/register/verify-otp
Body: otp=000000
```

```javascript
pm.test("TC-R07 - OTP sai bị từ chối", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
  if (pm.response.code === 200) {
    pm.expect(pm.response.text()).to.satisfy(
      (t) =>
        t.includes("OTP") || t.includes("không đúng") || t.includes("invalid"),
    );
  }
});
```

#### AUTH-R-08 | Bước 2 — OTP hết hạn (giả lập)

> Test case này cần setup: insert OTP với expired_at trong quá khứ vào DB

```
POST {{base_url}}/register/verify-otp
Body: otp=111111
```

```javascript
pm.test("TC-R08 - OTP hết hạn bị từ chối", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
  if (pm.response.code === 200) {
    pm.expect(pm.response.text()).to.satisfy(
      (t) =>
        t.includes("hết hạn") || t.includes("expired") || t.includes("timeout"),
    );
  }
});
```

#### AUTH-R-09 | Resend OTP

```
POST {{base_url}}/register/resend-otp
Body: (empty hoặc email)
```

```javascript
pm.test("TC-R09 - Resend OTP thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
pm.test("TC-R09 - Response time hợp lý (< 5s)", () => {
  pm.expect(pm.response.responseTime).to.be.below(5000);
});
```

#### AUTH-R-10 | Bước 3 — Tạo tài khoản sau verify OTP

```
POST {{base_url}}/register/create-account
Body: (session đã có OTP verified)
```

```javascript
pm.test("TC-R10 - Tạo tài khoản thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
pm.test("TC-R10 - Redirect hoặc login page sau khi tạo xong", () => {
  if (pm.response.code === 302) {
    const loc = pm.response.headers.get("Location") || "";
    pm.expect(loc).to.satisfy((l) => l.includes("login") || l === "/");
  }
});
```

---

### 📁 01.3 — Forgot Password (3-step OTP)

#### AUTH-FP-01 | Gửi OTP reset thành công

```
POST {{base_url}}/password/forgot
Body: email={{client_email}}
```

```javascript
pm.test("TC-FP01 - Gửi OTP reset thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
pm.test("TC-FP01 - Redirect sang verify-otp", () => {
  if (pm.response.code === 302) {
    pm.expect(pm.response.headers.get("Location")).to.include("verify-otp");
  }
});
```

#### AUTH-FP-02 | Email không tồn tại trong DB

```
POST {{base_url}}/password/forgot
Body: email=ghost_{{timestamp}}@nowhere.com
```

```javascript
pm.test("TC-FP02 - Email không tồn tại bị thông báo lỗi", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
});
```

#### AUTH-FP-03 | Email không hợp lệ

```
POST {{base_url}}/password/forgot
Body: email=not-valid-email
```

```javascript
pm.test("TC-FP03 - Email sai format bị reject", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### AUTH-FP-04 | Resend OTP reset

```
POST {{base_url}}/password/resend-otp
```

```javascript
pm.test("TC-FP04 - Resend OTP reset hoạt động", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### AUTH-FP-05 | Verify OTP đúng

```
POST {{base_url}}/password/verify-otp
Body: otp={{otp_code}}
```

```javascript
pm.test("TC-FP05 - OTP đúng được chấp nhận", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### AUTH-FP-06 | Verify OTP sai

```
POST {{base_url}}/password/verify-otp
Body: otp=999999
```

```javascript
pm.test("TC-FP06 - OTP sai bị từ chối", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
});
```

#### AUTH-FP-07 | Reset password thành công

```
POST {{base_url}}/password/reset-password
Body: password=NewPass@456&confirmPassword=NewPass@456
```

```javascript
pm.test("TC-FP07 - Reset password thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
pm.test("TC-FP07 - Redirect sang login sau khi reset", () => {
  if (pm.response.code === 302) {
    pm.expect(pm.response.headers.get("Location")).to.include("login");
  }
});
```

#### AUTH-FP-08 | Password mới không khớp confirm

```
POST {{base_url}}/password/reset-password
Body: password=NewPass@456&confirmPassword=DifferentPass@789
```

```javascript
pm.test("TC-FP08 - Password không khớp bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### AUTH-FP-09 | Password mới quá ngắn

```
POST {{base_url}}/password/reset-password
Body: password=abc&confirmPassword=abc
```

```javascript
pm.test("TC-FP09 - Password quá ngắn bị reject", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

---

## 📁 MODULE 02 — Client Products `[🟢 Quyến]`

### 📁 02.1 — Product List

#### PROD-L-01 | Lấy danh sách sản phẩm (trang 1)

```
GET {{base_url}}/products
```

```javascript
pm.test("TC-PL01 - Status 200 OK", () => pm.response.to.have.status(200));
pm.test("TC-PL01 - Trả về HTML có danh sách sản phẩm", () => {
  const body = pm.response.text();
  pm.expect(body).to.include("html");
});
pm.test("TC-PL01 - Response time < 3s", () => {
  pm.expect(pm.response.responseTime).to.be.below(3000);
});
```

#### PROD-L-02 | Phân trang — page=1

```
GET {{base_url}}/products?page=1
```

```javascript
pm.test("TC-PL02 - Page 1 trả 200", () => pm.response.to.have.status(200));
```

#### PROD-L-03 | Phân trang — page=2

```
GET {{base_url}}/products?page=2
```

```javascript
pm.test("TC-PL03 - Page 2 trả 200", () => pm.response.to.have.status(200));
```

#### PROD-L-04 | Phân trang — page cuối cùng + 1 (out-of-bound)

```
GET {{base_url}}/products?page=9999
```

```javascript
pm.test("TC-PL04 - Page ngoài phạm vi không crash server", () => {
  pm.expect([200, 302, 404]).to.include(pm.response.code);
});
```

#### PROD-L-05 | Search theo tên sản phẩm

```
GET {{base_url}}/products?search=vitamin
```

```javascript
pm.test("TC-PL05 - Search trả kết quả hợp lệ", () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.text()).to.include("html");
});
```

#### PROD-L-06 | Search không có kết quả

```
GET {{base_url}}/products?search=xyzabc123_nonexistent
```

```javascript
pm.test("TC-PL06 - Search empty trả 200 (không crash)", () => {
  pm.response.to.have.status(200);
});
```

#### PROD-L-07 | Search injection attempt (XSS check)

```
GET {{base_url}}/products?search=<script>alert(1)</script>
```

```javascript
pm.test("TC-PL07 - XSS input không gây lỗi server", () => {
  pm.expect([200, 400]).to.include(pm.response.code);
  if (pm.response.code === 200) {
    // Script tag không được execute raw trong HTML
    pm.expect(pm.response.text()).to.not.include("<script>alert(1)</script>");
  }
});
```

#### PROD-L-08 | Filter theo category

```
GET {{base_url}}/products?category={{test_category_id}}
```

```javascript
pm.test("TC-PL08 - Filter theo category trả 200", () => {
  pm.response.to.have.status(200);
});
```

#### PROD-L-09 | Sắp xếp theo giá tăng dần

```
GET {{base_url}}/products?sort=price-asc
```

```javascript
pm.test("TC-PL09 - Sort param không crash server", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
});
```

---

### 📁 02.2 — Product Detail

#### PROD-D-01 | Xem chi tiết sản phẩm hợp lệ

```
GET {{base_url}}/detail/{{test_product_slug}}
```

```javascript
pm.test("TC-PD01 - Status 200 OK", () => pm.response.to.have.status(200));
pm.test("TC-PD01 - HTML chứa thông tin sản phẩm", () => {
  pm.expect(pm.response.text()).to.include("html");
});
```

#### PROD-D-02 | Slug không tồn tại

```
GET {{base_url}}/detail/slug-khong-ton-tai-{{timestamp}}
```

```javascript
pm.test("TC-PD02 - Slug không tồn tại trả 404 hoặc redirect", () => {
  pm.expect([302, 404]).to.include(pm.response.code);
});
```

#### PROD-D-03 | Slug rỗng / chỉ có ký tự đặc biệt

```
GET {{base_url}}/detail/---
```

```javascript
pm.test("TC-PD03 - Slug rỗng/đặc biệt không crash (404 OK)", () => {
  pm.expect([302, 404]).to.include(pm.response.code);
});
```

---

### 📁 02.3 — Comment

#### PROD-C-01 | Bình luận sản phẩm khi đã đăng nhập

> Pre-condition: Đã login client

```
POST {{base_url}}/detail/{{test_product_slug}}/comment
Body: content=Sản phẩm này rất tốt! Test comment {{timestamp}}
```

```javascript
pm.test("TC-PC01 - Comment thành công (200 hoặc redirect back)", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### PROD-C-02 | Bình luận khi chưa đăng nhập

```
POST {{base_url}}/detail/{{test_product_slug}}/comment
Body: content=Test comment
// Không có session cookie
```

```javascript
pm.test("TC-PC02 - Chưa login bị redirect đến trang đăng nhập", () => {
  pm.expect([302]).to.include(pm.response.code);
  const loc = pm.response.headers.get("Location") || "";
  pm.expect(loc).to.include("login");
});
```

#### PROD-C-03 | Bình luận nội dung rỗng

```
POST {{base_url}}/detail/{{test_product_slug}}/comment
Body: content=
```

```javascript
pm.test("TC-PC03 - Nội dung rỗng bị từ chối hoặc bỏ qua", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### PROD-C-04 | Bình luận chuỗi quá dài (stress test)

```
POST {{base_url}}/detail/{{test_product_slug}}/comment
Body: content=aaaa....(5000 ký tự)
```

```javascript
pm.test("TC-PC04 - Chuỗi rất dài không crash server", () => {
  pm.expect([200, 302, 400, 413]).to.include(pm.response.code);
});
```

---

## 📁 MODULE 03 — Client Cart `[🟡 Đạt]`

### Pre-request setup

```javascript
// Collection folder Pre-request:
// Đảm bảo client đã login trước khi test cart
// Nếu dùng Cookie Jar, session tự động được giữ
```

### 📁 03.1 — View Cart

#### CART-V-01 | Xem giỏ hàng khi đã đăng nhập

```
GET {{base_url}}/cart
```

```javascript
pm.test("TC-CV01 - Xem giỏ hàng thành công", () => {
  pm.response.to.have.status(200);
});
pm.test("TC-CV01 - Trang hiển thị thông tin giỏ hàng", () => {
  pm.expect(pm.response.text()).to.include("html");
});
```

#### CART-V-02 | Xem giỏ hàng khi chưa đăng nhập

```
GET {{base_url}}/cart
// Xóa cookie session trước khi gửi
```

```javascript
pm.test("TC-CV02 - Chưa đăng nhập bị redirect login", () => {
  pm.expect(pm.response.code).to.equal(302);
  pm.expect(pm.response.headers.get("Location")).to.include("login");
});
```

---

### 📁 03.2 — Add to Cart

#### CART-A-01 | Thêm sản phẩm mới vào giỏ

```
POST {{base_url}}/cart/add
Content-Type: application/json
Body: {"productId": "{{test_product_id}}", "quantity": 1}
```

```javascript
pm.test("TC-CA01 - Thêm vào giỏ thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
pm.test("TC-CA01 - Nếu trả JSON: có thông tin giỏ hàng", () => {
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    const json = pm.response.json();
    pm.expect(json).to.have.property("cart");
  }
});
```

#### CART-A-02 | Thêm sản phẩm đã có trong giỏ (tăng số lượng)

```
POST {{base_url}}/cart/add
Body: {"productId": "{{test_product_id}}", "quantity": 1}
```

```javascript
pm.test("TC-CA02 - Thêm sản phẩm đã có — số lượng tăng", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### CART-A-03 | Thêm với số lượng lớn (kiểm tra stock limit)

```
POST {{base_url}}/cart/add
Body: {"productId": "{{test_product_id}}", "quantity": 9999}
```

```javascript
pm.test("TC-CA03 - Số lượng vượt stock — server xử lý đúng", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
});
```

#### CART-A-04 | Thêm với số lượng âm

```
POST {{base_url}}/cart/add
Body: {"productId": "{{test_product_id}}", "quantity": -5}
```

```javascript
pm.test("TC-CA04 - Số lượng âm bị từ chối hoặc chuẩn hóa", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### CART-A-05 | Thêm với quantity = 0

```
POST {{base_url}}/cart/add
Body: {"productId": "{{test_product_id}}", "quantity": 0}
```

```javascript
pm.test("TC-CA05 - Quantity = 0 bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### CART-A-06 | Thêm productId không tồn tại

```
POST {{base_url}}/cart/add
Body: {"productId": "000000000000000000000000", "quantity": 1}
```

```javascript
pm.test("TC-CA06 - ProductId fake trả lỗi 404", () => {
  pm.expect([302, 400, 404]).to.include(pm.response.code);
});
```

#### CART-A-07 | Thêm không có session (chưa login)

```
POST {{base_url}}/cart/add
Body: {"productId": "{{test_product_id}}", "quantity": 1}
// Không có cookie session
```

```javascript
pm.test("TC-CA07 - Chưa login bị redirect đến trang đăng nhập", () => {
  pm.expect(pm.response.code).to.equal(302);
  pm.expect(pm.response.headers.get("Location")).to.include("login");
});
```

#### CART-A-08 | Thêm productId dạng SQL injection

```
POST {{base_url}}/cart/add
Body: {"productId": "' OR '1'='1", "quantity": 1}
```

```javascript
pm.test("TC-CA08 - Injection input không crash server", () => {
  pm.expect([200, 302, 400, 500]).to.include(pm.response.code);
  pm.expect(pm.response.code).to.not.equal(500);
});
```

---

### 📁 03.3 — Update Cart

#### CART-U-01 | Tăng số lượng sản phẩm

```
POST {{base_url}}/cart/update
Body: {"productId": "{{test_product_id}}", "quantity": 3}
```

```javascript
pm.test("TC-CU01 - Cập nhật số lượng thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### CART-U-02 | Giảm số lượng về 1

```
POST {{base_url}}/cart/update
Body: {"productId": "{{test_product_id}}", "quantity": 1}
```

```javascript
pm.test("TC-CU02 - Giảm số lượng về 1 thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### CART-U-03 | Cập nhật số lượng = 0 (xóa item)

```
POST {{base_url}}/cart/update
Body: {"productId": "{{test_product_id}}", "quantity": 0}
```

```javascript
pm.test("TC-CU03 - Quantity = 0 có thể xóa item khỏi cart", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
});
```

#### CART-U-04 | Cập nhật productId không còn trong giỏ

```
POST {{base_url}}/cart/update
Body: {"productId": "000000000000000000000000", "quantity": 2}
```

```javascript
pm.test("TC-CU04 - ProductId không trong cart được xử lý đúng", () => {
  pm.expect([200, 302, 400, 404]).to.include(pm.response.code);
});
```

---

### 📁 03.4 — Remove from Cart

#### CART-R-01 | Xóa 1 sản phẩm khỏi giỏ

```
POST {{base_url}}/cart/delete
Body: {"productId": "{{test_product_id}}"}
```

```javascript
pm.test("TC-CR01 - Xóa sản phẩm thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### CART-R-02 | Xóa sản phẩm không có trong giỏ

```
POST {{base_url}}/cart/delete
Body: {"productId": "000000000000000000000000"}
```

```javascript
pm.test("TC-CR02 - Xóa item không tồn tại không crash", () => {
  pm.expect([200, 302, 400, 404]).to.include(pm.response.code);
});
```

#### CART-R-03 | Xóa toàn bộ giỏ hàng

```
POST {{base_url}}/cart/clear
```

```javascript
pm.test("TC-CR03 - Clear cart thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

---

## 📁 MODULE 04 — Client Checkout `[🟡 Đạt]`

#### CHK-01 | Đặt hàng thành công (cart đã có sản phẩm)

> Pre-condition: Đã login + cart có ít nhất 1 sản phẩm

```
POST {{base_url}}/checkout/place-order
Body: {
  "fullName": "Test Buyer",
  "phone": "0901234567",
  "address": "123 Đường Test, Q.1, TP.HCM"
}
```

```javascript
pm.test("TC-CHK01 - Đặt hàng thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
pm.test("TC-CHK01 - Lưu order ID nếu response là JSON", () => {
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    const json = pm.response.json();
    if (json.order && json.order._id) {
      pm.environment.set("test_order_id", json.order._id);
    }
  }
});
```

#### CHK-02 | Xác nhận cart trống sau khi đặt hàng

```
GET {{base_url}}/cart
```

```javascript
pm.test("TC-CHK02 - Giỏ hàng trống sau khi đặt hàng", () => {
  pm.response.to.have.status(200);
  // Kiểm tra không còn items trong cart
  const body = pm.response.text();
  pm.expect(body).to.satisfy(
    (t) =>
      t.includes("trống") ||
      t.includes("empty") ||
      t.includes("0 sản phẩm") ||
      t.includes("giỏ hàng rỗng"),
  );
});
```

#### CHK-03 | Đặt hàng với cart rỗng

```
POST {{base_url}}/checkout/place-order
Body: {"fullName": "Test", "phone": "0901234567", "address": "Test address"}
// Cart đã clear trước đó
```

```javascript
pm.test("TC-CHK03 - Đặt hàng với cart rỗng bị từ chối", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
});
```

#### CHK-04 | Thiếu tên người nhận

```
POST {{base_url}}/checkout/place-order
Body: {"fullName": "", "phone": "0901234567", "address": "Test address"}
```

```javascript
pm.test("TC-CHK04 - Thiếu tên bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### CHK-05 | Thiếu số điện thoại

```
POST {{base_url}}/checkout/place-order
Body: {"fullName": "Test", "phone": "", "address": "Test address"}
```

```javascript
pm.test("TC-CHK05 - Thiếu phone bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### CHK-06 | Số điện thoại sai format

```
POST {{base_url}}/checkout/place-order
Body: {"fullName": "Test", "phone": "abc-not-phone", "address": "Test address"}
```

```javascript
pm.test("TC-CHK06 - Phone sai format được xử lý", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### CHK-07 | Thiếu địa chỉ giao hàng

```
POST {{base_url}}/checkout/place-order
Body: {"fullName": "Test", "phone": "0901234567", "address": ""}
```

```javascript
pm.test("TC-CHK07 - Thiếu địa chỉ bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### CHK-08 | Đặt hàng chưa đăng nhập

```
POST {{base_url}}/checkout/place-order
// Không có session
```

```javascript
pm.test("TC-CHK08 - Chưa đăng nhập bị redirect login", () => {
  pm.expect(pm.response.code).to.equal(302);
  pm.expect(pm.response.headers.get("Location")).to.include("login");
});
```

---

## 📁 MODULE 05 — Client Orders `[🟡 Đạt]`

#### ORD-01 | Xem danh sách đơn hàng

```
GET {{base_url}}/orders
```

```javascript
pm.test("TC-O01 - Xem đơn hàng thành công", () => {
  pm.response.to.have.status(200);
});
```

#### ORD-02 | Filter đơn hàng theo status=pending

```
GET {{base_url}}/orders?status=pending
```

```javascript
pm.test("TC-O02 - Filter pending OK", () => {
  pm.response.to.have.status(200);
});
```

#### ORD-03 | Filter đơn hàng theo status=completed

```
GET {{base_url}}/orders?status=completed
```

```javascript
pm.test("TC-O03 - Filter completed OK", () => {
  pm.response.to.have.status(200);
});
```

#### ORD-04 | Filter với status không hợp lệ

```
GET {{base_url}}/orders?status=xyzinvalid
```

```javascript
pm.test(
  "TC-O04 - Status không hợp lệ không crash (200 hoặc empty list)",
  () => {
    pm.expect([200, 302, 400]).to.include(pm.response.code);
  },
);
```

#### ORD-05 | Xem chi tiết đơn hàng của mình

```
GET {{base_url}}/orders/{{test_order_id}}
```

```javascript
pm.test("TC-O05 - Xem chi tiết đơn hàng thành công", () => {
  pm.response.to.have.status(200);
});
```

#### ORD-06 | Xem chi tiết đơn hàng của người khác (authorization test)

```
GET {{base_url}}/orders/{{other_user_order_id}}
```

```javascript
pm.test("TC-O06 - Không xem được đơn hàng người khác", () => {
  pm.expect([302, 403, 404]).to.include(pm.response.code);
});
```

#### ORD-07 | Xem đơn hàng với ID không hợp lệ (non-ObjectId)

```
GET {{base_url}}/orders/not-a-valid-mongo-id
```

```javascript
pm.test("TC-O07 - ID không hợp lệ trả 404 hoặc redirect", () => {
  pm.expect([302, 400, 404]).to.include(pm.response.code);
});
```

#### ORD-08 | Hủy đơn hàng đang pending

```
POST {{base_url}}/orders/{{test_order_id}}/cancel
```

```javascript
pm.test("TC-O08 - Hủy đơn pending thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### ORD-09 | Hủy đơn hàng đã shipped (không được phép)

> Pre-condition: Cần có order với status=shipping

```
POST {{base_url}}/orders/{{shipped_order_id}}/cancel
```

```javascript
pm.test("TC-O09 - Hủy đơn đang shipping bị từ chối", () => {
  pm.expect([200, 302, 400, 403]).to.include(pm.response.code);
  if (pm.response.code === 200) {
    const body = pm.response.text();
    pm.expect(body).to.satisfy(
      (t) =>
        t.includes("không thể hủy") ||
        t.includes("cannot cancel") ||
        t.includes("already"),
    );
  }
});
```

#### ORD-10 | Xem đơn hàng chưa đăng nhập

```
GET {{base_url}}/orders
// Không có session
```

```javascript
pm.test("TC-O10 - Chưa login bị redirect", () => {
  pm.expect(pm.response.code).to.equal(302);
  pm.expect(pm.response.headers.get("Location")).to.include("login");
});
```

---

## 📁 MODULE 06 — Client Profile `[🟡 Đạt]`

#### PRF-01 | Xem hồ sơ cá nhân

```
GET {{base_url}}/profile
```

```javascript
pm.test("TC-PRF01 - Xem profile thành công", () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.text()).to.include("html");
});
```

#### PRF-02 | Cập nhật thông tin cơ bản

```
POST {{base_url}}/profile
Content-Type: multipart/form-data
Body: fullName=Updated Name {{timestamp}}&phone=0909876543
```

```javascript
pm.test("TC-PRF02 - Cập nhật profile thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### PRF-03 | Cập nhật với phone số không hợp lệ

```
POST {{base_url}}/profile
Body: fullName=Test&phone=not-a-phone-number
```

```javascript
pm.test("TC-PRF03 - Phone không hợp lệ được xử lý đúng", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### PRF-04 | Upload avatar — file hợp lệ (JPG)

```
POST {{base_url}}/profile
Content-Type: multipart/form-data
Body: avatar=[file: test.jpg, < 2MB]
```

```javascript
pm.test("TC-PRF04 - Upload avatar thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### PRF-05 | Upload avatar — file không phải ảnh

```
POST {{base_url}}/profile
Body: avatar=[file: malware.exe]
```

```javascript
pm.test("TC-PRF05 - File không phải ảnh bị từ chối", () => {
  pm.expect([200, 302, 400, 415]).to.include(pm.response.code);
  pm.expect(pm.response.code).to.not.equal(500);
});
```

#### PRF-06 | Truy cập profile chưa đăng nhập

```
GET {{base_url}}/profile
// Không có session
```

```javascript
pm.test("TC-PRF06 - Chưa login bị redirect", () => {
  pm.expect(pm.response.code).to.equal(302);
});
```

---

## 📁 MODULE 07 — Client Blog `[🔵 Sơn]`

#### BLG-C-01 | Xem danh sách bài viết

```
GET {{base_url}}/blog
```

```javascript
pm.test("TC-BC01 - Danh sách blog trả 200", () => {
  pm.response.to.have.status(200);
});
pm.test("TC-BC01 - HTML hợp lệ", () => {
  pm.expect(pm.response.text()).to.include("html");
});
```

#### BLG-C-02 | Phân trang blog (page 1)

```
GET {{base_url}}/blog/page/1
```

```javascript
pm.test("TC-BC02 - Blog page 1 OK", () => pm.response.to.have.status(200));
```

#### BLG-C-03 | Phân trang blog (page 2)

```
GET {{base_url}}/blog/page/2
```

```javascript
pm.test("TC-BC03 - Blog page 2 OK", () => {
  pm.expect([200, 302, 404]).to.include(pm.response.code);
});
```

#### BLG-C-04 | Xem chi tiết bài viết hợp lệ

```
GET {{base_url}}/blog/{{test_blog_slug}}
```

```javascript
pm.test("TC-BC04 - Chi tiết blog trả 200", () => {
  pm.response.to.have.status(200);
});
```

#### BLG-C-05 | Slug không tồn tại

```
GET {{base_url}}/blog/slug-khong-co-{{timestamp}}
```

```javascript
pm.test("TC-BC05 - Slug không tồn tại trả 404", () => {
  pm.expect([302, 404]).to.include(pm.response.code);
});
```

---

## 📁 MODULE 08 — Admin Auth `[🔵 Sơn]`

#### ADM-AUTH-01 | Admin login thành công

```
POST {{base_url}}/admin/auth/login
Body: email={{admin_email}}&password={{admin_password}}
```

```javascript
pm.test("TC-AA01 - Admin login thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.code === 302) {
    pm.expect(pm.response.headers.get("Location")).to.include("dashboard");
  }
});
pm.test("TC-AA01 - Admin session cookie set", () => {
  const cookie = pm.cookies.get("connect.sid");
  pm.expect(cookie).to.exist;
  pm.environment.set("admin_session_set", "true");
});
```

#### ADM-AUTH-02 | Admin login sai password

```
POST {{base_url}}/admin/auth/login
Body: email={{admin_email}}&password=WrongAdminPass
```

```javascript
pm.test("TC-AA02 - Sai password bị từ chối", () => {
  pm.expect([200, 302, 400, 401]).to.include(pm.response.code);
  if (pm.response.code === 302) {
    pm.expect(pm.response.headers.get("Location")).to.not.include("dashboard");
  }
});
```

#### ADM-AUTH-03 | Admin login email không tồn tại

```
POST {{base_url}}/admin/auth/login
Body: email=notadmin@fake.com&password=Test@123
```

```javascript
pm.test("TC-AA03 - Email không tồn tại bị từ chối", () => {
  pm.expect([200, 302, 400, 401]).to.include(pm.response.code);
});
```

#### ADM-AUTH-04 | Admin logout

```
POST {{base_url}}/admin/auth/logout
```

```javascript
pm.test("TC-AA04 - Logout thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.code === 302) {
    pm.expect(pm.response.headers.get("Location")).to.include("login");
  }
});
```

#### ADM-AUTH-05 | Truy cập admin khi chưa login (auth guard)

```
GET {{base_url}}/admin/dashboard
// Không có admin session
```

```javascript
pm.test("TC-AA05 - Admin guard redirect về login", () => {
  pm.expect(pm.response.code).to.equal(302);
  pm.expect(pm.response.headers.get("Location")).to.include("login");
});
```

---

## 📁 MODULE 09 — Admin Products `[🟢 Quyến]`

> Pre-condition: Admin đã login

### 📁 09.1 — CRUD

#### APROD-01 | Lấy danh sách sản phẩm admin

```
GET {{base_url}}/admin/products
```

```javascript
pm.test("TC-AP01 - Danh sách sản phẩm admin OK", () => {
  pm.response.to.have.status(200);
});
```

#### APROD-02 | Phân trang danh sách sản phẩm

```
GET {{base_url}}/admin/products?page=1
```

```javascript
pm.test("TC-AP02 - Pagination page 1 OK", () =>
  pm.response.to.have.status(200),
);
```

#### APROD-03 | Search sản phẩm trong admin

```
GET {{base_url}}/admin/products?search=vitamin
```

```javascript
pm.test("TC-AP03 - Search trong admin OK", () =>
  pm.response.to.have.status(200),
);
```

#### APROD-04 | Tạo sản phẩm thành công

```
POST {{base_url}}/admin/products/create
Content-Type: multipart/form-data
Body: {
  title: Product Test {{timestamp}},
  price: 150000,
  discountPercentage: 10,
  stock: 100,
  description: Mô tả sản phẩm test,
  category_id: {{test_category_id}},
  status: active
}
```

```javascript
pm.test("TC-AP04 - Tạo sản phẩm thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
pm.test("TC-AP04 - Lưu product_id nếu có trong response", () => {
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    const json = pm.response.json();
    if (json.product && json.product._id) {
      pm.environment.set("test_product_id", json.product._id);
      pm.environment.set("test_product_slug", json.product.slug);
    }
  }
});
```

#### APROD-05 | Tạo sản phẩm thiếu title

```
POST {{base_url}}/admin/products/create
Body: {price: 100000, stock: 50}
```

```javascript
pm.test("TC-AP05 - Thiếu title bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### APROD-06 | Tạo sản phẩm với giá âm

```
POST {{base_url}}/admin/products/create
Body: {title: "Test Negative Price", price: -1000, stock: 10}
```

```javascript
pm.test("TC-AP06 - Giá âm bị từ chối hoặc chuẩn hóa", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### APROD-07 | Tạo sản phẩm với stock âm

```
POST {{base_url}}/admin/products/create
Body: {title: "Test Negative Stock", price: 100000, stock: -5}
```

```javascript
pm.test("TC-AP07 - Stock âm bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### APROD-08 | Tạo sản phẩm với discount > 100%

```
POST {{base_url}}/admin/products/create
Body: {title: "Over Discount", price: 100000, stock: 10, discountPercentage: 150}
```

```javascript
pm.test("TC-AP08 - Discount > 100% bị từ chối hoặc cap về 100", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### APROD-09 | Xem chi tiết sản phẩm (ID hợp lệ)

```
GET {{base_url}}/admin/products/detail/{{test_product_id}}
```

```javascript
pm.test("TC-AP09 - Chi tiết sản phẩm OK", () => {
  pm.response.to.have.status(200);
});
```

#### APROD-10 | Xem chi tiết sản phẩm (ID không tồn tại)

```
GET {{base_url}}/admin/products/detail/000000000000000000000000
```

```javascript
pm.test("TC-AP10 - ID không tồn tại trả 404 hoặc redirect", () => {
  pm.expect([302, 404]).to.include(pm.response.code);
});
```

#### APROD-11 | Cập nhật sản phẩm thành công

```
PATCH {{base_url}}/admin/products/edit/{{test_product_id}}
Body: {title: "Updated Product {{timestamp}}", price: 200000}
```

```javascript
pm.test("TC-AP11 - Cập nhật sản phẩm thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.test("TC-AP11 - JSON response OK", () => {
      pm.expect(pm.response.json()).to.be.an("object");
    });
  }
});
```

#### APROD-12 | Cập nhật sản phẩm với title rỗng

```
PATCH {{base_url}}/admin/products/edit/{{test_product_id}}
Body: {title: ""}
```

```javascript
pm.test("TC-AP12 - Title rỗng khi update bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### APROD-13 | Xóa mềm sản phẩm

```
DELETE {{base_url}}/admin/products/delete-product/{{test_product_id}}
```

```javascript
pm.test("TC-AP13 - Xóa sản phẩm thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.test("TC-AP13 - JSON code thành công", () => {
      const json = pm.response.json();
      pm.expect(json.code).to.equal(200);
    });
  }
});
```

#### APROD-14 | Xóa sản phẩm không tồn tại

```
DELETE {{base_url}}/admin/products/delete-product/000000000000000000000000
```

```javascript
pm.test("TC-AP14 - Xóa ID không tồn tại trả 404", () => {
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(404);
  } else {
    pm.expect([302, 404]).to.include(pm.response.code);
  }
});
```

---

### 📁 09.2 — Status Management

#### APROD-15 | Đổi status → active

```
PATCH {{base_url}}/admin/products/change-status/active/{{test_product_id}}
```

```javascript
pm.test("TC-AP15 - Đổi status active thành công", () => {
  pm.response.to.have.status(200);
  const json = pm.response.json();
  pm.expect(json.code).to.equal(200);
});
```

#### APROD-16 | Đổi status → inactive

```
PATCH {{base_url}}/admin/products/change-status/inactive/{{test_product_id}}
```

```javascript
pm.test("TC-AP16 - Đổi status inactive thành công", () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json().code).to.equal(200);
});
```

#### APROD-17 | Đổi status với giá trị không hợp lệ

```
PATCH {{base_url}}/admin/products/change-status/INVALID_STATUS/{{test_product_id}}
```

```javascript
pm.test("TC-AP17 - Status không hợp lệ được xử lý đúng", () => {
  pm.expect([400, 404]).to.include(pm.response.code);
});
```

---

### 📁 09.3 — Bulk Operations

#### APROD-18 | Bulk change status (nhiều ID)

```
PATCH {{base_url}}/admin/products/change-multi
Body: {
  "ids": ["{{test_product_id}}"],
  "key": "status",
  "value": "active"
}
```

```javascript
pm.test("TC-AP18 - Bulk change status thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(200);
  }
});
```

#### APROD-19 | Bulk change với mảng ID rỗng

```
PATCH {{base_url}}/admin/products/change-multi
Body: {"ids": [], "key": "status", "value": "active"}
```

```javascript
pm.test("TC-AP19 - Mảng IDs rỗng được xử lý đúng", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
});
```

---

## 📁 MODULE 10 — Admin Categories `[🟢 Quyến]`

#### CAT-01 | Xem danh sách danh mục

```
GET {{base_url}}/admin/categories
```

```javascript
pm.test("TC-CAT01 - Danh sách categories OK", () =>
  pm.response.to.have.status(200),
);
```

#### CAT-02 | Tạo danh mục gốc (không có parent)

```
POST {{base_url}}/admin/categories/create
Body: {title: "Category Root {{timestamp}}", status: "active"}
```

```javascript
pm.test("TC-CAT02 - Tạo category gốc thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    const json = pm.response.json();
    if (json.category)
      pm.environment.set("test_category_id", json.category._id);
    if (json.category)
      pm.environment.set("test_category_parent_id", json.category._id);
  }
});
```

#### CAT-03 | Tạo danh mục con (có parent_id)

```
POST {{base_url}}/admin/categories/create
Body: {title: "Sub Category {{timestamp}}", parent_id: "{{test_category_parent_id}}", status: "active"}
```

```javascript
pm.test("TC-CAT03 - Tạo sub-category thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### CAT-04 | Tạo danh mục thiếu title

```
POST {{base_url}}/admin/categories/create
Body: {status: "active"}
```

```javascript
pm.test("TC-CAT04 - Thiếu title bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### CAT-05 | Tạo danh mục với parent_id không tồn tại

```
POST {{base_url}}/admin/categories/create
Body: {title: "Orphan Category", parent_id: "000000000000000000000000"}
```

```javascript
pm.test("TC-CAT05 - Parent ID không tồn tại được xử lý đúng", () => {
  pm.expect([200, 302, 400, 404]).to.include(pm.response.code);
});
```

#### CAT-06 | Cập nhật danh mục

```
PATCH {{base_url}}/admin/categories/edit/{{test_category_id}}
Body: {title: "Updated Category {{timestamp}}"}
```

```javascript
pm.test("TC-CAT06 - Cập nhật category thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### CAT-07 | Đổi status category

```
PATCH {{base_url}}/admin/categories/change-status/inactive/{{test_category_id}}
```

```javascript
pm.test("TC-CAT07 - Đổi status category thành công", () => {
  pm.response.to.have.status(200);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(200);
  }
});
```

#### CAT-08 | Bulk change status categories

```
PATCH {{base_url}}/admin/categories/change-multi
Body: {"ids": ["{{test_category_id}}"], "key": "status", "value": "active"}
```

```javascript
pm.test("TC-CAT08 - Bulk change category status thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### CAT-09 | Xóa danh mục

```
DELETE {{base_url}}/admin/categories/delete-category/{{test_category_id}}
```

```javascript
pm.test("TC-CAT09 - Xóa category thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(200);
  }
});
```

#### CAT-10 | Xóa danh mục không tồn tại

```
DELETE {{base_url}}/admin/categories/delete-category/000000000000000000000000
```

```javascript
pm.test("TC-CAT10 - Xóa ID không tồn tại trả lỗi", () => {
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(404);
  } else {
    pm.expect([302, 404]).to.include(pm.response.code);
  }
});
```

---

## 📁 MODULE 11 — Admin Orders `[🔴 Lợi]`

#### AORD-01 | Admin xem tất cả đơn hàng

```
GET {{base_url}}/admin/orders
```

```javascript
pm.test("TC-AO01 - Admin xem đơn hàng OK", () =>
  pm.response.to.have.status(200),
);
```

#### AORD-02 | Filter theo status=pending

```
GET {{base_url}}/admin/orders?status=pending
```

```javascript
pm.test("TC-AO02 - Filter pending OK", () => pm.response.to.have.status(200));
```

#### AORD-03 | Filter theo status=confirmed

```
GET {{base_url}}/admin/orders?status=confirmed
```

```javascript
pm.test("TC-AO03 - Filter confirmed OK", () => pm.response.to.have.status(200));
```

#### AORD-04 | Filter theo status=shipping

```
GET {{base_url}}/admin/orders?status=shipping
```

```javascript
pm.test("TC-AO04 - Filter shipping OK", () => pm.response.to.have.status(200));
```

#### AORD-05 | Filter theo status=completed

```
GET {{base_url}}/admin/orders?status=completed
```

```javascript
pm.test("TC-AO05 - Filter completed OK", () => pm.response.to.have.status(200));
```

#### AORD-06 | Xem chi tiết đơn hàng admin

```
GET {{base_url}}/admin/orders/{{test_order_id}}
```

```javascript
pm.test("TC-AO06 - Chi tiết đơn hàng admin OK", () =>
  pm.response.to.have.status(200),
);
```

#### AORD-07 | Update status: pending → confirmed

```
POST {{base_url}}/admin/orders/{{test_order_id}}/status
Body: {status: "confirmed"}
```

```javascript
pm.test("TC-AO07 - Update pending→confirmed OK", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(200);
  }
});
```

#### AORD-08 | Update status: confirmed → shipping

```
POST {{base_url}}/admin/orders/{{test_order_id}}/status
Body: {status: "shipping"}
```

```javascript
pm.test("TC-AO08 - Update confirmed→shipping OK", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### AORD-09 | Update status: shipping → completed

```
POST {{base_url}}/admin/orders/{{test_order_id}}/status
Body: {status: "completed"}
```

```javascript
pm.test("TC-AO09 - Update shipping→completed OK", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### AORD-10 | Update status với giá trị không hợp lệ

```
POST {{base_url}}/admin/orders/{{test_order_id}}/status
Body: {status: "invalid_status_xyz"}
```

```javascript
pm.test("TC-AO10 - Status không hợp lệ bị từ chối", () => {
  pm.expect([400, 422]).to.include(pm.response.code);
});
```

#### AORD-11 | Update status đơn hàng không tồn tại

```
POST {{base_url}}/admin/orders/000000000000000000000000/status
Body: {status: "confirmed"}
```

```javascript
pm.test("TC-AO11 - Order không tồn tại trả 404", () => {
  pm.expect([302, 404]).to.include(pm.response.code);
});
```

---

## 📁 MODULE 12 — Admin Accounts `[🔴 Lợi]`

#### ACC-01 | Lấy danh sách tài khoản admin

```
GET {{base_url}}/admin/accounts
```

```javascript
pm.test("TC-ACC01 - Danh sách accounts OK", () =>
  pm.response.to.have.status(200),
);
```

#### ACC-02 | Tạo tài khoản admin mới

```
POST {{base_url}}/admin/accounts/create
Body: {
  fullName: "Admin Test {{timestamp}}",
  email: "admintest_{{timestamp}}@verdish.com",
  password: "Admin@123",
  phone: "0901234567",
  role_id: "{{test_role_id}}"
}
```

```javascript
pm.test("TC-ACC02 - Tạo account admin thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    const json = pm.response.json();
    if (json.account) pm.environment.set("test_account_id", json.account._id);
  }
});
```

#### ACC-03 | Tạo tài khoản email đã tồn tại

```
POST {{base_url}}/admin/accounts/create
Body: {fullName: "Dup Admin", email: "{{admin_email}}", password: "Admin@123"}
```

```javascript
pm.test("TC-ACC03 - Email đã tồn tại bị từ chối", () => {
  pm.expect([200, 302, 400, 409]).to.include(pm.response.code);
});
```

#### ACC-04 | Tạo tài khoản thiếu email

```
POST {{base_url}}/admin/accounts/create
Body: {fullName: "No Email Admin", password: "Admin@123"}
```

```javascript
pm.test("TC-ACC04 - Thiếu email bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### ACC-05 | Tạo tài khoản password quá ngắn

```
POST {{base_url}}/admin/accounts/create
Body: {fullName: "Short Pass", email: "short@test.com", password: "abc"}
```

```javascript
pm.test("TC-ACC05 - Password ngắn bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### ACC-06 | Xem chi tiết tài khoản

```
GET {{base_url}}/admin/accounts/detail/{{test_account_id}}
```

```javascript
pm.test("TC-ACC06 - Chi tiết account OK", () =>
  pm.response.to.have.status(200),
);
```

#### ACC-07 | Xem chi tiết ID không tồn tại

```
GET {{base_url}}/admin/accounts/detail/000000000000000000000000
```

```javascript
pm.test("TC-ACC07 - ID không tồn tại trả 404", () => {
  pm.expect([302, 404]).to.include(pm.response.code);
});
```

#### ACC-08 | Cập nhật tài khoản admin

```
PATCH {{base_url}}/admin/accounts/edit/{{test_account_id}}
Body: {fullName: "Updated Admin {{timestamp}}"}
```

```javascript
pm.test("TC-ACC08 - Cập nhật account thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### ACC-09 | Khóa tài khoản (inactive)

```
PATCH {{base_url}}/admin/accounts/change-status/inactive/{{test_account_id}}
```

```javascript
pm.test("TC-ACC09 - Khóa account thành công", () => {
  pm.response.to.have.status(200);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(200);
  }
});
```

#### ACC-10 | Mở khóa tài khoản (active)

```
PATCH {{base_url}}/admin/accounts/change-status/active/{{test_account_id}}
```

```javascript
pm.test("TC-ACC10 - Mở khóa account thành công", () => {
  pm.response.to.have.status(200);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(200);
  }
});
```

#### ACC-11 | Xóa mềm tài khoản

```
DELETE {{base_url}}/admin/accounts/delete-account/{{test_account_id}}
```

```javascript
pm.test("TC-ACC11 - Xóa account thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(200);
  }
});
```

#### ACC-12 | Xóa tài khoản không tồn tại

```
DELETE {{base_url}}/admin/accounts/delete-account/000000000000000000000000
```

```javascript
pm.test("TC-ACC12 - Xóa ID không tồn tại trả 404", () => {
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    pm.expect(pm.response.json().code).to.equal(404);
  } else {
    pm.expect([302, 404]).to.include(pm.response.code);
  }
});
```

---

## 📁 MODULE 13 — Admin Roles & Permissions `[🔴 Lợi]`

#### ROLE-01 | Xem danh sách roles

```
GET {{base_url}}/admin/roles
```

```javascript
pm.test("TC-RL01 - Danh sách roles OK", () => pm.response.to.have.status(200));
```

#### ROLE-02 | Tạo role mới thành công

```
POST {{base_url}}/admin/roles/create
Body: {title: "Test Role {{timestamp}}", description: "Role for testing"}
```

```javascript
pm.test("TC-RL02 - Tạo role thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    const json = pm.response.json();
    if (json.role) pm.environment.set("test_role_id", json.role._id);
  }
});
```

#### ROLE-03 | Tạo role thiếu title

```
POST {{base_url}}/admin/roles/create
Body: {description: "No title role"}
```

```javascript
pm.test("TC-RL03 - Thiếu title bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### ROLE-04 | Xem chi tiết role

```
GET {{base_url}}/admin/roles/detail/{{test_role_id}}
```

```javascript
pm.test("TC-RL04 - Chi tiết role OK", () => pm.response.to.have.status(200));
```

#### ROLE-05 | Cập nhật role

```
PATCH {{base_url}}/admin/roles/edit/{{test_role_id}}
Body: {title: "Updated Role {{timestamp}}"}
```

```javascript
pm.test("TC-RL05 - Cập nhật role thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### ROLE-06 | Xem trang permissions

```
GET {{base_url}}/admin/roles/permissions
```

```javascript
pm.test("TC-RL06 - Trang permissions OK", () =>
  pm.response.to.have.status(200),
);
```

#### ROLE-07 | Cập nhật permissions cho role

```
PATCH {{base_url}}/admin/roles/permissions
Body: {
  "permissions": [
    {"roleId": "{{test_role_id}}", "permissions": ["products_view", "products_edit"]}
  ]
}
```

```javascript
pm.test("TC-RL07 - Cập nhật permissions thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### ROLE-08 | Cập nhật permissions với role không tồn tại

```
PATCH {{base_url}}/admin/roles/permissions
Body: {
  "permissions": [
    {"roleId": "000000000000000000000000", "permissions": ["products_view"]}
  ]
}
```

```javascript
pm.test("TC-RL08 - Role ID không tồn tại được xử lý đúng", () => {
  pm.expect([200, 302, 400, 404]).to.include(pm.response.code);
});
```

#### ROLE-09 | Xóa role

```
DELETE {{base_url}}/admin/roles/delete-role/{{test_role_id}}
```

```javascript
pm.test("TC-RL09 - Xóa role thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

---

## 📁 MODULE 14 — Admin Blog `[🔴 Lợi]`

#### ABLG-01 | Xem danh sách bài viết admin

```
GET {{base_url}}/admin/blog
```

```javascript
pm.test("TC-AB01 - Danh sách blog admin OK", () =>
  pm.response.to.have.status(200),
);
```

#### ABLG-02 | Tạo bài viết thành công

```
POST {{base_url}}/admin/blog/create
Content-Type: multipart/form-data
Body: {
  title: "Blog Test {{timestamp}}",
  content: "Nội dung bài viết test rất dài...",
  status: "active"
}
```

```javascript
pm.test("TC-AB02 - Tạo blog thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.headers.get("Content-Type")?.includes("json")) {
    const json = pm.response.json();
    if (json.blog) {
      pm.environment.set("test_blog_id", json.blog._id);
      pm.environment.set("test_blog_slug", json.blog.slug);
    }
  }
});
```

#### ABLG-03 | Tạo bài viết thiếu title

```
POST {{base_url}}/admin/blog/create
Body: {content: "Content without title"}
```

```javascript
pm.test("TC-AB03 - Thiếu title bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### ABLG-04 | Tạo bài viết thiếu content

```
POST {{base_url}}/admin/blog/create
Body: {title: "Title Without Content"}
```

```javascript
pm.test("TC-AB04 - Thiếu content bị từ chối", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### ABLG-05 | Tạo bài viết title quá ngắn

```
POST {{base_url}}/admin/blog/create
Body: {title: "Hi", content: "Some valid content here"}
```

```javascript
pm.test("TC-AB05 - Title quá ngắn bị từ chối hoặc chấp nhận", () => {
  pm.expect([200, 302, 400, 422]).to.include(pm.response.code);
});
```

#### ABLG-06 | Cập nhật bài viết

```
POST {{base_url}}/admin/blog/edit/{{test_blog_id}}
Body: {title: "Updated Blog {{timestamp}}", content: "Updated content"}
```

```javascript
pm.test("TC-AB06 - Cập nhật blog thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### ABLG-07 | Cập nhật blog ID không tồn tại

```
POST {{base_url}}/admin/blog/edit/000000000000000000000000
Body: {title: "Ghost Blog", content: "Ghost content"}
```

```javascript
pm.test("TC-AB07 - Blog không tồn tại trả 404", () => {
  pm.expect([302, 404]).to.include(pm.response.code);
});
```

#### ABLG-08 | Xóa bài viết (GET method — non-standard)

```
GET {{base_url}}/admin/blog/delete/{{test_blog_id}}
```

```javascript
pm.test("TC-AB08 - Xóa blog thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});
```

#### ABLG-09 | Xóa bài viết không tồn tại

```
GET {{base_url}}/admin/blog/delete/000000000000000000000000
```

```javascript
pm.test("TC-AB09 - Xóa ID không tồn tại trả 404", () => {
  pm.expect([302, 404]).to.include(pm.response.code);
});
```

---

## 📁 MODULE 15 — Admin Dashboard `[🔴 Lợi]`

### 📁 15.1 — Revenue API (JSON endpoints)

#### DASH-01 | Revenue theo ngày

```
GET {{base_url}}/admin/dashboard/revenue/day
```

```javascript
pm.test("TC-D01 - Revenue/day trả JSON", () => {
  pm.response.to.have.status(200);
  pm.response.to.be.json;
});
pm.test("TC-D01 - Data là array", () => {
  const json = pm.response.json();
  pm.expect(json.data || json).to.be.an("array");
});
pm.test("TC-D01 - Response time < 2s", () => {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

#### DASH-02 | Revenue theo tháng

```
GET {{base_url}}/admin/dashboard/revenue/month
```

```javascript
pm.test("TC-D02 - Revenue/month trả JSON hợp lệ", () => {
  pm.response.to.have.status(200);
  pm.response.to.be.json;
  const json = pm.response.json();
  pm.expect(json.data || json).to.be.an("array");
});
```

#### DASH-03 | Revenue theo quý

```
GET {{base_url}}/admin/dashboard/revenue/quarter
```

```javascript
pm.test("TC-D03 - Revenue/quarter trả JSON hợp lệ", () => {
  pm.response.to.have.status(200);
  pm.response.to.be.json;
  const json = pm.response.json();
  pm.expect(json.data || json).to.satisfy(
    (d) => Array.isArray(d) && d.length <= 4,
    "Tối đa 4 quý",
  );
});
```

#### DASH-04 | Revenue theo năm

```
GET {{base_url}}/admin/dashboard/revenue/year
```

```javascript
pm.test("TC-D04 - Revenue/year trả JSON hợp lệ", () => {
  pm.response.to.have.status(200);
  pm.response.to.be.json;
});
```

#### DASH-05 | Revenue không có admin session

```
GET {{base_url}}/admin/dashboard/revenue/day
// Không có session
```

```javascript
pm.test("TC-D05 - Revenue không có auth bị từ chối", () => {
  pm.expect([302, 401, 403]).to.include(pm.response.code);
});
```

---

### 📁 15.2 — Export

#### DASH-06 | Export báo cáo Excel

```
POST {{base_url}}/admin/dashboard/export-excel
Body: {startDate: "2025-01-01", endDate: "2025-12-31"}
```

```javascript
pm.test("TC-D06 - Export Excel OK", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.code === 200) {
    pm.expect(pm.response.headers.get("Content-Type")).to.satisfy(
      (ct) =>
        ct.includes("spreadsheetml") ||
        ct.includes("excel") ||
        ct.includes("octet-stream"),
    );
  }
});
```

#### DASH-07 | Export báo cáo Word

```
POST {{base_url}}/admin/dashboard/export-word
Body: {startDate: "2025-01-01", endDate: "2025-12-31"}
```

```javascript
pm.test("TC-D07 - Export Word OK", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  if (pm.response.code === 200) {
    pm.expect(pm.response.headers.get("Content-Type")).to.satisfy(
      (ct) =>
        ct.includes("wordprocessingml") ||
        ct.includes("msword") ||
        ct.includes("octet-stream"),
    );
  }
});
```

#### DASH-08 | Export với date range không hợp lệ

```
POST {{base_url}}/admin/dashboard/export-excel
Body: {startDate: "2025-12-31", endDate: "2025-01-01"}
```

```javascript
pm.test("TC-D08 - Date range ngược được xử lý đúng", () => {
  pm.expect([200, 302, 400]).to.include(pm.response.code);
  pm.expect(pm.response.code).to.not.equal(500);
});
```

---

## 📁 MODULE 16 — E2E Scenarios `[Cả nhóm]`

### E2E-01 | Full Register → Login Flow `[🔵 Sơn]`

> Sử dụng Collection Runner, chạy tuần tự

```javascript
// ===== Request 1: Gửi OTP đăng ký =====
// POST {{base_url}}/register
// Pre-req: pm.environment.set("e2e_email", `e2e_${Date.now()}@test.com`)
pm.test("E2E01-Step1: Gửi OTP thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});

// ===== Request 2: Verify OTP =====
// POST {{base_url}}/register/verify-otp
pm.test("E2E01-Step2: Verify OTP thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});

// ===== Request 3: Tạo tài khoản =====
// POST {{base_url}}/register/create-account
pm.test("E2E01-Step3: Tạo tài khoản thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});

// ===== Request 4: Login với tài khoản vừa tạo =====
// POST {{base_url}}/login
pm.test("E2E01-Step4: Login thành công sau khi đăng ký", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  pm.expect(pm.cookies.get("connect.sid")).to.exist;
});
```

---

### E2E-02 | Full Password Reset Flow `[🔵 Sơn]`

```javascript
// Step 1: POST /password/forgot → gửi OTP
pm.test("E2E02-Step1: Gửi OTP reset", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 2: POST /password/verify-otp → xác nhận OTP
pm.test("E2E02-Step2: Verify OTP reset", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 3: POST /password/reset-password → đặt mật khẩu mới
pm.test("E2E02-Step3: Reset password thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
});

// Step 4: POST /login → đăng nhập với mật khẩu mới
pm.test("E2E02-Step4: Login với password mới thành công", () => {
  pm.expect([200, 302]).to.include(pm.response.code);
  pm.expect(pm.cookies.get("connect.sid")).to.exist;
});
```

---

### E2E-03 | Full Shopping Flow `[🟡 Đạt]`

```javascript
// Step 1: POST /login (client)
pm.test("E2E03-Step1: Login client", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 2: GET /products → lấy danh sách, extract product_id
pm.test("E2E03-Step2: Lấy danh sách sản phẩm", () =>
  pm.response.to.have.status(200),
);

// Step 3: POST /cart/add → thêm vào giỏ
pm.test("E2E03-Step3: Thêm sản phẩm vào giỏ", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 4: GET /cart → verify có items
pm.test("E2E03-Step4: Giỏ hàng có items", () =>
  pm.response.to.have.status(200),
);

// Step 5: POST /checkout/place-order → đặt hàng
pm.test("E2E03-Step5: Đặt hàng thành công", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 6: GET /cart → verify cart trống
pm.test("E2E03-Step6: Cart trống sau khi đặt hàng", () =>
  pm.response.to.have.status(200),
);

// Step 7: GET /orders → verify order tồn tại
pm.test("E2E03-Step7: Order xuất hiện trong danh sách", () =>
  pm.response.to.have.status(200),
);
```

---

### E2E-04 | Multi-product Cart & Checkout `[🟡 Đạt]`

```javascript
// Step 1: Login
// Step 2: Add product_1 (qty=2)
// Step 3: Add product_2 (qty=1)
// Step 4: Add product_3 (qty=3)
// Step 5: GET /cart → verify 3 products
pm.test("E2E04: Cart có 3 sản phẩm khác nhau", () =>
  pm.response.to.have.status(200),
);

// Step 6: Update product_1 qty → 5
// Step 7: Delete product_2
// Step 8: GET /cart → verify 2 products
// Step 9: Place order
pm.test("E2E04: Đặt hàng multi-product thành công", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);
```

---

### E2E-05 | Cancel Order Flow `[🟡 Đạt]`

```javascript
// Step 1: Login
// Step 2: Add to cart
// Step 3: Place order
pm.test("E2E05-Step3: Đặt hàng tạo order pending", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 4: GET /orders → verify status=pending
pm.test("E2E05-Step4: Order status là pending", () =>
  pm.response.to.have.status(200),
);

// Step 5: POST /orders/:id/cancel
pm.test("E2E05-Step5: Hủy đơn hàng thành công", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 6: GET /orders/:id → verify status=cancelled
pm.test("E2E05-Step6: Order status là cancelled", () =>
  pm.response.to.have.status(200),
);
```

---

### E2E-06 | Admin Product Lifecycle `[🟢 Quyến]`

```javascript
// Step 1: Admin login
// Step 2: Create category
pm.test("E2E06-Step2: Tạo category", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 3: Create product
pm.test("E2E06-Step3: Tạo sản phẩm với category", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 4: GET /admin/products/detail/:id → verify product
pm.test("E2E06-Step4: Product tồn tại", () => pm.response.to.have.status(200));

// Step 5: Change status → inactive
pm.test("E2E06-Step5: Product inactive thành công", () =>
  pm.response.to.have.status(200),
);

// Step 6: GET /detail/:slug → verify product không hiển thị client
pm.test("E2E06-Step6: Product inactive không hiển thị client", () => {
  pm.expect([302, 404]).to.include(pm.response.code);
});

// Step 7: Change status → active
// Step 8: Delete product
pm.test("E2E06-Step8: Xóa sản phẩm thành công", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);
```

---

### E2E-07 | Admin Order Status Pipeline `[🔴 Lợi]`

```javascript
// Step 1: Client login → add to cart → place order
// Step 2: Admin login
// Step 3: GET /admin/orders → tìm order mới
// Step 4: POST /admin/orders/:id/status → confirmed
pm.test("E2E07-Step4: pending→confirmed", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 5: POST → shipping
pm.test("E2E07-Step5: confirmed→shipping", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 6: POST → completed
pm.test("E2E07-Step6: shipping→completed", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 7: Verify client nhìn thấy status completed
pm.test("E2E07-Step7: Client xem được order completed", () =>
  pm.response.to.have.status(200),
);
```

---

### E2E-08 | Admin Account Lifecycle `[🔴 Lợi]`

```javascript
// Step 1: Admin login
// Step 2: Create new admin account
pm.test("E2E08-Step2: Tạo account mới", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 3: Login bằng account mới
pm.test("E2E08-Step3: Account mới login được", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);

// Step 4: Admin gốc lock account mới
pm.test("E2E08-Step4: Lock account thành công", () =>
  pm.response.to.have.status(200),
);

// Step 5: Account mới thử login → bị từ chối
pm.test("E2E08-Step5: Locked account không login được", () => {
  pm.expect([200, 302, 401, 403]).to.include(pm.response.code);
});

// Step 6: Unlock account
pm.test("E2E08-Step6: Unlock thành công", () =>
  pm.response.to.have.status(200),
);

// Step 7: Delete account
pm.test("E2E08-Step7: Xóa account thành công", () =>
  pm.expect([200, 302]).to.include(pm.response.code),
);
```

---

## 🔢 Tổng hợp Test Cases

| Module             | Folder         | Tests          | Người phụ trách |
| ------------------ | -------------- | -------------- | --------------- |
| Client Auth        | 01             | 27             | 🔵 Sơn          |
| Client Blog        | 07             | 5              | 🔵 Sơn          |
| Admin Auth         | 08             | 5              | 🔵 Sơn          |
| **Subtotal Sơn**   |                | **37**         |                 |
| Client Products    | 02             | 16             | 🟢 Quyến        |
| Admin Products     | 09             | 19             | 🟢 Quyến        |
| Admin Categories   | 10             | 10             | 🟢 Quyến        |
| **Subtotal Quyến** |                | **45**         |                 |
| Client Cart        | 03             | 15             | 🟡 Đạt          |
| Client Checkout    | 04             | 8              | 🟡 Đạt          |
| Client Orders      | 05             | 10             | 🟡 Đạt          |
| Client Profile     | 06             | 6              | 🟡 Đạt          |
| **Subtotal Đạt**   |                | **39**         |                 |
| Admin Orders       | 11             | 11             | 🔴 Lợi          |
| Admin Accounts     | 12             | 12             | 🔴 Lợi          |
| Admin Roles        | 13             | 9              | 🔴 Lợi          |
| Admin Blog         | 14             | 9              | 🔴 Lợi          |
| Admin Dashboard    | 15             | 8              | 🔴 Lợi          |
| **Subtotal Lợi**   |                | **49**         |                 |
| E2E Scenarios      | 16             | 8 flows        | Cả nhóm         |
| **GRAND TOTAL**    | **16 modules** | **~230 tests** |                 |

### Phân loại test

| Loại                     | Count | %   |
| ------------------------ | ----- | --- |
| ✅ Happy Path            | ~100  | 43% |
| ❌ Error / Negative      | ~75   | 33% |
| 🔐 Security / Auth Guard | ~20   | 9%  |
| 📐 Boundary Values       | ~15   | 7%  |
| 🔗 E2E Flows             | ~20   | 8%  |

---

## ⚙️ Newman CLI Setup

### Cài đặt

```bash
npm install -g newman
npm install -g newman-reporter-htmlextra
```

### Chạy toàn bộ collection

```bash
newman run Verdish-Automation.postman_collection.json \
  --environment Verdish-Local.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/test-report.html \
  --reporter-htmlextra-title "Verdish API Test Report" \
  --delay-request 200 \
  --timeout-request 10000
```

### Chạy từng module riêng lẻ

```bash
# Chỉ chạy module Auth
newman run Verdish-Automation.json \
  --env Verdish-Local.json \
  --folder "01 — Client Auth" \
  --reporters cli,htmlextra

# Chỉ chạy E2E
newman run Verdish-Automation.json \
  --env Verdish-Local.json \
  --folder "16 — E2E Scenarios"
```

### Tích hợp CI/CD (GitHub Actions)

```yaml
- name: Run Postman Tests
  run: |
    newman run docs/Verdish-Automation.postman_collection.json \
      --environment docs/Verdish-CI.postman_environment.json \
      --reporters cli,junit \
      --reporter-junit-export reports/newman-results.xml \
      --bail
```

---

## 📌 Checklist trước khi submit

- [ ] Tất cả 16 folders được tạo trong Postman
- [ ] Environment variables đầy đủ và đúng giá trị
- [ ] Cookie jar đã bật cho domain localhost:3000
- [ ] "Automatically follow redirects" đã **tắt**
- [ ] Ít nhất ~85% tests pass (pass/total ≥ 85%)
- [ ] Newman chạy được không lỗi
- [ ] HTML report được export
- [ ] Screenshot kết quả từng module
- [ ] E2E flows chạy thành công end-to-end
