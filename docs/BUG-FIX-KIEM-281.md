# 🐛 Bug Fix: KIEM-281

## [BUG] CART-A-08 | Lỗi lộ Database (Information Disclosure) khi productId sai định dạng

---

## 📋 Thông tin Bug

**Bug ID**: KIEM-281  
**Severity**: High (Security - Information Disclosure)  
**Module**: Client Cart - Add to Cart  
**Test Case**: CART-A-08 | Thêm productId dạng SQL injection

---

## 🔍 Mô tả lỗi

### Request:
```http
POST {{base_url}}/cart/add
Content-Type: application/json

{
  "productId": "' OR '1'='1",
  "quantity": 1
}
```

### Actual Result (TRƯỚC KHI FIX):
```json
{
  "success": false,
  "message": "Cast to ObjectId failed for value \"' OR '1'='1\" (type string) at path \"_id\" for model \"Product\""
}
```

**Vấn đề**: 
- ❌ Lộ thông tin database đang dùng Mongoose/MongoDB
- ❌ Lộ tên model: `Product`
- ❌ Lộ tên field: `_id`
- ❌ Lộ cấu trúc query internal

### Expected Result:
```json
{
  "success": false,
  "message": "Mã sản phẩm không hợp lệ"
}
```

---

## 🔧 Root Cause

### File: `services/client/cart.service.js`

**Trước khi fix:**
```javascript
module.exports.addToCart = async (req, productId, quantity) => {
    // ...
    const product = await Product.findById(productId); // ❌ Không validate
    if (!product) throw new Error("Sản phẩm không tồn tại");
    // ...
};
```

**Vấn đề**: 
- Không validate format ObjectId trước khi query
- Mongoose throw `CastError` với message chi tiết
- Controller bê nguyên `err.message` ra ngoài

---

## ✅ Solution

### 1. Thêm validation trong Service

**File**: `services/client/cart.service.js`

```javascript
const mongoose = require("mongoose");

module.exports.addToCart = async (req, productId, quantity) => {
    if (!req.session.user)
        throw new Error("Bạn phải đăng nhập!");

    // ✅ Validate ObjectId format trước khi query
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Mã sản phẩm không hợp lệ");
    }

    const userId = req.session.user._id;
    const qty = parseInt(quantity);

    const product = await Product.findById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");
    // ...
};
```

**Áp dụng tương tự cho**:
- `updateQuantity()`
- `removeItem()`

### 2. Thêm Error Sanitizer trong Controller

**File**: `controllers/client/cart.controller.js`

```javascript
/* ===================================================
   HELPER: Sanitize error messages (bảo mật)
=================================================== */
function sanitizeError(err) {
    // Ẩn thông tin kỹ thuật database
    if (err.name === 'CastError') {
        return "Mã sản phẩm không hợp lệ";
    }
    if (err.name === 'ValidationError') {
        return "Dữ liệu không hợp lệ";
    }
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        return "Lỗi hệ thống, vui lòng thử lại sau";
    }
    
    // Chỉ trả message an toàn từ service
    return err.message || "Đã xảy ra lỗi";
}

module.exports.add = async (req, res) => {
    try {
        // ... logic
    } catch (err) {
        // ✅ Log lỗi chi tiết cho dev (không gửi cho client)
        console.error('[CART-ADD-ERROR]', err);
        
        return res.status(400).json({
            success: false,
            message: sanitizeError(err) // ✅ Sanitize error
        });
    }
};
```

---

## 📊 Impact

### Trước khi fix:
- ❌ **Information Disclosure**: Lộ cấu trúc database
- ❌ **Security Risk**: Kẻ xấu biết được tech stack
- ❌ **Attack Surface**: Dễ dàng thiết kế tấn công tiếp theo

### Sau khi fix:
- ✅ **Secure**: Không lộ thông tin kỹ thuật
- ✅ **User-friendly**: Message rõ ràng, dễ hiểu
- ✅ **Logging**: Dev vẫn thấy được lỗi chi tiết trong console
- ✅ **Validation**: Chặn sớm input không hợp lệ

---

## 🧪 Test Result

### Test Case: CART-A-08

**Request:**
```json
POST /cart/add
{
  "productId": "' OR '1'='1",
  "quantity": 1
}
```

**Response (SAU KHI FIX):**
```json
{
  "success": false,
  "message": "Mã sản phẩm không hợp lệ"
}
```

**Status**: ✅ PASS

**Console Log (chỉ dev thấy):**
```
[CART-ADD-ERROR] Error: Mã sản phẩm không hợp lệ
    at addToCart (cart.service.js:55:15)
    ...
```

---

## 📝 Files Changed

1. `services/client/cart.service.js`
   - Import `mongoose`
   - Add ObjectId validation in `addToCart()`
   - Add ObjectId validation in `updateQuantity()`
   - Add ObjectId validation in `removeItem()`

2. `controllers/client/cart.controller.js`
   - Add `sanitizeError()` helper function
   - Update error handling in `add()`
   - Update error handling in `update()`
   - Update error handling in `delete()`
   - Add console.error for debugging

---

## 🔐 Security Best Practices Applied

1. ✅ **Input Validation**: Validate trước khi query database
2. ✅ **Error Sanitization**: Không expose internal errors
3. ✅ **Logging**: Log chi tiết cho dev, message đơn giản cho user
4. ✅ **Defense in Depth**: Validation ở cả service và controller layer

---

## 📅 Timeline

- **Discovered**: Test case CART-A-08
- **Fixed**: 2026-04-05
- **Tested**: ✅ Pass
- **Status**: Resolved

---

## 👤 Author

**Fixed by**: Đạt  
**Reviewed by**: -  
**Branch**: testing-version-3
