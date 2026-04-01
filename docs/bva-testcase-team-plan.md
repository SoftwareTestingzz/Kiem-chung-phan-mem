# Ke Hoach Test Case BVA Cho Ca Nhom (Integration Testing)

## 1) Muc tieu

- Tao bo test case theo phuong phap Boundary Value Analysis (BVA) cho toan bo phan cong integration testing.
- Giu nguyen pham vi module theo tai lieu phan cong truoc do.
- Chuan hoa cach viet test case de ca nhom co the chia viec, chay Newman, va tong hop loi de bao cao.

## 2) Co so phan cong (giu nguyen)

- Son: Client Auth, Client Blog, Admin Auth, E2E-01, E2E-02.
- Quyen: Client Products, Admin Products, Admin Categories, E2E-06.
- Dat: Client Cart, Client Checkout, Client Orders, Client Profile, E2E-03, E2E-04, E2E-05.
- Loi: Admin Orders, Admin Accounts, Admin Roles & Permissions, Admin Blog, Admin Dashboard, E2E-07, E2E-08.

## 3) Nguyen tac BVA ap dung

- Bai toan co nguong min: test bo {min-1, min, min+1}.
- Bai toan co mien gia tri hop le: test bo {duoi min, tai min, trong mien, tai max (neu co), tren max}.
- Bai toan enum/trang thai: test {gia tri hop le dai dien, gia tri ngoai tap}.
- Bai toan danh sach: test {rong, 1 phan tu, nhieu phan tu}.
- Moi test case can ghi ro:
  - Input boundary
  - Dieu kien tien de (session, du lieu seed)
  - Expected result (status code, body/flash message, redirect, cookie)

## 4) Nguong bien da xac dinh tu ma nguon

- Client register/reset password:
  - password min length = 6
  - bat buoc co chu hoa, chu thuong, so, ky tu dac biet
  - confirmPassword phai trung password
- Client login:
  - email khong rong, dung dinh dang
  - password khong rong
- Client checkout:
  - phone regex VN: 0 + (3|5|7|8|9) + 8 so (tong 10 ky tu so)
  - selectedItems khong rong
- Admin login:
  - email khong rong, dung dinh dang
  - password khong rong
- Admin account:
  - fullName >= 2 ky tu
  - password >= 6 (tao moi bat buoc, edit la tuy chon)
  - confirmPassword phai khop
  - phone theo regex SDT VN
  - role_id bat buoc
- Admin category:
  - title >= 3
  - description (neu co) >= 10
  - position la so nguyen >= 1 (neu co)
  - status thuoc {active, inactive}
- Admin product:
  - title >= 5
  - description bat buoc
  - price >= 0
  - stock >= 0
- Cart service:
  - addToCart: quantity > 0, quantity <= stock
  - updateQuantity: quantity <= 0 thi remove item, quantity > maxStock thi loi
- Orders service:
  - client chi huy khi status thuoc {pending, confirmed}
  - admin khong duoc set status = cancelled
  - admin pagination: page <= 0 thi ve page = 1, limit mac dinh = 10 neu khong hop le

## 5) Test case chi tiet theo thanh vien (mo rong)

Tong so test case BVA de xuat: 92

- Son: 23 test cases
- Quyen: 24 test cases
- Dat: 25 test cases
- Loi: 20 test cases

## 5.1 Son phu trach (Client Auth + Client Blog + Admin Auth)

### A) Client Auth (01)

| TC ID          | Nguoi phu trach | Endpoint/Flow        | Boundary Input                    | Du lieu test                            | Expected                           |
| -------------- | --------------- | -------------------- | --------------------------------- | --------------------------------------- | ---------------------------------- |
| BVA-AUTH-L-01  | Son             | POST /login          | Email rong                        | email="", password=hop le               | 400, loi email bat buoc            |
| BVA-AUTH-L-02  | Son             | POST /login          | Email chi co khoang trang         | email=" "                               | 400                                |
| BVA-AUTH-L-03  | Son             | POST /login          | Email sai format can duoi         | "a@"                                    | 400                                |
| BVA-AUTH-L-04  | Son             | POST /login          | Email dung format can tren co ban | "a@b.co"                                | qua validation                     |
| BVA-AUTH-L-05  | Son             | POST /login          | Password rong                     | password=""                             | 400                                |
| BVA-AUTH-L-06  | Son             | POST /login          | Password 1 ky tu                  | "a"                                     | qua validation form, xac thuc fail |
| BVA-AUTH-R-01  | Son             | POST /register       | Password min-1                    | 5 ky tu, du cac rule con lai            | 400                                |
| BVA-AUTH-R-02  | Son             | POST /register       | Password tai min                  | 6 ky tu, dung format                    | pass validation                    |
| BVA-AUTH-R-03  | Son             | POST /register       | Password min+1                    | 7 ky tu, dung format                    | pass validation                    |
| BVA-AUTH-R-04  | Son             | POST /register       | Thieu chu hoa                     | "abc1@x"                                | 400                                |
| BVA-AUTH-R-05  | Son             | POST /register       | Thieu chu thuong                  | "ABC1@X"                                | 400                                |
| BVA-AUTH-R-06  | Son             | POST /register       | Thieu chu so                      | "Abc@xy"                                | 400                                |
| BVA-AUTH-R-07  | Son             | POST /register       | Thieu ky tu dac biet              | "Abc123"                                | 400                                |
| BVA-AUTH-R-08  | Son             | POST /register       | confirmPassword khac 1 ky tu      | confirm=Password@2, password=Password@1 | 400                                |
| BVA-AUTH-R-09  | Son             | POST /register       | confirmPassword trung khop        | confirm=password                        | pass                               |
| BVA-AUTH-FP-01 | Son             | POST /password/reset | Password min-1                    | 5 ky tu                                 | 400                                |
| BVA-AUTH-FP-02 | Son             | POST /password/reset | Password tai min                  | 6 ky tu + dung rule                     | pass                               |
| BVA-AUTH-FP-03 | Son             | POST /password/reset | confirmPassword sai               | confirm != password                     | 400                                |

### B) Client Blog (07)

| TC ID         | Nguoi phu trach | Endpoint/Flow   | Boundary Input | Du lieu test    | Expected                         |
| ------------- | --------------- | --------------- | -------------- | --------------- | -------------------------------- |
| BVA-BLOG-C-01 | Son             | GET /blog/:slug | Slug rong      | slug=""         | 404/redirect an toan             |
| BVA-BLOG-C-02 | Son             | GET /blog/:slug | Slug 1 ky tu   | "a"             | khong crash                      |
| BVA-BLOG-C-03 | Son             | GET /blog/:slug | Slug rat dai   | 200+ ky tu      | khong crash, tra ket qua an toan |
| BVA-BLOG-C-04 | Son             | GET /blog?page= | page=0         | fallback page 1 |
| BVA-BLOG-C-05 | Son             | GET /blog?page= | page=-1        | fallback page 1 |
| BVA-BLOG-C-06 | Son             | GET /blog?page= | page=1         | tra trang dau   |

### C) Admin Auth (08)

| TC ID         | Nguoi phu trach | Endpoint/Flow          | Boundary Input              | Du lieu test | Expected              |
| ------------- | --------------- | ---------------------- | --------------------------- | ------------ | --------------------- |
| BVA-ADAUTH-01 | Son             | POST /admin/auth/login | Email rong                  | ""           | redirect back + flash |
| BVA-ADAUTH-02 | Son             | POST /admin/auth/login | Email khoang trang          | " "          | redirect back + flash |
| BVA-ADAUTH-03 | Son             | POST /admin/auth/login | Email sai format            | "a@"         | redirect back + flash |
| BVA-ADAUTH-04 | Son             | POST /admin/auth/login | Email dung format ngan nhat | "a@b.co"     | qua validation        |
| BVA-ADAUTH-05 | Son             | POST /admin/auth/login | Password rong               | ""           | redirect back + flash |

## 5.2 Quyen phu trach (Client Products + Admin Products + Admin Categories)

### A) Client Products (02)

| TC ID        | Nguoi phu trach | Endpoint/Flow          | Boundary Input     | Du lieu test | Expected                         |
| ------------ | --------------- | ---------------------- | ------------------ | ------------ | -------------------------------- |
| BVA-CPROD-01 | Quyen           | GET /products?page=    | page=-1            | page=-1      | fallback page 1                  |
| BVA-CPROD-02 | Quyen           | GET /products?page=    | page=0             | page=0       | fallback page 1                  |
| BVA-CPROD-03 | Quyen           | GET /products?page=    | page=1             | page=1       | ket qua hop le                   |
| BVA-CPROD-04 | Quyen           | GET /products?page=    | page rat lon       | page=99999   | tra rong hoac trang cuoi an toan |
| BVA-CPROD-05 | Quyen           | GET /products?keyword= | keyword rong       | ""           | khong loi                        |
| BVA-CPROD-06 | Quyen           | GET /products?keyword= | keyword 1 ky tu    | "a"          | khong loi                        |
| BVA-CPROD-07 | Quyen           | GET /products/:slug    | slug khong ton tai | random       | 404/redirect hop le              |

### B) Admin Products (09)

| TC ID        | Nguoi phu trach | Endpoint/Flow               | Boundary Input   | Du lieu test | Expected |
| ------------ | --------------- | --------------------------- | ---------------- | ------------ | -------- |
| BVA-APROD-01 | Quyen           | POST /admin/products/create | title min-1      | 4 ky tu      | fail     |
| BVA-APROD-02 | Quyen           | POST /admin/products/create | title tai min    | 5 ky tu      | pass     |
| BVA-APROD-03 | Quyen           | POST /admin/products/create | title min+1      | 6 ky tu      | pass     |
| BVA-APROD-04 | Quyen           | POST /admin/products/create | description rong | ""           | fail     |
| BVA-APROD-05 | Quyen           | POST /admin/products/create | price duoi min   | -0.01        | fail     |
| BVA-APROD-06 | Quyen           | POST /admin/products/create | price tai min    | 0            | pass     |
| BVA-APROD-07 | Quyen           | POST /admin/products/create | price tren min   | 0.01         | pass     |
| BVA-APROD-08 | Quyen           | POST /admin/products/create | stock duoi min   | -1           | fail     |
| BVA-APROD-09 | Quyen           | POST /admin/products/create | stock tai min    | 0            | pass     |
| BVA-APROD-10 | Quyen           | POST /admin/products/create | stock tren min   | 1            | pass     |

### C) Admin Categories (10)

| TC ID       | Nguoi phu trach | Endpoint/Flow                 | Boundary Input      | Du lieu test | Expected |
| ----------- | --------------- | ----------------------------- | ------------------- | ------------ | -------- |
| BVA-ACAT-01 | Quyen           | POST /admin/categories/create | title min-1         | 2 ky tu      | fail     |
| BVA-ACAT-02 | Quyen           | POST /admin/categories/create | title tai min       | 3 ky tu      | pass     |
| BVA-ACAT-03 | Quyen           | POST /admin/categories/create | title min+1         | 4 ky tu      | pass     |
| BVA-ACAT-04 | Quyen           | POST /admin/categories/create | description min-1   | 9 ky tu      | fail     |
| BVA-ACAT-05 | Quyen           | POST /admin/categories/create | description tai min | 10 ky tu     | pass     |
| BVA-ACAT-06 | Quyen           | POST /admin/categories/create | position duoi min   | 0            | fail     |
| BVA-ACAT-07 | Quyen           | POST /admin/categories/create | position tai min    | 1            | pass     |
| BVA-ACAT-08 | Quyen           | POST /admin/categories/create | position tren min   | 2            | pass     |
| BVA-ACAT-09 | Quyen           | POST /admin/categories/create | status ngoai enum   | "draft"      | fail     |
| BVA-ACAT-10 | Quyen           | POST /admin/categories/create | status hop le 1     | active       | pass     |
| BVA-ACAT-11 | Quyen           | POST /admin/categories/create | status hop le 2     | inactive     | pass     |

## 5.3 Dat phu trach (Cart + Checkout + Orders + Profile)

### A) Client Cart (03)

| TC ID       | Nguoi phu trach | Endpoint/Flow     | Boundary Input      | Du lieu test | Expected    |
| ----------- | --------------- | ----------------- | ------------------- | ------------ | ----------- |
| BVA-CART-01 | Dat             | POST /cart/add    | quantity=-1         | -1           | fail        |
| BVA-CART-02 | Dat             | POST /cart/add    | quantity=0          | 0            | fail        |
| BVA-CART-03 | Dat             | POST /cart/add    | quantity=1          | 1            | pass        |
| BVA-CART-04 | Dat             | POST /cart/add    | quantity=stock-1    | stock-1      | pass        |
| BVA-CART-05 | Dat             | POST /cart/add    | quantity=stock      | stock        | pass        |
| BVA-CART-06 | Dat             | POST /cart/add    | quantity=stock+1    | stock+1      | fail        |
| BVA-CART-07 | Dat             | POST /cart/update | quantity<=0         | 0            | remove item |
| BVA-CART-08 | Dat             | POST /cart/update | quantity=1          | 1            | pass        |
| BVA-CART-09 | Dat             | POST /cart/update | quantity=maxStock   | maxStock     | pass        |
| BVA-CART-10 | Dat             | POST /cart/update | quantity=maxStock+1 | maxStock+1   | fail        |

### B) Client Checkout (04)

| TC ID      | Nguoi phu trach | Endpoint/Flow        | Boundary Input           | Du lieu test | Expected |
| ---------- | --------------- | -------------------- | ------------------------ | ------------ | -------- |
| BVA-CHK-01 | Dat             | POST /checkout/order | selectedItems rong       | []           | fail     |
| BVA-CHK-02 | Dat             | POST /checkout/order | selectedItems 1 item     | [1 item]     | pass     |
| BVA-CHK-03 | Dat             | POST /checkout/order | selectedItems nhieu item | [3 items]    | pass     |
| BVA-CHK-04 | Dat             | POST /checkout/order | phone 9 so               | 03xxxxxxx    | fail     |
| BVA-CHK-05 | Dat             | POST /checkout/order | phone 10 so              | 03xxxxxxxx   | pass     |
| BVA-CHK-06 | Dat             | POST /checkout/order | phone 11 so              | 03xxxxxxxxx  | fail     |
| BVA-CHK-07 | Dat             | POST /checkout/order | dau so sai               | 02xxxxxxxx   | fail     |
| BVA-CHK-08 | Dat             | POST /checkout/order | name rong                | ""           | fail     |
| BVA-CHK-09 | Dat             | POST /checkout/order | address rong             | ""           | fail     |

### C) Client Orders (05)

| TC ID      | Nguoi phu trach | Endpoint/Flow           | Boundary Input   | Du lieu test | Expected |
| ---------- | --------------- | ----------------------- | ---------------- | ------------ | -------- |
| BVA-ORD-01 | Dat             | POST /orders/cancel/:id | status=pending   | pending      | pass     |
| BVA-ORD-02 | Dat             | POST /orders/cancel/:id | status=confirmed | confirmed    | pass     |
| BVA-ORD-03 | Dat             | POST /orders/cancel/:id | status=shipping  | shipping     | fail     |
| BVA-ORD-04 | Dat             | POST /orders/cancel/:id | status=completed | completed    | fail     |
| BVA-ORD-05 | Dat             | POST /orders/cancel/:id | status=cancelled | cancelled    | fail     |

### D) Client Profile (06)

| TC ID          | Nguoi phu trach | Endpoint/Flow  | Boundary Input       | Du lieu test | Expected           |
| -------------- | --------------- | -------------- | -------------------- | ------------ | ------------------ |
| BVA-PROFILE-01 | Dat             | PATCH /profile | fullName rong        | ""           | fail               |
| BVA-PROFILE-02 | Dat             | PATCH /profile | fullName 1 ky tu     | "A"          | fail (neu co rule) |
| BVA-PROFILE-03 | Dat             | PATCH /profile | fullName 2 ky tu     | "An"         | pass               |
| BVA-PROFILE-04 | Dat             | PATCH /profile | phone 9 so           | 098765432    | fail               |
| BVA-PROFILE-05 | Dat             | PATCH /profile | phone 10 so dung dau | 0987654321   | pass               |
| BVA-PROFILE-06 | Dat             | PATCH /profile | phone 10 so sai dau  | 0187654321   | fail               |

## 5.4 Loi phu trach (Admin Orders + Accounts + Roles + Blog + Dashboard)

### A) Admin Orders (11)

| TC ID       | Nguoi phu trach | Endpoint/Flow              | Boundary Input   | Du lieu test | Expected    |
| ----------- | --------------- | -------------------------- | ---------------- | ------------ | ----------- |
| BVA-AORD-01 | Loi             | GET /admin/orders?page=    | page=-1          | -1           | page=1      |
| BVA-AORD-02 | Loi             | GET /admin/orders?page=    | page=0           | 0            | page=1      |
| BVA-AORD-03 | Loi             | GET /admin/orders?page=    | page=1           | 1            | pass        |
| BVA-AORD-04 | Loi             | GET /admin/orders?limit=   | limit=0          | 0            | fallback 10 |
| BVA-AORD-05 | Loi             | GET /admin/orders?limit=   | limit=1          | 1            | pass        |
| BVA-AORD-06 | Loi             | GET /admin/orders?limit=   | limit=abc        | abc          | fallback 10 |
| BVA-AORD-07 | Loi             | PATCH /admin/orders/status | status=cancelled | cancelled    | fail        |
| BVA-AORD-08 | Loi             | PATCH /admin/orders/status | status=pending   | pending      | pass        |
| BVA-AORD-09 | Loi             | PATCH /admin/orders/status | status=completed | completed    | pass        |

### B) Admin Accounts (12)

| TC ID       | Nguoi phu trach | Endpoint/Flow               | Boundary Input     | Du lieu test | Expected        |
| ----------- | --------------- | --------------------------- | ------------------ | ------------ | --------------- |
| BVA-AACC-01 | Loi             | POST /admin/accounts/create | fullName 1 ky tu   | "A"          | fail            |
| BVA-AACC-02 | Loi             | POST /admin/accounts/create | fullName 2 ky tu   | "An"         | pass            |
| BVA-AACC-03 | Loi             | POST /admin/accounts/create | email sai format   | "a@"         | fail            |
| BVA-AACC-04 | Loi             | POST /admin/accounts/create | email dung format  | "a@b.co"     | pass validation |
| BVA-AACC-05 | Loi             | POST /admin/accounts/create | password min-1     | 5 ky tu      | fail            |
| BVA-AACC-06 | Loi             | POST /admin/accounts/create | password tai min   | 6 ky tu      | pass            |
| BVA-AACC-07 | Loi             | POST /admin/accounts/create | confirm khong khop | != password  | fail            |
| BVA-AACC-08 | Loi             | POST /admin/accounts/create | phone 9 so         | 098765432    | fail            |
| BVA-AACC-09 | Loi             | POST /admin/accounts/create | phone 10 so hop le | 0987654321   | pass            |
| BVA-AACC-10 | Loi             | POST /admin/accounts/create | role_id rong       | ""           | fail            |

### C) Admin Roles & Permissions (13)

| TC ID       | Nguoi phu trach | Endpoint/Flow                  | Boundary Input      | Du lieu test      | Expected                    |
| ----------- | --------------- | ------------------------------ | ------------------- | ----------------- | --------------------------- |
| BVA-ROLE-01 | Loi             | POST /admin/roles/create       | title rong          | ""                | fail                        |
| BVA-ROLE-02 | Loi             | POST /admin/roles/create       | title 1 ky tu       | "A"               | pass/fail theo rule thuc te |
| BVA-ROLE-03 | Loi             | PATCH /admin/roles/permissions | permissions rong    | []                | giu an toan                 |
| BVA-ROLE-04 | Loi             | PATCH /admin/roles/permissions | 1 permission hop le | ["products_view"] | pass                        |
| BVA-ROLE-05 | Loi             | PATCH /admin/roles/permissions | permission gia      | ["fake_perm"]     | fail an toan                |

### D) Admin Blog (14)

| TC ID        | Nguoi phu trach | Endpoint/Flow           | Boundary Input | Du lieu test | Expected                    |
| ------------ | --------------- | ----------------------- | -------------- | ------------ | --------------------------- |
| BVA-ABLOG-01 | Loi             | POST /admin/blog/create | title rong     | ""           | fail                        |
| BVA-ABLOG-02 | Loi             | POST /admin/blog/create | title 1 ky tu  | "A"          | fail/pass theo rule thuc te |
| BVA-ABLOG-03 | Loi             | POST /admin/blog/create | title 3 ky tu  | "Tin"        | pass/fail theo rule thuc te |

### E) Admin Dashboard (15)

| TC ID     | Nguoi phu trach | Endpoint/Flow                | Boundary Input | Du lieu test | Expected       |
| --------- | --------------- | ---------------------------- | -------------- | ------------ | -------------- |
| BVA-DB-01 | Loi             | GET /admin/dashboard/revenue | month=0        | month=0      | fail/fallback  |
| BVA-DB-02 | Loi             | GET /admin/dashboard/revenue | month=1        | month=1      | pass           |
| BVA-DB-03 | Loi             | GET /admin/dashboard/revenue | month=12       | month=12     | pass           |
| BVA-DB-04 | Loi             | GET /admin/dashboard/revenue | month=13       | month=13     | fail/fallback  |
| BVA-DB-05 | Loi             | GET /admin/dashboard/revenue | year rong      | year=""      | fallback logic |
| BVA-DB-06 | Loi             | GET /admin/dashboard/revenue | year hop le    | year=2026    | pass           |

## 6) Ke hoach thuc thi theo sprint

- Ngay 1:
  - Son chuan hoa environment + cookie/session setup.
  - Moi thanh vien tao folder test BVA theo module phu trach trong collection.
- Ngay 2:
  - Hoan thien test case core boundary (min-1, min, min+1) cho cac input bat buoc.
- Ngay 3:
  - Chay Newman theo module, sua test fail, bo sung assertion.
- Ngay 4:
  - Chay full regression + E2E + tong hop bug report.

## 7) Dinh nghia hoan tat (Definition of Done)

- 100% test case BVA da duoc viet va map voi module duoc giao.
- Moi module co it nhat:
  - 1 test duoi nguong
  - 1 test tai nguong
  - 1 test tren nguong (neu co nguong tren)
- Newman run pass >= 95% (cac fail con lai phai co bug ticket).
- Co file tong hop ket qua test va danh sach loi tai lieu hoa day du.

## 8) Ghi chu quan trong

- Mot so module (Blog, Role, Dashboard) can xac nhan them nguong min/max tu service/controller neu khong co validate minh dinh.
- Neu tim thay rule moi trong qua trinh implement test, cap nhat nguoc file nay de giu dong bo cho ca nhom.

## 9) Bang tong hop phan viec theo ten

| Thanh vien | So TC BVA | Module phu trach                                                                                    |
| ---------- | --------: | --------------------------------------------------------------------------------------------------- |
| Son        |        23 | 01 Client Auth, 07 Client Blog, 08 Admin Auth                                                       |
| Quyen      |        24 | 02 Client Products, 09 Admin Products, 10 Admin Categories                                          |
| Dat        |        25 | 03 Client Cart, 04 Client Checkout, 05 Client Orders, 06 Client Profile                             |
| Loi        |        20 | 11 Admin Orders, 12 Admin Accounts, 13 Admin Roles & Permissions, 14 Admin Blog, 15 Admin Dashboard |
