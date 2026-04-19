/**
 * Unit Tests - Client Orders Controller
 */

const ordersService = require('../../services/client/orders.service');
const ordersController = require('../../controllers/client/orders.controller');

jest.mock('../../services/client/orders.service');

// Helpers
function makeReq(overrides = {}) {
    return {
        session: {},
        headers: { accept: 'application/json' },
        body: {},
        flash: jest.fn(),
        params: {},
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
// orderList
// ===================================================================
describe('ordersController.orderList', () => {
    test('ORDCTRL-01: chưa login → redirect /login', async () => {
        const req = makeReq({ session: {} });
        const res = makeRes();

        await ordersController.orderList(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('ORDCTRL-02: thành công → render trang danh sách đơn hàng', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } } });
        const res = makeRes();

        ordersService.getOrderList.mockResolvedValue([]);

        await ordersController.orderList(req, res);

        expect(ordersService.getOrderList).toHaveBeenCalledWith('u1');
        expect(res.render).toHaveBeenCalledWith("client/pages/orders/index", {
            pageTitle: "Đơn hàng của tôi",
            orders: []
        });
    });

    test('ORDCTRL-03: lỗi service → render có log lỗi', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } } });
        const res = makeRes();

        ordersService.getOrderList.mockRejectedValue(new Error('Lỗi database'));

        await ordersController.orderList(req, res);

        expect(res.render).toHaveBeenCalledWith("client/pages/orders/index", {
            pageTitle: "Đơn hàng của tôi",
            orders: [],
            error: "Không thể tải danh sách đơn hàng!"
        });
    });
});

// ===================================================================
// orderDetail
// ===================================================================
describe('ordersController.orderDetail', () => {
    test('ORDCTRL-04: API chưa login → json 401', async () => {
        const req = makeReq({ session: {}, headers: { accept: 'application/json' } });
        const res = makeRes();

        await ordersController.orderDetail(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Bạn chưa đăng nhập!" });
    });

    test('ORDCTRL-05: HTML chưa login → redirect /login', async () => {
        const req = makeReq({ session: {}, headers: { accept: 'text/html' } });
        const res = makeRes();

        await ordersController.orderDetail(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('ORDCTRL-06: API thành công → json order', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, params: { id: 'order1' }, headers: { accept: 'application/json' } });
        const res = makeRes();

        ordersService.getOrderDetail.mockResolvedValue({ _id: 'order1' });

        await ordersController.orderDetail(req, res);

        expect(ordersService.getOrderDetail).toHaveBeenCalledWith('u1', 'order1');
        expect(res.json).toHaveBeenCalledWith({ success: true, order: { _id: 'order1' } });
    });

    test('ORDCTRL-07: HTML thành công → render detail', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, params: { id: 'order1' }, headers: { accept: 'text/html' } });
        const res = makeRes();

        ordersService.getOrderDetail.mockResolvedValue({ _id: 'order1' });

        await ordersController.orderDetail(req, res);

        expect(res.render).toHaveBeenCalledWith("client/pages/orders/detail", expect.any(Object));
    });

    test('ORDCTRL-08: API lỗi "ID đơn hàng không hợp lệ" → json 400', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, headers: { accept: 'application/json' } });
        const res = makeRes();

        ordersService.getOrderDetail.mockRejectedValue(new Error("ID đơn hàng không hợp lệ"));

        await ordersController.orderDetail(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "ID đơn hàng không hợp lệ!" });
    });

    test('ORDCTRL-09: HTML lỗi "ID đơn hàng không hợp lệ" → flash & redirect /orders', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, headers: { accept: 'text/html' } });
        const res = makeRes();

        ordersService.getOrderDetail.mockRejectedValue(new Error("ID đơn hàng không hợp lệ"));

        await ordersController.orderDetail(req, res);

        expect(req.flash).toHaveBeenCalledWith('error', "ID đơn hàng không hợp lệ!");
        expect(res.redirect).toHaveBeenCalledWith('/orders');
    });
});

// ===================================================================
// cancelOrder
// ===================================================================
describe('ordersController.cancelOrder', () => {
    test('ORDCTRL-10: chưa login → json 401', async () => {
        const req = makeReq({ session: {} });
        const res = makeRes();

        await ordersController.cancelOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Bạn chưa đăng nhập!" });
    });

    test('ORDCTRL-11: thành công → json 200', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, params: { id: 'order1' } });
        const res = makeRes();

        ordersService.cancelOrder.mockResolvedValue({ _id: 'order1', status: 'Canceled' });

        await ordersController.cancelOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Đã hủy đơn hàng thành công!",
            order: { _id: 'order1', status: 'Canceled' }
        });
    });

    test('ORDCTRL-12: lỗi "ID đơn hàng không hợp lệ" → json 400', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, params: { id: 'invalid' } });
        const res = makeRes();

        ordersService.cancelOrder.mockRejectedValue(new Error("ID đơn hàng không hợp lệ"));

        await ordersController.cancelOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: "ID đơn hàng không hợp lệ!" }));
    });

    test('ORDCTRL-13: lỗi "Không tìm thấy đơn hàng" → json 404', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, params: { id: 'order99' } });
        const res = makeRes();

        ordersService.cancelOrder.mockRejectedValue(new Error("Không tìm thấy đơn hàng"));

        await ordersController.cancelOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: "Không tìm thấy đơn hàng" }));
    });

    test('ORDCTRL-14: lỗi "Không thể hủy" → json 400', async () => {
        const req = makeReq({ session: { user: { _id: 'u1' } }, params: { id: 'order1' } });
        const res = makeRes();

        ordersService.cancelOrder.mockRejectedValue(new Error("Không thể hủy đơn hàng này!"));

        await ordersController.cancelOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: "Không thể hủy đơn hàng này!" }));
    });
});
