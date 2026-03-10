const Blog = require("../../models/blog.model");
module.exports.getList = async (query = {}) => {
    const limit = 6; // 6 bài / trang
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    // ===== FILTER (không phá chức năng cũ) =====
    const filter = {};

    // Nếu sau này controller truyền keyword thì tự động dùng
    if (query.keyword) {
        filter.title = { $regex: query.keyword, $options: "i" };
    }

    const [blogs, total] = await Promise.all([
        Blog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Blog.countDocuments(filter)
    ]);

    return {
        success: true,
        data: blogs,
        page,
        totalPages: Math.max(1, Math.ceil(total / limit)),

        // Trả thêm nhưng KHÔNG bắt buộc dùng
        limit,
        total,
        keyword: query.keyword || ""
    };
};


module.exports.getDetail = async (slug) => {
    const blog = await Blog.findOne({ slug });

    if (!blog) {
        return {
            success: false,
            message: "Không tìm thấy bài viết",
            data: null
        };
    }

    return {
        success: true,
        data: blog
    };
};
