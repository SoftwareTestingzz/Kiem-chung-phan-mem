
const orderService = require("../../services/admin/orders.service");
const respond = require("../../helper/respond");

function isAdmin(req) {
    return req.session && req.session.user && req.session.user.role === 'admin';
}

function isValidStatus(status) {
    // Chỉnh lại các trạng thái hợp lệ theo hệ thống của bạn
    return ["pending", "processing", "completed", "cancelled"].includes(status);
}

module.exports = {

    // ======================= DANH SÁCH ĐƠN =======================
    index: async (req, res) => {
        try {
            if (!isAdmin(req)) {
                return res.status(403).send('Forbidden');
            }
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
            if (!isAdmin(req)) {
                return res.status(403).send('Forbidden');
            }
            const order = await orderService.getDetail(req.params.id);
            if (!order) {
                return res.status(404).send("Đơn hàng không tồn tại hoặc đã bị khách huỷ!");
            }
            res.render("admin/pages/orders/detail", {
                pageTitle: "Chi tiết đơn hàng",
                order
            });
        } catch (err) {
            console.error("Admin Order Detail Error:", err);
            res.status(500).send("Lỗi khi tải chi tiết đơn hàng!");
        }
    },

    // ======================= UPDATE STATUS =======================
    updateStatus: async (req, res) => {
        try {
            if (!isAdmin(req)) {
                return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này!' });
            }
            const orderId = req.params.id;
            const { status } = req.body;
            if (!isValidStatus(status)) {
                return res.status(422).json({ success: false, message: 'Trạng thái không hợp lệ!' });
            }
            const result = await orderService.updateStatus(orderId, status);
            if (result.error) {
                return res.status(400).json({ success: false, message: result.error });
            }
            return res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công!' });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái đơn hàng!' });
        }
    }
};
