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
        // 👉 BẮT LỖI VALIDATE
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("client/pages/auth/login", {
                pageTitle: "Đăng nhập",
                error: null,
                errors: errors.array(),
                oldData: req.body
            });
        }

        try {
            await loginService.login(req, res);
            return res.redirect("/");

        } catch (err) {
            let errorMsg = "Có lỗi xảy ra, vui lòng thử lại!";

            if (err.message === "EMAIL_NOT_FOUND") {
                errorMsg = "Email không tồn tại!";
            }
            if (err.message === "PASSWORD_ERROR") {
                errorMsg = "Mật khẩu không đúng!";
            }

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
