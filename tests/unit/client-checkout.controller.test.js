/**
 * Unit Tests - Client Checkout Controller
 */

const { validationResult } = require('express-validator');
const checkoutService = require('../../services/client/checkout.service');
const checkoutController = require('../../controllers/client/checkout.controller');

jest.mock('../../services/client/checkout.service');
jest.mock('express-validator');

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

beforeEach(() => {
    validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
});

afterEach(() => jest.clearAllMocks());

// ===================================================================
// renderCheckout
// ===================================================================
describe('checkoutController.renderCheckout', () => {
    test('CHKCTRL-01: chưa login → redirect /login', async () => {
        const req = makeReq({ session: {} });
        const res = makeRes();

        await checkoutController.renderCheckout(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('CHKCTRL-02: directItems không hợp lệ → redirect /cart', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { directItems: "invalid-json" } });
        const res = makeRes();

        await checkoutController.renderCheckout(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/cart');
    });

    test('CHKCTRL-03: directItems hợp lệ → render trang thanh toán', async () => {
        const req = makeReq({ session: { user: { _id: 'u1', fullName: "Test API" } }, body: { directItems: '["p1"]' } });
        const res = makeRes();

        checkoutService.getSelectedItemsFromPayload.mockResolvedValue({ items: [], total: 100 });

        await checkoutController.renderCheckout(req, res);

        expect(checkoutService.getSelectedItemsFromPayload).toHaveBeenCalledWith(req, ["p1"]);
        expect(res.render).toHaveBeenCalledWith("client/pages/checkout/index", expect.any(Object));
    });

    test('CHKCTRL-04: selectedItems không hợp lệ hoặc rỗng → redirect /cart', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { selectedItems: "[]" } });
        const res = makeRes();

        await checkoutController.renderCheckout(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/cart');
    });

    test('CHKCTRL-05: selectedItems hợp lệ → render trang thanh toán', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { selectedItems: '["p1"]' } });
        const res = makeRes();

        checkoutService.getSelectedItems.mockResolvedValue({ items: [], total: 100 });

        await checkoutController.renderCheckout(req, res);

        expect(checkoutService.getSelectedItems).toHaveBeenCalledWith(req, ["p1"]);
        expect(res.render).toHaveBeenCalledWith("client/pages/checkout/index", expect.any(Object));
    });
});

// ===================================================================
// placeOrder
// ===================================================================
describe('checkoutController.placeOrder', () => {
    test('CHKCTRL-06: validator báo lỗi → json 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'Validation error' }]
        });
        const req = makeReq({ session: { user: { _id: 'u1' } } });
        const res = makeRes();

        await checkoutController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Validation error' });
    });

    test('CHKCTRL-07: chưa login → json 400', async () => {
        const req = makeReq({ session: {} });
        const res = makeRes();

        await checkoutController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: "Bạn cần đăng nhập để đặt hàng!" }));
    });

    test('CHKCTRL-08: body parse JSON lỗi → json 400', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { selectedItems: 'invalid' } });
        const res = makeRes();

        await checkoutController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Dữ liệu không hợp lệ' });
    });

    test('CHKCTRL-09: ids rỗng → json 400', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { selectedItems: '[]' } });
        const res = makeRes();

        await checkoutController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Không có sản phẩm để đặt hàng' });
    });

    test('CHKCTRL-10: đặt hàng directItems thành công', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { directItems: '["p1"]' } });
        const res = makeRes();

        checkoutService.createOrderFromPayload.mockResolvedValue({ _id: 'order1' });

        await checkoutController.placeOrder(req, res);

        expect(checkoutService.createOrderFromPayload).toHaveBeenCalledWith(req, ['p1']);
        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Đặt hàng thành công!', orderId: 'order1' });
    });

    test('CHKCTRL-11: đặt hàng selectedItems thành công', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { selectedItems: '["p2"]' } });
        const res = makeRes();

        checkoutService.createOrder.mockResolvedValue({ _id: 'order2' });

        await checkoutController.placeOrder(req, res);

        expect(checkoutService.createOrder).toHaveBeenCalledWith(req, ['p2']);
        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Đặt hàng thành công!', orderId: 'order2' });
    });

    test('CHKCTRL-12: service ném lỗi → json 400', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, body: { selectedItems: '["p2"]' } });
        const res = makeRes();

        checkoutService.createOrder.mockRejectedValue(new Error('Hết hàng'));

        await checkoutController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Hết hàng' });
    });
});
