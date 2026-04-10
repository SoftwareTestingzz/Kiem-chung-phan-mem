const loginService = require("../../services/client/login.service");
const { validationResult } = require("express-validator");
const respond = require("../../helper/respond");

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return respond(req, res, {
                status: 400,
                json: { success: false, errors: errors.array() },
                render: { view: "client/pages/auth/login", data: { pageTitle: "Đăng nhập", error: null, errors: errors.array(), oldData: req.body } }
            });
        }

        try {
            await loginService.login(req, res);
            return respond(req, res, {
                status: 200,
                json: { success: true, message: "Đăng nhập thành công!" },
                redirect: "/"
            });

        } catch (err) {
            const statusMap = {
                EMAIL_NOT_FOUND: 401,
                PASSWORD_ERROR:  401,
                ACCOUNT_BLOCK:   403
            };
            const errorMap = {
                EMAIL_NOT_FOUND: "Email không tồn tại!",
                PASSWORD_ERROR:  "Mật khẩu không đúng!",
                ACCOUNT_BLOCK:   "Tài khoản đã bị khóa!"
            };
            const status   = statusMap[err.message] || 500;
            const errorMsg = errorMap[err.message]  || "Có lỗi xảy ra, vui lòng thử lại!";

            return respond(req, res, {
                status,
                json: { success: false, message: errorMsg },
                render: { view: "client/pages/auth/login", data: { pageTitle: "Đăng nhập", error: errorMsg, errors: [], oldData: req.body } }
            });
        }
    },

    logout: (req, res) => {
        loginService.logout(req, res);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: "Đăng xuất thành công!" },
            redirect: "/login"
        });
    }
};
