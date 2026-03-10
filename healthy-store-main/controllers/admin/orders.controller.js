const orderService = require("../../services/admin/orders.service");

module.exports = {

    // ======================= DANH SÁCH ĐƠN =======================
    index: async (req, res) => {
        try {
            const result = await orderService.getList(req.query);

            res.render("admin/pages/orders/index", {
                pageTitle: "Quản lý đơn hàng",
                orders: result.docs,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                years: result.years,
                query: req.query
            });

        } catch (err) {
            console.error("Admin Order List Error:", err);

            res.render("admin/pages/orders/index", {
                pageTitle: "Quản lý đơn hàng",
                orders: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
                years: [],
                query: req.query,
                error: "Không thể tải danh sách đơn!"
            });
        }
    },

    // ======================= CHI TIẾT =======================
    detail: async (req, res) => {
        try {
            const order = await orderService.getDetail(req.params.id);

            if (!order) {
                return res.send("Đơn hàng không tồn tại hoặc đã bị khách hủy!");
            }

            res.render("admin/pages/orders/detail", {
                pageTitle: "Chi tiết đơn hàng",
                order
            });

        } catch (err) {
            console.error("Admin Order Detail Error:", err);
            res.send("Lỗi khi tải chi tiết đơn hàng!");
        }
    },

    // ======================= UPDATE STATUS =======================
    updateStatus: async (req, res) => {
        try {
            const orderId = req.params.id;
            const { status } = req.body;

            const result = await orderService.updateStatus(orderId, status);

            if (result.error) {
                return res.send(result.error);
            }

            res.redirect(`/admin/orders/${orderId}`);

        } catch (err) {
            console.error("Update Status Error:", err);
            res.send("Lỗi cập nhật trạng thái đơn hàng!");
        }
    }
};
