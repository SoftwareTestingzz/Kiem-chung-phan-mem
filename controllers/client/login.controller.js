const loginService = require("../../services/client/login.service");
const { validationResult } = require("express-validator");

module.exports = {
    renderLogin: (req, res) => {
        res.render("client/pages/auth/login", {
            pageTitle: "Đăng nhập",
            error: null,
            errors: [],
            oldData: {}
        });
    },

    handleLogin: async (req, res) => {
        // Kiểm tra xem Yêu cầu có đến từ Postman / API không
        const isApi = req.headers.accept && req.headers.accept.includes('application/json');

        // 👉 BẮT LỖI VALIDATE
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (isApi) return res.json({ success: false, message: errors.array()[0].msg });
            return res.render("client/pages/auth/login", {
                pageTitle: "Đăng nhập",
                error: null,
                errors: errors.array(),
                oldData: req.body
            });
        }

        try {
            await loginService.login(req, res);
            if (isApi) return res.json({ success: true, message: "Đăng nhập thành công" });
            return res.redirect("/");

        } catch (err) {
            let errorMsg = "Có lỗi xảy ra, vui lòng thử lại!";

            if (err.message === "EMAIL_NOT_FOUND") {
                errorMsg = "Email không tồn tại!";
            }
            if (err.message === "PASSWORD_ERROR") {
                errorMsg = "Mật khẩu không đúng!";
            }

            if (isApi) return res.json({ success: false, message: errorMsg });
            return res.render("client/pages/auth/login", {
                pageTitle: "Đăng nhập",
                error: errorMsg,
                errors: [],
                oldData: req.body
            });
        }
    },

    logout: (req, res) => {
        loginService.logout(req, res);
        res.redirect("/login");
    }
};
