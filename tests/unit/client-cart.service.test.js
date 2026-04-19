/**
 * Unit Tests - Client Cart Service
 */

const cartService = require('../../services/client/cart.service');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const mongoose = require('mongoose');

jest.mock('../../models/cart.model');
jest.mock('../../models/product.model');

afterEach(() => jest.clearAllMocks());

describe('cartService', () => {

    // ===================================================================
    // getCart
    // ===================================================================
    describe('getCart', () => {
        test('CARTSER-01: chưa login → trả về giỏ rỗng', async () => {
            const req = { session: {} };
            const result = await cartService.getCart(req);
            expect(result).toEqual({ cart: [], total: 0, totalFormatted: expect.any(String) });
        });

        test('CARTSER-02: chưa có giỏ trong DB → trả về rỗng', async () => {
            const req = { session: { user: { _id: 'u1' } } };
            Cart.findOne.mockResolvedValue(null);

            const result = await cartService.getCart(req);
            expect(result).toEqual({ cart: [], total: 0, totalFormatted: expect.any(String) });
        });

        test('CARTSER-03: có giỏ → tính tổng tiền', async () => {
            const req = { session: { user: { _id: 'u1' } } };
            Cart.findOne.mockResolvedValue({
                items: [{ price: 100, quantity: 2 }, { price: 50, quantity: 1 }]
            });

            const result = await cartService.getCart(req);
            expect(result.cart).toHaveLength(2);
            expect(result.total).toBe(250);
        });
    });

    // ===================================================================
    // addToCart
    // ===================================================================
    describe('addToCart', () => {
        const req = { session: { user: { _id: 'u1' } } };

        beforeEach(() => {
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
        });

        test('CARTSER-04: chưa login → throw error', async () => {
            await expect(cartService.addToCart({ session: {} }, 'p1', 1)).rejects.toThrow("Bạn phải đăng nhập!");
        });

        test('CARTSER-05: Product ObjectId không hợp lệ → throw error', async () => {
            mongoose.Types.ObjectId.isValid.mockReturnValue(false);
            await expect(cartService.addToCart(req, 'invalid', 1)).rejects.toThrow("Mã sản phẩm không hợp lệ!");
        });

        test('CARTSER-06: sản phẩm không tồn tại → throw error', async () => {
            Product.findById.mockResolvedValue(null);
            await expect(cartService.addToCart(req, 'p1', 1)).rejects.toThrow("Sản phẩm không tồn tại");
        });

        test('CARTSER-07: quantity không hợp lệ → throw error', async () => {
            Product.findById.mockResolvedValue({ title: 'A', stock: 10 });
            await expect(cartService.addToCart(req, 'p1', 'abc')).rejects.toThrow("Số lượng không hợp lệ");
        });

        test('CARTSER-08: vượt quá kho → throw error', async () => {
            Product.findById.mockResolvedValue({ title: 'A', stock: 5 });
            await expect(cartService.addToCart(req, 'p1', 10)).rejects.toThrow("Không đủ hàng");
        });

        test('CARTSER-09: chưa có giỏ → tạo mới', async () => {
            Product.findById.mockResolvedValue({ _id: 'p1', title: 'A', stock: 10, price: 100 });
            Cart.findOne.mockResolvedValue(null);
            Cart.create.mockResolvedValue(true);

            const result = await cartService.addToCart(req, 'p1', 2);
            expect(result).toBe(true);
            expect(Cart.create).toHaveBeenCalled();
        });

        test('CARTSER-10: có giỏ, chưa có item → thêm item', async () => {
            Product.findById.mockResolvedValue({ _id: 'p1', title: 'A', stock: 10, price: 100 });
            const mockCart = { items: [], save: jest.fn() };
            Cart.findOne.mockResolvedValue(mockCart);

            const result = await cartService.addToCart(req, 'p1', 2);
            expect(result).toBe(true);
            expect(mockCart.items).toHaveLength(1);
            expect(mockCart.save).toHaveBeenCalled();
        });

        test('CARTSER-11: đã có item → cộng số lượng, nếu vượt kho → throw', async () => {
            Product.findById.mockResolvedValue({ _id: 'p1', title: 'A', stock: 10, price: 100 });
            const mockCart = { items: [{ productId: 'p1', quantity: 9 }], save: jest.fn() };
            Cart.findOne.mockResolvedValue(mockCart);

            await expect(cartService.addToCart(req, 'p1', 2)).rejects.toThrow("Vượt quá tồn kho");
        });

        test('CARTSER-12: đã có item → cộng số lượng thành công', async () => {
            Product.findById.mockResolvedValue({ _id: 'p1', title: 'A', stock: 10, price: 100 });
            const mockCart = { items: [{ productId: 'p1', quantity: 5 }], save: jest.fn() };
            Cart.findOne.mockResolvedValue(mockCart);

            await cartService.addToCart(req, 'p1', 2);
            expect(mockCart.items[0].quantity).toBe(7);
            expect(mockCart.save).toHaveBeenCalled();
        });
    });

    // ===================================================================
    // updateQuantity
    // ===================================================================
    describe('updateQuantity', () => {
        const req = { session: { user: { _id: 'u1' } } };

        beforeEach(() => {
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
        });

        test('CARTSER-13: Mã không hợp lệ', async () => {
            mongoose.Types.ObjectId.isValid.mockReturnValue(false);
            await expect(cartService.updateQuantity(req, 'invalid', 1)).rejects.toThrow("Mã sản phẩm không hợp lệ!");
        });

        test('CARTSER-14: Giỏ hàng trống', async () => {
            Cart.findOne.mockResolvedValue(null);
            await expect(cartService.updateQuantity(req, 'p1', 1)).rejects.toThrow("Giỏ hàng trống!");
        });

        test('CARTSER-15: Sản phẩm không có → báo lỗi', async () => {
            Cart.findOne.mockResolvedValue({ items: [] });
            await expect(cartService.updateQuantity(req, 'p1', 1)).rejects.toThrow("Không tìm thấy sản phẩm");
        });

        test('CARTSER-16: Số lượng <= 0 → báo lỗi', async () => {
            Cart.findOne.mockResolvedValue({ items: [{ productId: 'p1' }] });
            await expect(cartService.updateQuantity(req, 'p1', 0)).rejects.toThrow("Số lượng không hợp lệ");
        });

        test('CARTSER-17: vượt maxStock → báo lỗi', async () => {
            Cart.findOne.mockResolvedValue({ items: [{ productId: 'p1', maxStock: 5 }] });
            await expect(cartService.updateQuantity(req, 'p1', 10)).rejects.toThrow("Vượt quá tồn kho");
        });

        test('CARTSER-18: thành công', async () => {
            const mockCart = { items: [{ productId: 'p1', maxStock: 5, quantity: 1 }], save: jest.fn() };
            Cart.findOne.mockResolvedValue(mockCart);
            await cartService.updateQuantity(req, 'p1', 3);
            expect(mockCart.items[0].quantity).toBe(3);
            expect(mockCart.save).toHaveBeenCalled();
        });
    });

    // ===================================================================
    // removeItem
    // ===================================================================
    describe('removeItem', () => {
        const req = { session: { user: { _id: 'u1' } } };

        beforeEach(() => {
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
        });

        test('CARTSER-19: Giỏ trống', async () => {
            Cart.findOne.mockResolvedValue(null);
            await expect(cartService.removeItem(req, 'p1')).rejects.toThrow("Giỏ hàng trống!");
        });

        test('CARTSER-20: Sản phẩm không có trong giỏ', async () => {
            Cart.findOne.mockResolvedValue({ items: [] });
            await expect(cartService.removeItem(req, 'p1')).rejects.toThrow("Sản phẩm không có trong giỏ hàng");
        });

        test('CARTSER-21: Xóa thành công', async () => {
            const mockCart = { items: [{ productId: 'p1' }], save: jest.fn() };
            Cart.findOne.mockResolvedValue(mockCart);

            await cartService.removeItem(req, 'p1');
            expect(mockCart.items).toHaveLength(0);
            expect(mockCart.save).toHaveBeenCalled();
        });
    });

    // ===================================================================
    // clearCart
    // ===================================================================
    describe('clearCart', () => {
        const req = { session: { user: { _id: 'u1' } } };

        test('CARTSER-22: Giỏ trống', async () => {
            Cart.findOne.mockResolvedValue(null);
            await expect(cartService.clearCart(req)).rejects.toThrow("Giỏ hàng trống!");
        });

        test('CARTSER-23: Xóa thành công', async () => {
            Cart.findOne.mockResolvedValue({});
            Cart.deleteOne.mockResolvedValue(true);

            await cartService.clearCart(req);
            expect(Cart.deleteOne).toHaveBeenCalledWith({ userId: 'u1' });
        });
    });
});
