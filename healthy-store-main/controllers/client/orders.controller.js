const ordersService = require("../../services/client/orders.service");

module.exports = {


    orderList: async (req, res) => {
        try {
            // Chưa đăng nhập → không cho xem đơn hàng
            if (!req.session.user) {
                return res.redirect("/login");
            }

            const userId = req.session.user._id;

            // Lấy danh sách đơn hàng từ service
            const orders = await ordersService.getOrderList(userId);

            return res.render("client/pages/orders/index", {
                pageTitle: "Đơn hàng của tôi",
                orders
            });

        } catch (err) {
            console.error("Order List Error:", err.message);

            return res.render("client/pages/orders/index", {
                pageTitle: "Đơn hàng của tôi",
                orders: [],
                error: "Không thể tải danh sách đơn hàng!"
            });
        }
    },



    orderDetail: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect("/login");
            }

            const userId = req.session.user._id;
            const orderId = req.params.id;

            const order = await ordersService.getOrderDetail(userId, orderId);

            return res.render("client/pages/orders/detail", {
                pageTitle: "Chi tiết đơn hàng",
                order
            });

        } catch (err) {
            console.error("Order Detail Error:", err.message);
            req.flash("error", "Không thể xem chi tiết đơn hàng!");
            return res.redirect("/orders");
        }
    },



    cancelOrder: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect("/login");
            }

            const userId = req.session.user._id;
            const orderId = req.params.id;

            await ordersService.cancelOrder(userId, orderId);

            req.flash("success", "Đã hủy đơn hàng thành công!");
            return res.redirect("/orders");

        } catch (err) {
            console.error("Cancel Order Error:", err.message);

            req.flash("error", err.message || "Không thể hủy đơn hàng!");
            return res.redirect("/orders/" + req.params.id);
        }
    }

};
