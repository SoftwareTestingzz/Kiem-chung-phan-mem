const blogService = require("../../services/client/blog.service");

// [GET] /blog
 
module.exports.index = async (req, res) => {
    try {
        // Page từ query (?page=1)
        const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;

        const result = await blogService.getList(req.query);

        res.render("client/pages/blog/index", {
            pageTitle: "Tin tức & Blog",

            // DỮ LIỆU CŨ (KHÔNG ĐỔI)
            blogs: result.data,
            page: result.page,
            totalPages: result.totalPages,

            // DỮ LIỆU BỔ SUNG (không dùng cũng không sao)
            hasPrev: page > 1,
            hasNext: page < result.totalPages,
            prevPage: page - 1,
            nextPage: page + 1,

            // Giữ keyword khi phân trang (nếu có)
            keyword: result.keyword || ""
        });
    } catch (err) {
        console.error(err);

        res.render("client/pages/blog/index", {
            pageTitle: "Tin tức & Blog",
            blogs: [],
            page: 1,
            totalPages: 1,
            hasPrev: false,
            hasNext: false,
            keyword: ""
        });
    }
};


 //* [GET] /blog/:slug
 
module.exports.detail = async (req, res) => {
    try {
        const result = await blogService.getDetail(req.params.slug);

        if (!result.success) {
            return res.render("client/pages/blog/detail", {
                pageTitle: result.message,
                blog: null
            });
        }

        res.render("client/pages/blog/detail", {
            pageTitle: result.data.title,
            blog: result.data
        });
    } catch (err) {
        res.render("client/pages/blog/detail", {
            pageTitle: "Lỗi hệ thống",
            blog: null
        });
    }
};
