const ordersService = require("../../services/client/orders.service");

module.exports = {


    orderList: async (req, res) => {
        const isApi = req.headers.accept && req.headers.accept.includes('application/json');
        try {
            // Chưa đăng nhập → không cho xem đơn hàng
            if (!req.session.user) {
                if (isApi) return res.status(400).json({ success: false, message: "Vui lòng đăng nhập" });
                return res.redirect("/login");
            }

            const userId = req.session.user._id;

            // Lấy danh sách đơn hàng từ service
            const orders = await ordersService.getOrderList(userId);

            if (isApi) return res.json({ success: true, orders });

            return res.render("client/pages/orders/index", {
                pageTitle: "Đơn hàng của tôi",
                orders
            });

        } catch (err) {
            console.error("Order List Error:", err.message);

            if (isApi) return res.status(400).json({ success: false, message: "Không thể tải danh sách đơn hàng!" });

            return res.render("client/pages/orders/index", {
                pageTitle: "Đơn hàng của tôi",
                orders: [],
                error: "Không thể tải danh sách đơn hàng!"
            });
        }
    },



    orderDetail: async (req, res) => {
        const isApi = req.headers.accept && req.headers.accept.includes('application/json');
        try {
            if (!req.session.user) {
                if (isApi) return res.status(400).json({ success: false, message: "Vui lòng đăng nhập" });
                return res.redirect("/login");
            }

            const userId = req.session.user._id;
            const orderId = req.params.id;

            const order = await ordersService.getOrderDetail(userId, orderId);

            if (isApi) return res.json({ success: true, order });

            return res.render("client/pages/orders/detail", {
                pageTitle: "Chi tiết đơn hàng",
                order
            });

        } catch (err) {
            console.error("Order Detail Error:", err.message);
            if (isApi) return res.status(400).json({ success: false, message: "Không thể xem chi tiết đơn hàng!" });
            req.flash("error", "Không thể xem chi tiết đơn hàng!");
            return res.redirect("/orders");
        }
    },



    cancelOrder: async (req, res) => {
        const isApi = req.headers.accept && req.headers.accept.includes('application/json');
        try {
            if (!req.session.user) {
                if (isApi) return res.status(400).json({ success: false, message: "Vui lòng đăng nhập" });
                return res.redirect("/login");
            }

            const userId = req.session.user._id;
            const orderId = req.params.id;

            await ordersService.cancelOrder(userId, orderId);

            if (isApi) return res.json({ success: true, message: "Đã hủy đơn hàng thành công!" });

            req.flash("success", "Đã hủy đơn hàng thành công!");
            return res.redirect("/orders");

        } catch (err) {
            console.error("Cancel Order Error:", err.message);

            if (isApi) return res.status(400).json({ success: false, message: err.message || "Không thể hủy đơn hàng!" });

            req.flash("error", err.message || "Không thể hủy đơn hàng!");
            return res.redirect("/orders/" + req.params.id);
        }
    }

};
