# [BUG FIX] CART-R-03 | Xóa sản phẩm khi giỏ hàng trống trả về phản hồi sai lệch

## Bug ID
CART-R-03

## Mô Tả Bug

### Request
- **URL:** `{{base_url}}/cart/delete`
- **Method:** POST
- **Body:** `{"productId": "{{test_product_id}}"}`

### Điều Kiện Tiền Quyết (Precondition)
- User vừa mới tạo tài khoản hoặc chưa từng thêm sản phẩm
- Trong DB, collection `carts` chưa có document cho user này
- Giỏ hàng hoàn toàn trống

### Kết Quả Thực Tế (Trước Khi Fix)
- Status: 200 OK
- Response: `{ "success": true, "message": "Đã xóa sản phẩm khỏi giỏ!" }`
- Code tại `cart.service.js` dòng 139-140:
  ```javascript
  let cart = await Cart.findOne({ userId });
  if (!cart) return true; // ❌ Return true khi giỏ trống
  ```

### Vấn Đề
- Thông báo "Đã xóa sản phẩm khỏi giỏ" là **sai lệch (misleading)**
- Gây lừa dối người dùng vì thao tác xóa chưa hề được thực hiện
- Frontend không thể xử lý UX hợp lý

### Kết Quả Mong Đợi
- Status: 200 OK
- Response: `{ "success": false, "message": "Giỏ hàng trống!" }`
- Thông báo chính xác với hiện trạng hệ thống

## Root Cause

**File:** `services/client/cart.service.js`
**Function:** `removeItem()`
**Line:** 139-140

```javascript
// ❌ CODE CŨ - SAI
module.exports.removeItem = async (req, productId) => {
    const userId = req.session.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) return true; // ❌ Sai: Return true khi giỏ trống

    cart.items = cart.items.filter(
        i => i.productId.toString() !== productId
    );

    await cart.save();
    return true;
};
```

**Vấn đề:**
1. Khi giỏ hàng không tồn tại (user mới), function return `true`
2. Controller nhận `true` → trả về `success: true` với message "Đã xóa sản phẩm"
3. User bị lừa dối, nghĩ rằng đã xóa thành công
4. Frontend không biết giỏ hàng đang trống

## Solution

### Thay Đổi Code

**File:** `services/client/cart.service.js`

```javascript
// ✅ CODE MỚI - ĐÚNG
module.exports.removeItem = async (req, productId) => {
    const userId = req.session.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Giỏ hàng trống!"); // ✅ Throw error

    // Kiểm tra sản phẩm có tồn tại trong giỏ không
    const itemIndex = cart.items.findIndex(
        i => i.productId.toString() === productId
    );

    if (itemIndex === -1) {
        throw new Error("Sản phẩm không có trong giỏ hàng");
    }

    // Xóa sản phẩm
    cart.items = cart.items.filter(
        i => i.productId.toString() !== productId
    );

    await cart.save();
    return true;
};
```

### Controller Xử Lý Error

**File:** `controllers/client/cart.controller.js`

Controller đã xử lý đúng (không cần sửa):

```javascript
module.exports.delete = async (req, res) => {
    try {
        // ...
        await cartService.removeItem(req, productId);

        return res.json({
            success: true,
            message: "Đã xóa sản phẩm khỏi giỏ!"
        });

    } catch (err) {
        // ✅ Catch error và trả về success: false
        return res.json({
            success: false,
            message: err.message || "Lỗi xóa sản phẩm!"
        });
    }
};
```

## Kết Quả Sau Khi Fix

### Test Case 1: Xóa sản phẩm khi giỏ trống
**Precondition:** User mới, chưa có giỏ hàng trong DB

**Request:**
```json
POST /cart/delete
{
  "productId": "69bd766c8f031f668361a5ab"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Giỏ hàng trống!"
}
```

### Test Case 2: Xóa sản phẩm không tồn tại (giỏ có nhưng sản phẩm không có)
**Request:**
```json
POST /cart/delete
{
  "productId": "000000000000000000000000"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Sản phẩm không có trong giỏ hàng"
}
```

### Test Case 3: Xóa sản phẩm tồn tại (happy path)
**Request:**
```json
POST /cart/delete
{
  "productId": "69bd766c8f031f668361a5ab"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đã xóa sản phẩm khỏi giỏ!"
}
```

## Impact

### Trước Khi Fix
- ❌ Message sai lệch, gây lừa dối user
- ❌ Frontend không biết giỏ hàng trống
- ❌ UX không nhất quán
- ❌ Khó debug khi có vấn đề

### Sau Khi Fix
- ✅ Message chính xác: "Giỏ hàng trống!"
- ✅ Frontend có thể xử lý UX đúng (hiển thị "Giỏ hàng trống", redirect, etc.)
- ✅ UX nhất quán và rõ ràng
- ✅ Dễ debug và maintain

## Relationship với CART-R-02

Bug này được fix **cùng lúc** với CART-R-02 trong cùng một commit:

**Commit:** `0398076`
**Message:** `fix(cart): validate product exists before delete to prevent unnecessary DB writes`

**Cả 2 bugs đều liên quan đến validation trong `removeItem()`:**
- CART-R-02: Xóa sản phẩm không tồn tại → Cần validate
- CART-R-03: Xóa khi giỏ trống → Cần validate

**Fix chung:**
```javascript
// Validate giỏ hàng tồn tại
if (!cart) throw new Error("Giỏ hàng trống!");

// Validate sản phẩm tồn tại trong giỏ
const itemIndex = cart.items.findIndex(...);
if (itemIndex === -1) {
    throw new Error("Sản phẩm không có trong giỏ hàng");
}
```

## Testing

### Manual Test
1. Tạo user mới (chưa có giỏ hàng)
2. Login
3. Gọi API xóa sản phẩm: `POST /cart/delete`
4. Verify response: `success: false`, message: "Giỏ hàng trống!"

### Postman Test
Import collection và chạy test:
- CART-R-03: Xóa khi giỏ trống → Expect 200 + success: false + message: "Giỏ hàng trống!"

## Files Changed

- ✅ `services/client/cart.service.js` - Thêm validation trong `removeItem()`

**Note:** File này đã được sửa trong commit CART-R-02, không cần commit riêng cho CART-R-03.

## Related Issues

- ✅ CART-R-02: Xóa sản phẩm không tồn tại (fixed cùng commit)
- ✅ CART-R-03: Xóa khi giỏ trống (fixed cùng commit)
- ✅ CART-CLEAR: Xóa toàn bộ giỏ khi giỏ trống (fixed sau)

## Additional Fix: clearCart()

Hàm `clearCart()` cũng có vấn đề tương tự:

```javascript
// ❌ CODE CŨ
module.exports.clearCart = async (req) => {
    const userId = req.session.user._id;
    await Cart.deleteOne({ userId });
    return true; // ❌ Luôn return true
};

// ✅ CODE MỚI
module.exports.clearCart = async (req) => {
    const userId = req.session.user._id;
    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new Error("Giỏ hàng trống!");
    }
    
    await Cart.deleteOne({ userId });
    return true;
};
```

**Test Case: Clear cart khi giỏ trống**
```json
POST /cart/clear

Response:
{
  "success": false,
  "message": "Giỏ hàng trống!"
}
```

---
**Fixed by:** Kiro AI
**Date:** 2026-04-05
**Branch:** testing-version-4
**Commit:** 0398076 (same as CART-R-02)
**Severity:** Medium (UX + Misleading Message)
**Status:** Fixed ✅
