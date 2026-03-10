const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

module.exports = {

    // ====================================================
    // Lấy danh sách đơn hàng của user
    // ====================================================
    getOrderList: async (userId) => {
        return await Order.find({ userId })
            .sort({ createdAt: -1 });
    },

    // ====================================================
    // Lấy chi tiết đơn hàng theo user
    // ====================================================
    getOrderDetail: async (userId, orderId) => {
        const order = await Order.findOne({
            _id: orderId,
            userId
        });

        if (!order) throw new Error("Không tìm thấy đơn hàng");

        return order;
    },

    // ====================================================
    // HỦY ĐƠN HÀNG (CLIENT)
    // ====================================================
    cancelOrder: async (userId, orderId) => {
        const order = await Order.findOne({
            _id: orderId,
            userId
        });

        if (!order) {
            throw new Error("Không tìm thấy đơn hàng");
        }

        // Chỉ cho phép hủy nếu đơn đang xử lý hoặc đã duyệt
        if (!["pending", "confirmed"].includes(order.status)) {
            throw new Error("Không thể hủy đơn này vì đang giao hoặc đã hoàn tất");
        }

        // ====================================================
        // HOÀN LẠI TỒN KHO (an toàn, không làm hỏng chức năng khác)
        // ====================================================
        for (let item of order.items) {
            const product = await Product.findById(item.productId);

            // Nếu sản phẩm đã bị xóa → bỏ qua, không crash hệ thống
            if (!product) continue;

            product.stock += item.quantity;
            await product.save();
        }

        // ====================================================
        // Cập nhật trạng thái đơn
        // ====================================================
        order.status = "cancelled";
        await order.save();

        return order;
    }
};
