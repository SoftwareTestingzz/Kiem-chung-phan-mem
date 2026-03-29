const ordersService = require("../../services/client/orders.service");
const respond = require("../../helper/respond");

module.exports = {

    orderList: async (req, res) => {
        try {
            if (!req.session.user) {
                return respond(req, res, {
                    status: 401,
                    json: { success: false, message: 'Vui lòng đăng nhập!' },
                    redirect: '/login'
                });
            }

            const orders = await ordersService.getOrderList(req.session.user._id);

            return respond(req, res, {
                status: 200,
                json: { success: true, orders },
                render: { view: 'client/pages/orders/index', data: { pageTitle: 'Đơn hàng của tôi', orders } }
            });

        } catch (err) {
            console.error("Order List Error:", err.message);
            return respond(req, res, {
                status: 500,
                json: { success: false, message: 'Không thể tải danh sách đơn hàng!' },
                render: { view: 'client/pages/orders/index', data: { pageTitle: 'Đơn hàng của tôi', orders: [] } }
            });
        }
    },

    orderDetail: async (req, res) => {
        try {
            if (!req.session.user) {
                return respond(req, res, {
                    status: 401,
                    json: { success: false, message: 'Vui lòng đăng nhập!' },
                    redirect: '/login'
                });
            }

            const order = await ordersService.getOrderDetail(req.session.user._id, req.params.id);

            return respond(req, res, {
                status: 200,
                json: { success: true, order },
                render: { view: 'client/pages/orders/detail', data: { pageTitle: 'Chi tiết đơn hàng', order } }
            });

        } catch (err) {
            console.error("Order Detail Error:", err.message);
            return respond(req, res, {
                status: 500,
                json: { success: false, message: 'Không thể xem chi tiết đơn hàng!' },
                redirect: '/orders'
            });
        }
    },

    cancelOrder: async (req, res) => {
        try {
            if (!req.session.user) {
                return respond(req, res, {
                    status: 401,
                    json: { success: false, message: 'Vui lòng đăng nhập!' },
                    redirect: '/login'
                });
            }

            await ordersService.cancelOrder(req.session.user._id, req.params.id);

            return respond(req, res, {
                status: 200,
                json: { success: true, message: 'Đã hủy đơn hàng thành công!' },
                redirect: '/orders'
            });

        } catch (err) {
            console.error("Cancel Order Error:", err.message);
            return respond(req, res, {
                status: 400,
                json: { success: false, message: err.message || 'Không thể hủy đơn hàng!' },
                redirect: '/orders/' + req.params.id
            });
        }
    }

};
