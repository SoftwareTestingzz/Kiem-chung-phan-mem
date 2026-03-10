const blogService = require("../../services/admin/blog.service");
const sysConfig = require("../../config/system");

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
            req.flash("success", "Thêm bài viết thành công!");
        } catch (err) {
            console.error("BLOG CREATE ERROR:", err);
            req.flash("error", "Có lỗi xảy ra khi tạo bài viết!");
        }
        res.redirect("/admin/blog");
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
            req.flash("success", "Cập nhật bài viết thành công!");
        } catch (err) {
            console.error("BLOG UPDATE ERROR:", err);
            req.flash("error", "Lỗi cập nhật!");
        }
        res.redirect("/admin/blog");
    },

    // [GET] /admin/blog/delete/:id
   
    delete: async (req, res) => {
        try {
            await blogService.deleteBlog(req.params.id);
            req.flash("success", "Xóa bài viết thành công!");
        } catch (err) {
            console.error("BLOG DELETE ERROR:", err);
            req.flash("error", "Không thể xóa bài viết!");
        }
        res.redirect("/admin/blog");
    }
};
