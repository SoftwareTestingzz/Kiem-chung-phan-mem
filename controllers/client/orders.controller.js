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
        const isAPI = req.headers.accept && req.headers.accept.includes('application/json');
        
        try {
            if (!req.session.user) {
                if (isAPI) {
                    return res.status(401).json({
                        success: false,
                        message: "Bạn chưa đăng nhập!"
                    });
                }
                return res.redirect("/login");
            }

            const userId = req.session.user._id;
            const orderId = req.params.id;

            const order = await ordersService.getOrderDetail(userId, orderId);

            if (isAPI) {
                return res.json({
                    success: true,
                    order
                });
            }

            return res.render("client/pages/orders/detail", {
                pageTitle: "Chi tiết đơn hàng",
                order
            });

        } catch (err) {
            console.error("Order Detail Error:", err.message);
            
            if (isAPI) {
                // API response với status code đúng
                if (err.message === "ID đơn hàng không hợp lệ") {
                    return res.status(400).json({
                        success: false,
                        message: "ID đơn hàng không hợp lệ!"
                    });
                } else if (err.message === "Không tìm thấy đơn hàng") {
                    return res.status(404).json({
                        success: false,
                        message: "Không tìm thấy đơn hàng!"
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: "Lỗi hệ thống!"
                    });
                }
            }
            
            // HTML response
            if (err.message === "ID đơn hàng không hợp lệ") {
                req.flash("error", "ID đơn hàng không hợp lệ!");
            } else if (err.message === "Không tìm thấy đơn hàng") {
                req.flash("error", "Không tìm thấy đơn hàng!");
            } else {
                req.flash("error", "Không thể xem chi tiết đơn hàng!");
            }
            
            return res.redirect("/orders");
        }
    },



    cancelOrder: async (req, res) => {
        const isAPI = req.headers.accept && req.headers.accept.includes('application/json');
        
        try {
            if (!req.session.user) {
                if (isAPI) {
                    return res.status(401).json({
                        success: false,
                        message: "Bạn chưa đăng nhập!"
                    });
                }
                return res.redirect("/login");
            }

            const userId = req.session.user._id;
            const orderId = req.params.id;

            await ordersService.cancelOrder(userId, orderId);

            if (isAPI) {
                return res.json({
                    success: true,
                    message: "Đã hủy đơn hàng thành công!"
                });
            }

            req.flash("success", "Đã hủy đơn hàng thành công!");
            return res.redirect("/orders");

        } catch (err) {
            console.error("Cancel Order Error:", err.message);

            if (isAPI) {
                if (err.message === "ID đơn hàng không hợp lệ") {
                    return res.status(400).json({
                        success: false,
                        message: "ID đơn hàng không hợp lệ!"
                    });
                } else if (err.message === "Không tìm thấy đơn hàng") {
                    return res.status(404).json({
                        success: false,
                        message: err.message
                    });
                } else if (err.message.includes("Không thể hủy")) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: "Lỗi hệ thống!"
                    });
                }
            }

            req.flash("error", err.message || "Không thể hủy đơn hàng!");
            return res.redirect("/orders/" + req.params.id);
        }
    }

};
