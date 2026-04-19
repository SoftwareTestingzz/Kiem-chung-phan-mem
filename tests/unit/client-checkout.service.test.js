/**
 * Unit Tests - Client Checkout Service
 */

const checkoutService = require('../../services/client/checkout.service');
const Cart = require('../../models/cart.model');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');

jest.mock('../../models/cart.model');
jest.mock('../../models/order.model');
jest.mock('../../models/product.model');

afterEach(() => jest.clearAllMocks());

describe('checkoutService', () => {

    describe('getSelectedItems', () => {
        test('CHKSER-01: chưa login → throw error', async () => {
            await expect(checkoutService.getSelectedItems({ session: {} }, ['p1'])).rejects.toThrow("Bạn chưa đăng nhập!");
        });

        test('CHKSER-02: selectedItems rỗng → throw error', async () => {
            await expect(checkoutService.getSelectedItems({ session: { user: { _id: 'u1' } } }, [])).rejects.toThrow("Không có sản phẩm nào được chọn!");
        });

        test('CHKSER-03: giỏ hàng trống → throw error', async () => {
            Cart.findOne.mockResolvedValue(null);
            await expect(checkoutService.getSelectedItems({ session: { user: { _id: 'u1' } } }, ['p1'])).rejects.toThrow("Giỏ hàng của bạn đang trống!");
        });

        test('CHKSER-04: không tìm thấy item trong giỏ → throw error', async () => {
            Cart.findOne.mockResolvedValue({ items: [{ productId: 'p2' }] });
            await expect(checkoutService.getSelectedItems({ session: { user: { _id: 'u1' } } }, ['p1'])).rejects.toThrow("Không tìm thấy sản phẩm được chọn trong giỏ hàng!");
        });

        test('CHKSER-05: thành công', async () => {
            Cart.findOne.mockResolvedValue({ items: [{ productId: 'p1', price: 100, quantity: 2 }] });
            const result = await checkoutService.getSelectedItems({ session: { user: { _id: 'u1' } } }, ['p1']);
            expect(result.items).toHaveLength(1);
            expect(result.total).toBe(200);
        });
    });

    describe('createOrder', () => {
        const req = { session: { user: { _id: 'u1' } }, body: { name: 'A', phone: '123', address: 'B' } };

        test('CHKSER-06: chưa login → throw error', async () => {
            await expect(checkoutService.createOrder({ session: {} }, ['p1'])).rejects.toThrow("Bạn chưa đăng nhập!");
        });

        test('CHKSER-07: thiếu thông tin giao hàng → throw error', async () => {
            await expect(checkoutService.createOrder({ session: { user: { _id: 'u1' } }, body: {} }, ['p1'])).rejects.toThrow("Vui lòng nhập đầy đủ thông tin giao hàng!");
        });

        test('CHKSER-08: giỏ rỗng → throw error', async () => {
            Cart.findOne.mockResolvedValue(null);
            await expect(checkoutService.createOrder(req, ['p1'])).rejects.toThrow("Giỏ hàng của bạn đang trống, không thể đặt hàng!");
        });

        test('CHKSER-09: product không tồn tại → throw error', async () => {
            Cart.findOne.mockResolvedValue({ items: [{ productId: 'p1' }] });
            Product.findById.mockResolvedValue(null);
            await expect(checkoutService.createOrder(req, ['p1'])).rejects.toThrow("Sản phẩm undefined không tồn tại!");
        });

        test('CHKSER-10: không đủ stock → throw error', async () => {
            Cart.findOne.mockResolvedValue({ items: [{ productId: 'p1', quantity: 10, title: 'SP1' }] });
            Product.findById.mockResolvedValue({ title: 'SP1', stock: 5 });
            await expect(checkoutService.createOrder(req, ['p1'])).rejects.toThrow("Không đủ hàng cho sản phẩm: SP1");
        });

        test('CHKSER-11: thành công', async () => {
            const mockCart = { items: [{ productId: 'p1', quantity: 2, price: 100 }], save: jest.fn() };
            Cart.findOne.mockResolvedValue(mockCart);
            const mockProduct = { _id: 'p1', title: 'SP1', stock: 10, save: jest.fn() };
            Product.findById.mockResolvedValue(mockProduct);
            Order.create.mockResolvedValue({ _id: 'order1' });

            const result = await checkoutService.createOrder(req, ['p1']);

            // Trừ stock
            expect(mockProduct.stock).toBe(8);
            expect(mockProduct.save).toHaveBeenCalled();
            // Xoá khỏi giỏ
            expect(mockCart.items).toHaveLength(0);
            expect(mockCart.save).toHaveBeenCalled();
            expect(result._id).toBe('order1');
        });
    });

    describe('createOrderFromPayload', () => {
        const req = { session: { user: { _id: 'u1' } }, body: { name: 'A', phone: '123', address: 'B' } };

        test('CHKSER-12: payload rỗng → throw error', async () => {
            await expect(checkoutService.createOrderFromPayload(req, [])).rejects.toThrow("Không có sản phẩm để đặt hàng!");
        });

        test('CHKSER-13: không đủ hàng payload → throw error', async () => {
            Product.findById.mockResolvedValue({ title: 'SP1', stock: 0 });
            await expect(checkoutService.createOrderFromPayload(req, [{ productId: 'p1', quantity: 1 }])).rejects.toThrow("Không đủ hàng cho sản phẩm: SP1");
        });

        test('CHKSER-14: thành công', async () => {
            const mockProduct = { _id: 'p1', title: 'SP1', stock: 10, price: 100, save: jest.fn() };
            Product.findById.mockResolvedValue(mockProduct);
            Order.create.mockResolvedValue({ _id: 'order2' });

            const awaitObj = await checkoutService.createOrderFromPayload(req, [{ productId: 'p1', quantity: 2 }]);

            expect(mockProduct.stock).toBe(8); // bị trừ kho do clone lúc update? ko, .save() called
            expect(Order.create).toHaveBeenCalled();
            expect(awaitObj._id).toBe('order2');
        });
    });
});
