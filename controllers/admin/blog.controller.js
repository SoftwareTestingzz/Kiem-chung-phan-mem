const blogService = require("../../services/admin/blog.service");
const sysConfig = require("../../config/system");
const respond = require("../../helper/respond");

module.exports = {

    // ================================
    // [GET] /admin/blog
    // ================================
    index: async (req, res) => {
        try {
            const result = await blogService.getList(req.query);

            // chuẩn bị query string cho phân trang
            const qs = new URLSearchParams(req.query);
            qs.delete("page"); // không cho page trùng
            const baseQuery = qs.toString();

            res.render("admin/pages/blog/index", {
                pageTitle: "Quản lý Blog",
                blogs: result.docs,
                totalBlogs: result.total,
                page: result.page,
                totalPages: result.totalPages,

                // giữ trạng thái filter
                keyword: req.query.keyword || "",
                sort: req.query.sort || "newest",
                filterMonth: req.query.month || "",
                filterYear: req.query.year || "",

                yearOptions: result.years,
                baseQuery
            });

        } catch (err) {
            console.error("BLOG INDEX ERROR:", err);
            req.flash("error", "Không thể tải danh sách blog!");
            res.redirect(`${sysConfig.prefixAdmin}/dashboard`);
        }
    },


    // [GET] /admin/blog/create
    create: (req, res) => {
        res.render("admin/pages/blog/create", {
            pageTitle: "Thêm bài viết"
        });
    },


    // [POST] /admin/blog/create

    store: async (req, res) => {
        try {
            await blogService.createBlog(req);
            return respond(req, res, {
                status: 201,
                json: { success: true, message: 'Thêm bài viết thành công!' },
                redirect: '/admin/blog'
            });
        } catch (err) {
            console.error("BLOG CREATE ERROR:", err);
            return respond(req, res, {
                status: 500,
                json: { success: false, message: 'Có lỗi xảy ra khi tạo bài viết!' },
                redirect: '/admin/blog/create'
            });
        }
    },


    // [GET] /admin/blog/edit/:id

    edit: async (req, res) => {
        try {
            const blog = await blogService.getBlog(req.params.id);

            if (!blog) {
                req.flash("error", "Bài viết không tồn tại!");
                return res.redirect("/admin/blog");
            }

            res.render("admin/pages/blog/edit", {
                pageTitle: "Sửa bài viết",
                blog
            });

        } catch (err) {
            console.error("BLOG EDIT ERROR:", err);
            req.flash("error", "Không thể tải bài viết!");
            res.redirect("/admin/blog");
        }
    },

    // [POST] /admin/blog/edit/:id

    update: async (req, res) => {
        try {
            await blogService.updateBlog(req, req.params.id);
            return respond(req, res, {
                status: 200,
                json: { success: true, message: 'Cập nhật bài viết thành công!' },
                redirect: '/admin/blog'
            });
        } catch (err) {
            console.error("BLOG UPDATE ERROR:", err);
            return respond(req, res, {
                status: 500,
                json: { success: false, message: 'Lỗi cập nhật!' },
                redirect: `/admin/blog/edit/${req.params.id}`
            });
        }
    },

    // [GET] /admin/blog/delete/:id

    delete: async (req, res) => {
        try {
            await blogService.deleteBlog(req.params.id);
            return respond(req, res, {
                status: 200,
                json: { success: true, message: 'Xóa bài viết thành công!' },
                redirect: '/admin/blog'
            });
        } catch (err) {
            console.error("BLOG DELETE ERROR:", err);
            return respond(req, res, {
                status: 500,
                json: { success: false, message: 'Không thể xóa bài viết!' },
                redirect: '/admin/blog'
            });
        }
    }
};
