/**
 * Unit Tests - Client Cart Controller
 */

const cartService = require('../../services/client/cart.service');
const cartController = require('../../controllers/client/cart.controller');

jest.mock('../../services/client/cart.service');

// Helpers
function makeReq(overrides = {}) {
    return {
        session: {},
        headers: { accept: 'application/json' },
        body: {},
        ...overrides
    };
}

function makeRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        redirect: jest.fn(),
        render: jest.fn(),
    };
}

afterEach(() => jest.clearAllMocks());

// ===================================================================
// add
// ===================================================================
describe('cartController.add', () => {
    test('CARTCTRL-01: chưa login → json 400', async () => {
        const req = makeReq({ session: {} });
        const res = makeRes();

        await cartController.add(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Vui lòng đăng nhập để thêm vào giỏ hàng!",
            requireLogin: true
        });
    });

    test('CARTCTRL-02: thành công', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { productId: 'p1', quantity: 2 } });
        const res = makeRes();

        cartService.addToCart.mockResolvedValue(true);

        await cartController.add(req, res);

        expect(cartService.addToCart).toHaveBeenCalledWith(req, 'p1', 2);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Đã thêm vào giỏ hàng!"
        });
    });

    test('CARTCTRL-03: lỗi service', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { productId: 'p1', quantity: 2 } });
        const res = makeRes();

        cartService.addToCart.mockRejectedValue(new Error('Sản phẩm không đủ số lượng'));

        await cartController.add(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Sản phẩm không đủ số lượng"
        });
    });
});

// ===================================================================
// update
// ===================================================================
describe('cartController.update', () => {
    test('CARTCTRL-04: chưa login → json 400', async () => {
        const req = makeReq({ session: {} });
        const res = makeRes();

        await cartController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false, message: "Vui lòng đăng nhập để cập nhật giỏ hàng!"
        }));
    });

    test('CARTCTRL-05: thành công', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { productId: 'p1', quantity: 3 } });
        const res = makeRes();

        cartService.updateQuantity.mockResolvedValue(true);

        await cartController.update(req, res);

        expect(cartService.updateQuantity).toHaveBeenCalledWith(req, 'p1', 3);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Cập nhật giỏ hàng thành công!"
        });
    });
});

// ===================================================================
// delete
// ===================================================================
describe('cartController.delete', () => {
    test('CARTCTRL-06: chưa login → json 400', async () => {
        const req = makeReq({ session: {} });
        const res = makeRes();

        await cartController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false, message: "Vui lòng đăng nhập để xóa sản phẩm!"
        }));
    });

    test('CARTCTRL-07: thành công', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { productId: 'p1' } });
        const res = makeRes();

        cartService.removeItem.mockResolvedValue(true);

        await cartController.delete(req, res);

        expect(cartService.removeItem).toHaveBeenCalledWith(req, 'p1');
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Đã xóa sản phẩm khỏi giỏ!"
        });
    });
});

// ===================================================================
// clear
// ===================================================================
describe('cartController.clear', () => {
    test('CARTCTRL-08: chưa login → json 400', async () => {
        const req = makeReq({ session: {} });
        const res = makeRes();

        await cartController.clear(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false, message: "Vui lòng đăng nhập để xóa giỏ hàng!"
        }));
    });

    test('CARTCTRL-09: thành công', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } } });
        const res = makeRes();

        cartService.clearCart.mockResolvedValue(true);

        await cartController.clear(req, res);

        expect(cartService.clearCart).toHaveBeenCalledWith(req);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Đã xóa toàn bộ giỏ hàng!"
        });
    });
});

// ===================================================================
// index
// ===================================================================
describe('cartController.index', () => {
    test('CARTCTRL-10: API request thành công', async () => {
        const req = makeReq({ headers: { accept: 'application/json' } });
        const res = makeRes();

        cartService.getCart.mockResolvedValue({ cart: [], total: 0 });

        await cartController.index(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: true, cart: [], total: 0 });
    });

    test('CARTCTRL-11: API request lỗi', async () => {
        const req = makeReq({ headers: { accept: 'application/json' } });
        const res = makeRes();

        cartService.getCart.mockRejectedValue(new Error('Lỗi'));

        await cartController.index(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Không thể tải giỏ hàng!!!" });
    });

    test('CARTCTRL-12: HTML request thành công', async () => {
        const req = makeReq({ headers: { accept: 'text/html' } });
        const res = makeRes();

        cartService.getCart.mockResolvedValue({ cart: [{ id: 'p1' }], total: 100 });

        await cartController.index(req, res);

        expect(res.render).toHaveBeenCalledWith("client/pages/cart/index", {
            pageTitle: "Giỏ hàng",
            cart: [{ id: 'p1' }],
            total: 100
        });
    });
});
