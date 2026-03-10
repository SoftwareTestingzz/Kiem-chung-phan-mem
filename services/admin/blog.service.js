const Blog = require("../../models/blog.model");
const slugify = require("slugify");
const uploadToCloud = require("../../helper/uploadCloud");

// ======================= LẤY DANH SÁCH BLOG =======================
module.exports.getList = async (query = {}) => {
    const filter = {};
    let sort = {};

    const keyword = query.keyword || "";
    const sortKey = query.sort || "newest";
    const month = parseInt(query.month);
    const year = parseInt(query.year);

    // tìm theo tiêu đề
    if (keyword) {
        filter.title = { $regex: keyword, $options: "i" };
    }

    // lọc theo tháng / năm
    if (!isNaN(year)) {
        const start = new Date(year, !isNaN(month) ? month - 1 : 0, 1);
        const end = !isNaN(month)
            ? new Date(year, month, 1) // hết tháng
            : new Date(year + 1, 0, 1); // hết năm

        filter.createdAt = { $gte: start, $lt: end };
    }

    // sắp xếp
    switch (sortKey) {
        case "oldest":
            sort = { createdAt: 1 };
            break;
        case "title_az":
            sort = { title: 1 };
            break;
        case "title_za":
            sort = { title: -1 };
            break;
        default:
            sort = { createdAt: -1 };
    }

    // phân trang
    const limit = parseInt(query.limit) || 5;
    const page = parseInt(query.page) > 0 ? parseInt(query.page) : 1;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
        Blog.find(filter).sort(sort).skip(skip).limit(limit),
        Blog.countDocuments(filter)
    ]);

    // lấy danh sách năm có bài viết
    const yearAgg = await Blog.aggregate([
        { $group: { _id: { $year: "$createdAt" } } },
        { $sort: { _id: -1 } }
    ]);

    const years = yearAgg.map(y => y._id);

    return {
        docs: blogs,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        years
    };
};

// ======================= TẠO BÀI VIẾT =======================
module.exports.createBlog = async (req) => {
    let thumbnail = "";

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path);
        thumbnail = uploadResult.secure_url;
    }

    const blog = new Blog({
        title: req.body.title,
        slug: slugify(req.body.title, { lower: true, strict: true }),
        content: req.body.content,
        thumbnail
    });

    return await blog.save();
};

// ======================= LẤY 1 BÀI VIẾT =======================
module.exports.getBlog = async (id) => {
    return await Blog.findById(id);
};

// ======================= CẬP NHẬT BÀI VIẾT =======================
module.exports.updateBlog = async (req, id) => {
    let thumbnail = req.body.thumbnail;

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path);
        thumbnail = uploadResult.secure_url;
    }

    return await Blog.updateOne(
        { _id: id },
        {
            title: req.body.title,
            slug: slugify(req.body.title, { lower: true, strict: true }),
            content: req.body.content,
            thumbnail
        }
    );
};

// ======================= XÓA BÀI VIẾT =======================
module.exports.deleteBlog = async (id) => {
    return await Blog.deleteOne({ _id: id });
};
