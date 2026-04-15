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

            return respond(req, res, {
                status: 200,
                json: {
                    success: true,
                    blogs: result.docs,
                    totalBlogs: result.total,
                    page: result.page,
                    totalPages: result.totalPages,
                    keyword: req.query.keyword || "",
                    sort: req.query.sort || "newest",
                    filterMonth: req.query.month || "",
                    filterYear: req.query.year || "",
                    yearOptions: result.years,
                    baseQuery 
                },
                render: {
                    view: "admin/pages/blog/index",
                    data: {
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
                    }
                }
            });

        } catch (err) {
            console.error("BLOG INDEX ERROR:", err);
            req.flash("error", "Không thể tải danh sách blog!");
            return respond(req, res, { status: 500, json: { success: false, message: 'Không thể tải danh sách blog!' }, redirect: `${sysConfig.prefixAdmin}/dashboard` });
        }
    },


    // [GET] /admin/blog/create
    create: (req, res) => {
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Form thêm bài viết' },
            render: {
                view: "admin/pages/blog/create",
                data: {
                    pageTitle: "Thêm bài viết"
                }
            }
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
                return respond(req, res, { status: 404, json: { success: false, message: 'Bài viết không tồn tại!' }, redirect: "/admin/blog" });
            }

            return respond(req, res, {
                status: 200,
                json: { success: true, blog },
                render: {
                    view: "admin/pages/blog/edit",
                    data: {
                        pageTitle: "Sửa bài viết",
                        blog
                    }
                }
            });

        } catch (err) {
            console.error("BLOG EDIT ERROR:", err);
            req.flash("error", "Không thể tải bài viết!");
            return respond(req, res, { status: 500, json: { success: false, message: 'Không thể tải bài viết!' }, redirect: "/admin/blog" });
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
