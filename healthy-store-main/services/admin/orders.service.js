const Order = require("../../models/order.model");
const mongoose = require("mongoose");

// ======================= MAP STATUS =======================
function mapStatus(status) {
    switch (status) {
        case "pending": return "Đang xử lý";
        case "confirmed": return "Đã duyệt";
        case "shipping": return "Đang giao";
        case "completed": return "Hoàn tất";
        case "cancelled": return "Đã hủy";
        default: return "Không xác định";
    }
}

// ======================= LẤY DANH SÁCH ĐƠN =======================
module.exports.getList = async (query = {}) => {
    let filter = {};
    let sort = {};

    const keyword = (query.keyword || "").trim();
    const status = query.status || "";
    const sortKey = query.sort || "newest";

    const year = query.year ? Number(query.year) : null;
    const month = query.month ? Number(query.month) : null;

    // ====================================================
    // Nếu có nhập mã đơn → BỎ TẤT CẢ FILTER KHÁC
    // ====================================================
    if (keyword) {
        filter = {}; // reset mọi điều kiện

        if (keyword.length === 24 && mongoose.isValidObjectId(keyword)) {
            filter._id = new mongoose.Types.ObjectId(keyword);
        } else {
            filter.$expr = {
                $regexMatch: {
                    input: { $toString: "$_id" },
                    regex: keyword,
                    options: "i"
                }
            };
        }
    } else {
        // ====================================================
        // Không nhập mã đơn → Áp dụng các filter bình thường
        // ====================================================

        // 1. Lọc theo trạng thái
        if (status !== "") {
            filter.status = status;
        } else {
            filter.status = { $ne: "cancelled" }; // như logic cũ
        }

        // 2. Lọc theo thời gian
        if (year && month) {
            // Có cả năm và tháng → lọc đúng 1 tháng trong năm đó
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 1);
            filter.createdAt = { $gte: start, $lt: end };
        } else if (year && !month) {
            // Chỉ có năm → lọc cả năm
            const start = new Date(year, 0, 1);
            const end = new Date(year + 1, 0, 1);
            filter.createdAt = { $gte: start, $lt: end };
        } else if (!year && month) {
            // Chỉ có tháng, không có năm → lọc tất cả đơn có tháng đó (mọi năm)
            filter.$expr = {
                $eq: [{ $month: "$createdAt" }, month]
            };
        }
        // Nếu không có year, không có month → không lọc theo thời gian
    }

    // ======================= SẮP XẾP =======================
    sort = sortKey === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // ======================= PHÂN TRANG =======================
    const limit = parseInt(query.limit) || 10;
    const page = parseInt(query.page) > 0 ? parseInt(query.page) : 1;
    const skip = (page - 1) * limit;

    const [ordersRaw, total] = await Promise.all([
        Order.find(filter).sort(sort).skip(skip).limit(limit),
        Order.countDocuments(filter)
    ]);

    const orders = ordersRaw.map(o => ({
        ...o.toObject(),
        statusText: mapStatus(o.status)
    }));

    // ======================= DANH SÁCH NĂM =======================
    const yearAgg = await Order.aggregate([
        { $group: { _id: { $year: "$createdAt" } } },
        { $sort: { _id: -1 } }
    ]);

    const years = yearAgg.map(y => y._id);

    return {
        docs: orders,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        years
    };
};

// ======================= CHI TIẾT ĐƠN =======================
module.exports.getDetail = async (id) => {
    const order = await Order.findById(id);
    if (!order) return null;
    if (order.status === "cancelled") return null;

    return {
        ...order.toObject(),
        statusText: mapStatus(order.status)
    };
};

// ======================= UPDATE TRẠNG THÁI =======================
module.exports.updateStatus = async (id, status) => {
    if (status === "cancelled") {
        return { error: "Admin không có quyền hủy đơn hàng!" };
    }

    await Order.findByIdAndUpdate(id, { status });
    return { success: true };
};