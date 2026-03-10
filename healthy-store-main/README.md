# 🏪 Verdish - E-Commerce Platform

Một nền tảng thương mại điện tử hiện đại để bán các sản phẩm dinh dưỡng lành mạnh, được xây dựng bằng **Node.js**, **Express.js**, **MongoDB** với hệ thống quản lý admin toàn diện.

---

## 📋 Mục lục

- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [API & Routes](#api--routes)
- [Database Schema](#database-schema)
- [Các tính năng nâng cao](#các-tính-năng-nâng-cao)
- [Hướng dẫn phát triển](#hướng-dẫn-phát-triển)

---

## 🎯 Tính năng chính

### 👥 **Hệ thống Xác thực & Bảo mật**

- ✅ Đăng ký tài khoản với **OTP email xác thực** (3 bước)
- ✅ Đăng nhập an toàn với **bcrypt password hashing**
- ✅ **Quên mật khẩu** - Cấp lại mật khẩu qua OTP email
- ✅ Quản lý phiên session (7 ngày)
- ✅ Cookie-based authentication (httpOnly, sameSite)

### 🛍️ **Hệ thống Cửa hàng (Client)**

- ✅ Duyệt sản phẩm theo **danh mục**
- ✅ **Giỏ hàng** - Thêm/cập nhật/xóa sản phẩm
- ✅ **Checkout** - Chọn sản phẩm & giao hàng
- ✅ **Quản lý đơn hàng** - Xem chi tiết & trạng thái
- ✅ **Hồ sơ cá nhân** - Thay đổi password, avatar
- ✅ **Blog** - Đọc bài viết dinh dưỡng

### 🎛️ **Admin Panel**

- ✅ **Dashboard** - Thống kê doanh số (ngày/tháng/quý/năm) + xuất Excel/Word
- ✅ **Quản lý sản phẩm** - CRUD, thay đổi trạng thái, sắp xếp vị trí
- ✅ **Quản lý danh mục** - Hỗ trợ danh mục lồng nhau (nested)
- ✅ **Quản lý đơn hàng** - Cập nhật trạng thái (pending → shipping → completed)
- ✅ **Quản lý tài khoản** - Khóa/mở khóa người dùng
- ✅ **Quản lý blog** - Tạo/sửa/xóa bài viết với editor TinyMCE
- ✅ **Quản lý quyền hạn** - Kiểm soát từng quyền (view/create/edit/delete)
- ✅ **Lịch sử thay đổi sản phẩm** - Theo dõi ai thay đổi gì & khi nào

### ⚡ **Tính năng UI/UX**

- ✅ **SweetAlert2 confirmations** - Xác nhận hành động đẹp mắt
- ✅ **Responsive Design** - Bootstrap 5 cho mobile/tablet/desktop
- ✅ **Upload hình ảnh** - Cloudinary CDN tích hợp
- ✅ **TinyMCE editor** - Soạn nội dung blog chuyên nghiệp
- ✅ **Chart.js** - Biểu đồ thống kê dashboard

---

## 🛠️ Công nghệ sử dụng

### **Backend**

```json
{
  "runtime": "Node.js 16+",
  "framework": "Express.js ^5.1.0",
  "database": "MongoDB (Mongoose ^8.19.0)",
  "authentication": "bcrypt ^6.0.0, express-session, cookie-parser",
  "email": "nodemailer ^7.0.11",
  "validation": "express-validator ^7.3.1",
  "upload": "multer ^2.0.2, Cloudinary",
  "template": "Pug ^3.0.3",
  "export": "xlsx ^0.18.5, docx ^8.5.0"
}
```

### **Frontend**

- **Template Engine**: Pug (HTML preprocessor)
- **CSS**: Bootstrap 5
- **JS Libraries**:
  - SweetAlert2 (confirmations & notifications)
  - Chart.js (dashboard charts)
  - TinyMCE (blog editor)
  - Fetch API (AJAX)

### **DevTools**

- **nodemon**: Auto-reload khi edit file
- **.env**: Quản lý biến môi trường

---

## 🚀 Cài đặt & Chạy

### **1. Clone & Install**

```bash
git clone <repo-url>
cd healthy-store
npm install
```

### **2. Tạo file `.env`**

```bash
cp .env.example .env
```

### **3. Cấu hình `.env`** (xem [Cấu hình môi trường](#cấu-hình-môi-trường))

### **4. Chạy Server**

```bash
npm start
```

Server sẽ chạy ở `http://localhost:3000`

### **5. Admin Panel**

Truy cập `/admin/auth/login` để đăng nhập

---

## 📁 Cấu trúc dự án

```
healthy-store/
├── index.js                          # Entry point - cài đặt Express, middleware
├── package.json                      # Dependencies
├── .env                              # Biến môi trường (KHÔNG commit)
│
├── config/                           # Cấu hình ứng dụng
│   ├── database.js                   # MongoDB connection
│   ├── cloudinary.js                 # Cloudinary config
│   ├── multer.js                     # File upload config
│   └── system.js                     # System constants
│
├── models/                           # Mongoose schemas
│   ├── user.model.js                 # User schema
│   ├── product.model.js              # Product schema
│   ├── category.model.js             # Category schema (nested)
│   ├── order.model.js                # Order schema
│   ├── cart.model.js                 # Shopping cart
│   ├── blog.model.js                 # Blog posts
│   ├── role.model.js                 # User roles & permissions
│   ├── forgot-password.model.js      # Password reset OTP
│   ├── pending-registration.model.js # Register OTP
│   └── product-history.model.js      # Audit log for products
│
├── controllers/                      # Request handlers
│   ├── admin/                        # Admin controllers
│   │   ├── dashboard.controller.js   # Dashboard stats
│   │   ├── product.controller.js     # Product CRUD
│   │   ├── category.controller.js    # Category CRUD
│   │   ├── order.controller.js       # Order management
│   │   ├── account.controller.js     # User management
│   │   ├── blog.controller.js        # Blog management
│   │   ├── role.controller.js        # Permissions
│   │   └── auth.controller.js        # Admin login
│   │
│   └── client/                       # Client controllers
│       ├── home.controller.js        # Homepage
│       ├── product.controller.js     # Product listing
│       ├── cart.controller.js        # Shopping cart
│       ├── checkout.controller.js    # Order creation
│       ├── orders.controller.js      # Order tracking
│       ├── login.controller.js       # User login
│       ├── register.controller.js    # Registration
│       ├── password.controller.js    # Password reset
│       ├── profile.controller.js     # User profile
│       └── blog.controller.js        # Blog viewing
│
├── services/                         # Business logic
│   ├── admin/                        # Admin services
│   │   ├── product.service.js        # Product operations + audit log
│   │   ├── category.service.js       # Category operations
│   │   ├── order.service.js          # Order processing
│   │   ├── account.service.js        # User management
│   │   ├── blog.service.js           # Blog operations
│   │   ├── auth.service.js           # Admin authentication
│   │   └── role.service.js           # Permissions logic
│   │
│   └── client/                       # Client services
│       ├── cart.service.js           # Cart operations
│       ├── checkout.service.js       # Order creation + inventory
│       ├── product.service.js        # Product queries
│       ├── login.service.js          # Client login
│       ├── register.service.js       # Registration (OTP)
│       ├── password.service.js       # Password reset (OTP)
│       └── orders.service.js         # Order queries
│
├── routes/                           # Route definitions
│   ├── admin/
│   │   ├── index.route.js            # Admin route mounting
│   │   ├── product.route.js          # Product routes
│   │   ├── category.route.js         # Category routes
│   │   ├── order.route.js            # Order routes
│   │   ├── account.route.js          # Account routes
│   │   ├── blog.route.js             # Blog routes
│   │   ├── role.route.js             # Role routes
│   │   ├── dashboard.route.js        # Dashboard routes
│   │   └── auth.route.js             # Auth routes
│   │
│   ├── client/
│   │   ├── index.route.js            # Client route mounting
│   │   ├── home.route.js             # Home page
│   │   ├── product.route.js          # Product listing
│   │   ├── cart.route.js             # Cart routes
│   │   ├── checkout.route.js         # Checkout routes
│   │   ├── orders.route.js           # Orders routes
│   │   ├── profile.route.js          # Profile routes
│   │   ├── login.route.js            # Login routes
│   │   ├── register.route.js         # Register routes
│   │   ├── password.route.js         # Password reset routes
│   │   └── blog.route.js             # Blog routes
│   │
│   └── auth/
│       ├── login.route.js            # Admin login routes
│       └── register.route.js         # Admin register routes
│
├── middlewares/                      # Custom middlewares
│   ├── admin/
│   │   └── auth.middleware.js        # Admin authentication check
│   │
│   └── client/
│       └── checkLogin.middleware.js  # Client login requirement
│
├── helper/                           # Utility functions
│   ├── generateOtp.js                # Generate random OTP
│   ├── sendMail.js                   # Send email via nodemailer
│   ├── uploadCloud.js                # Upload to Cloudinary
│   ├── productHistoryLog.js          # Log product changes
│   ├── createTree.js                 # Build nested categories
│   ├── pagination.js                 # Pagination logic
│   ├── filterStatus.js               # Filter by status
│   └── search.js                     # Search products
│
├── validates/                        # Input validation
│   └── admin/
│       ├── product.validate.js       # Product validation
│       ├── category.validate.js      # Category validation
│       └── account.validate.js       # Account validation
│
├── public/                           # Static files
│   ├── css/
│   │   ├── style.css                 # Global styles
│   │   ├── home-products.css         # Homepage styles
│   │   ├── login.css                 # Login/Register styles
│   │   └── ...
│   │
│   ├── js/
│   │   ├── cart.js                   # Shopping cart logic
│   │   ├── checkout.js               # Checkout form
│   │   ├── register.js               # Registration form
│   │   ├── verify-otp-register.js    # OTP verification
│   │   ├── profile.js                # Profile management
│   │   └── ...
│   │
│   ├── admin/
│   │   ├── css/
│   │   │   └── style.css
│   │   │
│   │   └── js/
│   │       ├── product.js            # Product AJAX (PATCH/DELETE)
│   │       ├── category.js           # Category AJAX
│   │       ├── account.js            # Account AJAX
│   │       ├── role.js               # Role management
│   │       └── ...
│   │
│   └── images/                       # Image assets
│
├── views/                            # Pug templates
│   ├── admin/
│   │   ├── layouts/
│   │   │   └── default.pug           # Admin layout
│   │   │
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   │   └── index.pug         # Dashboard with charts
│   │   │   │
│   │   │   ├── product/
│   │   │   │   ├── index.pug         # Product list
│   │   │   │   ├── create.pug        # Create product
│   │   │   │   ├── edit.pug          # Edit product
│   │   │   │   ├── detail.pug        # Product details
│   │   │   │   ├── history.pug       # Product change history
│   │   │   │   └── all-history.pug   # All product changes
│   │   │   │
│   │   │   ├── category/
│   │   │   ├── order/
│   │   │   ├── account/
│   │   │   ├── blog/
│   │   │   └── role/
│   │   │
│   │   ├── mixins/                   # Reusable components
│   │   │   ├── alert.pug
│   │   │   ├── pagination.pug
│   │   │   ├── form-change-multi.pug
│   │   │   └── ...
│   │   │
│   │   └── partials/                 # Partial templates
│   │
│   └── client/
│       ├── layouts/
│       │   └── default.pug           # Client layout
│       │
│       ├── pages/
│       │   ├── home.pug              # Homepage
│       │   ├── products.pug          # Product listing
│       │   ├── product-detail.pug    # Product detail
│       │   ├── cart.pug              # Shopping cart
│       │   ├── checkout.pug          # Checkout page
│       │   ├── orders/
│       │   │   ├── index.pug         # Orders list
│       │   │   └── detail.pug        # Order details
│       │   │
│       │   ├── auth/
│       │   │   ├── login.pug         # Login form
│       │   │   ├── register.pug      # Register form
│       │   │   ├── forgot-password.pug
│       │   │   └── verify-otp.pug
│       │   │
│       │   ├── blog.pug              # Blog list
│       │   ├── blog-detail.pug       # Blog post
│       │   └── profile.pug           # User profile
│       │
│       └── partials/                 # Partial templates
│
├── temp/                             # Temporary files (uploads)
│
└── node_modules/                     # Dependencies (installed)
```

---

## 🔐 Cấu hình môi trường

### Tạo file `.env` với các biến sau:

```env
# ================= PORT =================
PORT=3000

# ================= DATABASE =================
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# ================= SESSION & SECURITY =================
SESSION_SECRET=your_secret_session_key_here_change_me

# ================= CLOUDINARY (Images) =================
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ================= EMAIL (Nodemailer) =================
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password  # Google App Password (2FA)
EMAIL_SERVICE=gmail
EMAIL_FROM=your_email@gmail.com

# ================= TINYMCE (Blog Editor) =================
TINYMCE_API_KEY=your_tinymce_api_key

# ================= ADMIN PREFIX =================
PREFIX_ADMIN=/admin
```

### **Hướng dẫn lấy từng khóa:**

**MongoDB Atlas:**

1. Tạo cluster tại [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Copy connection string

**Cloudinary:**

1. Đăng ký tại [cloudinary.com](https://cloudinary.com)
2. Lấy Cloud Name, API Key, API Secret

**Email (Gmail):**

1. Bật 2-Factor Authentication
2. Tạo App Password
3. Dùng app password thay vì gmail password

**TinyMCE:**

1. Đăng ký tại [tinymce.com](https://www.tinymce.com)
2. Lấy API key

---

## 🌐 API & Routes

### **Client Routes**

| Method | Endpoint                   | Description                      | Auth |
| ------ | -------------------------- | -------------------------------- | ---- |
| GET    | `/`                        | Homepage                         | ❌   |
| GET    | `/products`                | Product listing                  | ❌   |
| GET    | `/product/:slug`           | Product detail                   | ❌   |
| POST   | `/cart/add`                | Add to cart                      | ✅   |
| POST   | `/cart/update`             | Update quantity                  | ✅   |
| POST   | `/cart/delete`             | Remove from cart                 | ✅   |
| GET    | `/cart`                    | View cart                        | ✅   |
| POST   | `/checkout`                | Create order                     | ✅   |
| GET    | `/orders`                  | Order listing                    | ✅   |
| GET    | `/orders/:id`              | Order detail                     | ✅   |
| GET    | `/login`                   | Login form                       | ❌   |
| POST   | `/login`                   | Login submit                     | ❌   |
| GET    | `/register`                | Register form                    | ❌   |
| POST   | `/register`                | Register step 1 (OTP)            | ❌   |
| POST   | `/register/verify-otp`     | Register step 2 (OTP verify)     | ❌   |
| POST   | `/register/create-account` | Register step 3 (Create account) | ❌   |
| GET    | `/password/forgot`         | Forgot password form             | ❌   |
| POST   | `/password/forgot`         | Send OTP                         | ❌   |
| POST   | `/password/verify-otp`     | Verify OTP                       | ❌   |
| POST   | `/password/reset-password` | Reset password                   | ❌   |
| GET    | `/profile`                 | User profile                     | ✅   |
| POST   | `/profile/update`          | Update profile                   | ✅   |
| GET    | `/blog`                    | Blog listing                     | ❌   |
| GET    | `/blog/:slug`              | Blog detail                      | ❌   |

### **Admin Routes**

| Method | Endpoint                                      | Description            | Auth |
| ------ | --------------------------------------------- | ---------------------- | ---- |
| GET    | `/admin/dashboard`                            | Dashboard              | ✅   |
| GET    | `/admin/products`                             | Product list           | ✅   |
| GET    | `/admin/products/create`                      | Create form            | ✅   |
| POST   | `/admin/products/create`                      | Save product           | ✅   |
| GET    | `/admin/products/edit/:id`                    | Edit form              | ✅   |
| PATCH  | `/admin/products/edit/:id`                    | Update product         | ✅   |
| PATCH  | `/admin/products/change-status/:status/:id`   | Change status (AJAX)   | ✅   |
| DELETE | `/admin/products/delete-product/:id`          | Delete (AJAX)          | ✅   |
| GET    | `/admin/products/history/:id`                 | Product change history | ✅   |
| GET    | `/admin/products/all-history`                 | All changes history    | ✅   |
| GET    | `/admin/categories`                           | Category list          | ✅   |
| POST   | `/admin/categories/create`                    | Create category        | ✅   |
| PATCH  | `/admin/categories/change-status/:status/:id` | Change status (AJAX)   | ✅   |
| DELETE | `/admin/categories/delete-category/:id`       | Delete (AJAX)          | ✅   |
| GET    | `/admin/orders`                               | Order list             | ✅   |
| POST   | `/admin/orders/:id/status`                    | Update order status    | ✅   |
| GET    | `/admin/accounts`                             | User list              | ✅   |
| PATCH  | `/admin/accounts/change-status/:status/:id`   | Change status (AJAX)   | ✅   |
| DELETE | `/admin/accounts/delete-account/:id`          | Delete (AJAX)          | ✅   |
| GET    | `/admin/blog`                                 | Blog list              | ✅   |
| GET    | `/admin/roles`                                | Permissions management | ✅   |

---

## 📊 Database Schema

### **User Collection**

```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  token: String,
  role_id: String,
  status: String,
  avatar: String,
  phone: String,
  deleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Product Collection**

```javascript
{
  _id: ObjectId,
  title: String,
  product_category: String (ref: Category._id),
  description: String (HTML),
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String (Cloudinary URL),
  status: String (active/inactive),
  position: Number,
  slug: String (unique),
  createdBy: { account_id, createdAt },
  updatedBy: { account_id, updatedAt },
  deleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Order Collection**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [
    {
      productId: ObjectId,
      title: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  shippingInfo: {
    name: String,
    phone: String,
    address: String
  },
  status: String (pending/confirmed/shipping/completed/cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

### **Cart Collection**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, unique),
  items: [
    {
      productId: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### **ProductHistory Collection (Audit Log)**

```javascript
{
  _id: ObjectId,
  product_id: String,
  product_title: String,
  accountId: String,
  accountEmail: String,
  action: String (create/edit/delete/change-status/change-position),
  changes: Object (old → new values),
  description: String,
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **PendingRegistration Collection (OTP)**

```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  otp: String (hashed),
  expiresAt: Date (3 minutes),
  createdAt: Date,
  updatedAt: Date
}
```

### **ForgotPassword Collection (OTP)**

```javascript
{
  _id: ObjectId,
  email: String,
  otp: String (hashed),
  expiresAt: Date (3 minutes),
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚡ Các tính năng nâng cao

### **1. OTP Authentication**

- 6-digit OTP được gửi via email
- Hashed với bcrypt trước lưu DB
- Expires sau 3 phút
- Resend countdown 60 giây
- Dùng cho: Đăng ký, quên mật khẩu

### **2. Audit Logging (Sản phẩm)**

Mỗi thay đổi sản phẩm được ghi lại:

```javascript
{
  accountEmail: "admin@example.com",
  action: "edit",
  changes: {
    title: { old: "Product A", new: "Product B" },
    price: { old: 100000, new: 120000 },
    stock: { old: 50, new: 45 }
  },
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  createdAt: "2024-12-14T10:30:00Z"
}
```

### **3. AJAX Operations**

Status change & deletion mà **KHÔNG** tải lại trang:

- PATCH `/admin/products/change-status/{status}/{id}`
- DELETE `/admin/products/delete-product/{id}`
- DELETE `/admin/categories/delete-category/{id}`
- DELETE `/admin/accounts/delete-account/{id}`

### **4. Nested Categories**

Danh mục có thể có danh mục cha/con:

```javascript
categories = [
  {
    _id: "cat1",
    title: "Vitamin",
    parent_id: null,
    children: [
      { _id: "cat1.1", title: "Vitamin C" },
      { _id: "cat1.2", title: "Vitamin D" },
    ],
  },
];
```

### **5. Dashboard Statistics**

Thống kê doanh số theo:

- Ngày (Day)
- Tháng (Month)
- Quý (Quarter)
- Năm (Year)

Xuất dữ liệu:

- 📊 **Excel** (`.xlsx`)
- 📄 **Word** (`.docx`)

### **6. Permission Control**

Admin có thể thiết lập quyền từng người:

- `products_view`, `products_create`, `products_edit`, `products_delete`
- `categories_view`, `categories_create`, `categories_edit`, `categories_delete`
- `orders_view`, `orders_edit`
- `accounts_view`, `accounts_create`, `accounts_edit`, `accounts_delete`
- `blog_view`, `blog_create`, `blog_edit`, `blog_delete`
- `roles_view`, `roles_permissions`
- `dashboard_view`

---

## 🔧 Hướng dẫn phát triển

### **Thêm tính năng mới**

**1. Tạo Model** (`models/new-feature.model.js`)

```javascript
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: String,
    status: String,
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewFeature", schema);
```

**2. Tạo Service** (`services/admin/new-feature.service.js`)

```javascript
const NewFeature = require("../../models/new-feature.model");

module.exports.getAll = async () => {
  return await NewFeature.find({ deleted: false });
};

module.exports.create = async (data) => {
  return await NewFeature.create(data);
};
```

**3. Tạo Controller** (`controllers/admin/new-feature.controller.js`)

```javascript
const service = require("../../services/admin/new-feature.service");

module.exports.index = async (req, res) => {
  const records = await service.getAll();
  res.render("admin/pages/new-feature/index", {
    pageTitle: "New Feature",
    records,
  });
};
```

**4. Tạo Routes** (`routes/admin/new-feature.route.js`)

```javascript
const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/new-feature.controller");

router.get("/", controller.index);
router.post("/create", controller.create);

module.exports = router;
```

**5. Mount Route** (trong `routes/admin/index.route.js`)

```javascript
app.use(
  PATH_ADMIN + "/new-feature",
  authMiddleware.requireAuth,
  newFeatureRoutes
);
```

**6. Tạo View** (`views/admin/pages/new-feature/index.pug`)

```pug
extends ../../layouts/default.pug

block main
  h1 New Feature Management
  table.table
    thead
      tr
        th Title
        th Status
    tbody
      each record in records
        tr
          td #{record.title}
          td #{record.status}
```

---

### **Debugging Tips**

```javascript
// Enable debug logging
const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) console.log('Debug info:', data);

// Check request data
console.log('Request body:', req.body);
console.log('Session user:', req.session.user);

// Test database connection
const db = mongoose.connection;
db.on('error', (err) => console.error('DB Error:', err));
db.once('open', () => console.log('DB Connected'));

// Use nodemon inspector
npm start
// Then open chrome://inspect in Chrome DevTools
```

---

### **Performance Tips**

1. **Index frequently queried fields:**

```javascript
userSchema.index({ email: 1 });
productSchema.index({ slug: 1 });
orderSchema.index({ userId: 1, createdAt: -1 });
```

2. **Use pagination** (không load toàn bộ)
3. **Cache categories menu** (static data)
4. **Compress images** trước upload
5. **Use CDN** (Cloudinary) cho assets

---

## 📦 Deployment

### **Deploy to Heroku**

```bash
heroku create healthy-store
git push heroku main
heroku config:set MONGO_URL=...
heroku logs --tail
```

### **Deploy to DigitalOcean**

```bash
# SSH vào server
ssh root@<IP>

# Clone repo & install
git clone <repo>
npm install

# Setup .env
nano .env

# Run with PM2
npm install -g pm2
pm2 start index.js --name "healthy-store"
pm2 startup
pm2 save
```

### **Production Checklist**

- [ ] Đặt `NODE_ENV=production`
- [ ] Disable debug logs
- [ ] Setup HTTPS/SSL
- [ ] Enable CORS nếu cần
- [ ] Setup backup DB hàng ngày
- [ ] Monitoring & logging (NewRelic, Sentry)
- [ ] Rate limiting trên API
- [ ] Input validation & sanitization

---

## 📞 Support & Questions

Nếu có câu hỏi, vui lòng:

1. Kiểm tra file này trước
2. Tìm kiếm trong issues
3. Tạo issue mới với chi tiết đầy đủ

---

## 📄 License

Dự án này được sử dụng cho mục đích giáo dục.

---

**Cảm ơn vì sử dụng Verdish! 🎉**
