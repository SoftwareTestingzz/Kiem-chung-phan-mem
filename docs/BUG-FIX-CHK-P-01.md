# [BUG FIX] CHK-P-01 | Thiếu xử lý ngoại lệ khi đặt hàng với giỏ hàng trống

## Bug ID
CHK-P-01

## Severity
🔴 HIGH - Unhandled Exception / Security Issue

## Mô Tả Bug

### Request
- **URL:** `{{base_url}}/checkout/place-order`
- **Method:** POST
- **Body:**
  ```json
  {
    "selectedItems": "[\"{{test_product_id}}\"]",
    "name": "Nguyễn Văn An",
    "phone": "0901234567",
    "address": "123 Nguyễn Huệ, Quận 1, TP.HCM"
  }
  ```

### Điều Kiện Tiền Quyết (Precondition)
- User vừa đăng ký/đăng nhập thành công
- User CHƯA TỪNG thêm bất kỳ thứ gì vào giỏ hàng
- Cart document trong MongoDB chưa được khởi tạo

### Kết Quả Thực Tế (Trước Khi Fix)
- Status: 200 OK (hoặc 500)
- Response:
  ```json
  {
    "success": false,
    "message": "Cannot read properties of null (reading 'items')"
  }
  ```

### Vấn Đề
- ❌ **Unhandled Exception**: Lỗi Null Reference Exception bị lọt ra ngoài
- ❌ **Security Issue**: Rò rỉ cấu trúc code/lỗi hệ thống ra API Response
- ❌ **Poor UX**: Message lỗi không thân thiện với user
- ❌ **Crash Runtime**: Node.js có thể crash nếu không có try-catch

### Kết Quả Mong Đợi
- Status: 200 OK
- Response:
  ```json
  {
    "success": false,
    "message": "Giỏ hàng của bạn đang trống, không thể đặt hàng!"
  }
  ```

## Root Cause

**File:** `services/client/checkout.service.js`
**Functions:** `getSelectedItems()`, `createOrder()`
**Lines:** 26-29, 79-82

### White-box Testing Analysis

```javascript
// ❌ CODE CŨ - SAI (dòng 78-81)
const cart = await Cart.findOne({ userId });
if (!cart || !cart.items || cart.items.length === 0) {
    // ❌ BLOCK ĐỂ TRỐNG - KHÔNG THROW ERROR
}

// ❌ Code chạy tiếp xuống dòng 84
const selected = cart.items.filter(item => ...); // 💥 CRASH: cart is null
```

**Vấn đề:**
1. Lập trình viên đã tạo block kiểm tra `if (!cart)` nhưng để trống
2. Code tiếp tục chạy xuống dòng `cart.items.filter()`
3. Null Reference Exception xảy ra: `Cannot read properties of null`
4. Exception bị lọt ra ngoài, lộ cấu trúc code

## Solution

### Thay Đổi Code

**File:** `services/client/checkout.service.js`

#### Fix 1: getSelectedItems() - Dòng 26-29
```javascript
// ✅ CODE MỚI - ĐÚNG
const cart = await Cart.findOne({ userId });
if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Giỏ hàng của bạn đang trống!");
}
```

#### Fix 2: createOrder() - Dòng 79-82
```javascript
// ✅ CODE MỚI - ĐÚNG
const cart = await Cart.findOne({ userId });
if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Giỏ hàng của bạn đang trống, không thể đặt hàng!");
}
```

#### Fix 3: Validation selectedItems - Dòng 22-24
```javascript
// ✅ CODE MỚI - ĐÚNG
if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    throw new Error("Không có sản phẩm nào được chọn!");
}
```

#### Fix 4: Validation selected items - Dòng 36-38
```javascript
// ✅ CODE MỚI - ĐÚNG
if (selected.length === 0) {
    throw new Error("Không tìm thấy sản phẩm được chọn trong giỏ hàng!");
}
```

#### Fix 5: Validation product exists - Dòng 96-98
```javascript
// ✅ CODE MỚI - ĐÚNG
if (!product) {
    throw new Error(`Sản phẩm ${item.title} không tồn tại!`);
}
```

### Controller Xử Lý Error

**File:** `controllers/client/checkout.controller.js`

Controller đã có try-catch (không cần sửa):

```javascript
module.exports.placeOrder = async (req, res) => {
    try {
        // ...
        const order = await checkoutService.createOrder(req, ids);
        return res.json({ success: true, message: 'Đặt hàng thành công!', orderId: order._id });

    } catch (err) {
        // ✅ Catch error và trả về message thân thiện
        console.error("Place Order Error:", err);
        return res.status(400).json({
            success: false,
            message: err.message || "Lỗi hệ thống khi đặt hàng!"
        });
    }
};
```

## Kết Quả Sau Khi Fix

### Test Case 1: Checkout với giỏ hàng trống
**Precondition:** User mới, chưa có cart trong DB

**Request:**
```json
POST /checkout/place-order
{
  "selectedItems": "[\"69bd766c8f031f668361a5ab\"]",
  "name": "Nguyễn Văn An",
  "phone": "0901234567",
  "address": "123 Nguyễn Huệ, Quận 1, TP.HCM"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Giỏ hàng của bạn đang trống, không thể đặt hàng!"
}
```

### Test Case 2: Checkout với selectedItems rỗng
**Request:**
```json
POST /checkout/place-order
{
  "selectedItems": "[]",
  "name": "Nguyễn Văn An",
  "phone": "0901234567",
  "address": "123 Nguyễn Huệ, Quận 1, TP.HCM"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Không có sản phẩm nào được chọn!"
}
```

### Test Case 3: Checkout với sản phẩm không có trong giỏ
**Request:**
```json
POST /checkout/place-order
{
  "selectedItems": "[\"000000000000000000000000\"]",
  "name": "Nguyễn Văn An",
  "phone": "0901234567",
  "address": "123 Nguyễn Huệ, Quận 1, TP.HCM"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Không tìm thấy sản phẩm được chọn trong giỏ hàng!"
}
```

## Impact

### Trước Khi Fix
- 🔴 **Security Risk**: Lộ cấu trúc code ra ngoài
- 🔴 **Crash Risk**: Unhandled exception có thể crash server
- ❌ **Poor UX**: Message lỗi kỹ thuật, user không hiểu
- ❌ **Hard to Debug**: Không biết lỗi ở đâu

### Sau Khi Fix
- ✅ **Secure**: Không lộ thông tin hệ thống
- ✅ **Stable**: Exception được handle đúng cách
- ✅ **Good UX**: Message rõ ràng, thân thiện
- ✅ **Easy to Debug**: Error message chính xác

## All Empty Validation Blocks Fixed

Đã fix tất cả 5 validation blocks để trống trong checkout.service.js:

1. ✅ Line 22-24: `selectedItems` empty array
2. ✅ Line 26-29: `cart` not found or empty
3. ✅ Line 36-38: `selected` items empty
4. ✅ Line 96-98: `product` not found
5. ✅ Line 79-82: `cart` not found in createOrder (duplicate)

## Testing

### Manual Test
1. Tạo user mới (chưa có giỏ hàng)
2. Login
3. Gọi API checkout: `POST /checkout/place-order`
4. Verify response: `success: false`, message: "Giỏ hàng của bạn đang trống, không thể đặt hàng!"

### Postman Test
Import collection và chạy test:
- CHK-P-01: Checkout với giỏ trống → Expect 400 + success: false + message rõ ràng

## Files Changed

- ✅ `services/client/checkout.service.js` - Fix 5 empty validation blocks

## Related Issues

- Similar pattern: Empty validation blocks in other services
- Recommendation: Code review toàn bộ project để tìm empty blocks khác

---
**Fixed by:** Kiro AI
**Date:** 2026-04-05
**Branch:** testing-version-4
**Severity:** HIGH (Security + Stability)
**Status:** Fixed ✅
