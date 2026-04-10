# [BUG FIX] CART-R-02 | Xóa sản phẩm không tồn tại báo "Xóa thành công"

## Bug ID
CART-R-02

## Mô Tả Bug

### Request
- **URL:** `{{base_url}}/cart/delete`
- **Method:** POST
- **Body:** `{"productId": "000000000000000000000000"}`

### Kết Quả Thực Tế (Trước Khi Fix)
- Status: 200 OK
- Message: "Đã xóa sản phẩm khỏi giỏ!"
- Server gọi `await cart.save()` dù không có thay đổi gì
- Tốn tài nguyên Database Write Operation

### Kết Quả Mong Đợi
- Status: 200 OK
- Response: `{ "success": false, "message": "Sản phẩm không có trong giỏ hàng" }`
- KHÔNG gọi `cart.save()` nếu sản phẩm không tồn tại

## Root Cause

**File:** `services/client/cart.service.js`
**Function:** `removeItem()`

```javascript
// ❌ CODE CŨ - SAI
module.exports.removeItem = async (req, productId) => {
    const userId = req.session.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) return true; // ❌ Return true dù giỏ trống

    cart.items = cart.items.filter(
        i => i.productId.toString() !== productId
    );
    // ❌ Luôn gọi save() dù không có thay đổi

    await cart.save();
    return true;
};
```

**Vấn đề:**
1. Không kiểm tra sản phẩm có tồn tại trong giỏ hay không
2. `filter()` không làm thay đổi mảng nếu không tìm thấy
3. Vẫn gọi `cart.save()` → tốn tài nguyên DB
4. Return `true` → controller báo "Xóa thành công" dù không xóa gì

## Solution

### Thay Đổi Code

**File:** `services/client/cart.service.js`

```javascript
// ✅ CODE MỚI - ĐÚNG
module.exports.removeItem = async (req, productId) => {
    const userId = req.session.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Giỏ hàng trống!");

    // ✅ Kiểm tra sản phẩm có tồn tại không
    const itemIndex = cart.items.findIndex(
        i => i.productId.toString() === productId
    );

    if (itemIndex === -1) {
        // ✅ Throw error nếu không tìm thấy
        throw new Error("Sản phẩm không có trong giỏ hàng");
    }

    // ✅ Chỉ xóa và save khi sản phẩm thực sự tồn tại
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

### Test Case 1: Xóa sản phẩm không tồn tại
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

### Test Case 2: Xóa sản phẩm tồn tại
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
- ❌ Tốn tài nguyên DB (Write Operation không cần thiết)
- ❌ Dễ bị tấn công spam API
- ❌ Message không phản ánh đúng thực tế
- ❌ Khó debug khi có lỗi

### Sau Khi Fix
- ✅ Tối ưu hiệu suất: Không gọi `save()` nếu không cần
- ✅ Bảo vệ khỏi spam: Validate trước khi thao tác DB
- ✅ Message chính xác: User biết sản phẩm không tồn tại
- ✅ Dễ debug: Error message rõ ràng

## Testing

### Manual Test
1. Login vào hệ thống
2. Thêm sản phẩm vào giỏ
3. Test xóa sản phẩm không tồn tại: `productId: "000000000000000000000000"`
4. Verify response: `success: false`
5. Test xóa sản phẩm tồn tại
6. Verify response: `success: true`

### Postman Test
Import collection và chạy test:
- CART-R-02: Xóa sản phẩm không tồn tại → Expect 200 + success: false

## Files Changed

- ✅ `services/client/cart.service.js` - Thêm validation trong `removeItem()`

## Related Issues

- Tương tự có thể xảy ra ở `updateQuantity()` - đã có validation
- `clearCart()` không cần fix vì xóa toàn bộ

---
**Fixed by:** Kiro AI
**Date:** 2026-04-05
**Branch:** testing-version-4
**Severity:** Medium (Performance + UX)
**Status:** Fixed ✅
