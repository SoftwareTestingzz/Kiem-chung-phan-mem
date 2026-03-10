const { validationResult } = require("express-validator");
const registerService = require("../../services/client/register.service");

module.exports = {
    // ✅ GET /register
    renderRegister: (req, res) => {
        res.render("client/pages/auth/register", {
            pageTitle: "Đăng ký tài khoản",
            error: null,
            errors: [],
            oldData: {}
        });
    },

    // ✅ POST /register - bước 1: gửi OTP
    handleRegister: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("client/pages/auth/register", {
                pageTitle: "Đăng ký tài khoản",
                error: null,
                errors: errors.array(),
                oldData: req.body
            });
        }

        try {
            // ✅ Gửi OTP
            await registerService.registerStep1(req);

            return res.json({
                success: true,
                message: "OTP đã được gửi tới email của bạn"
            });

        } catch (err) {
            let errorMsg = "Lỗi hệ thống!";

            if (err.message === "EMAIL_EXISTS") {
                errorMsg = "Email đã tồn tại!";
            }

            return res.json({
                success: false,
                message: errorMsg
            });
        }
    },

    // ✅ GET /register/verify-otp - hiển thị form xác nhận OTP
    renderVerifyOtp: (req, res) => {
        res.render("client/pages/auth/verify-otp-register", {
            pageTitle: "Xác nhận OTP"
        });
    },

    // ✅ POST /register/verify-otp - bước 2: xác nhận OTP
    verifyOtp: async (req, res) => {
        try {
            await registerService.verifyOtpStep2(req);

            return res.json({
                success: true,
                message: "OTP xác thực thành công"
            });

        } catch (err) {
            return res.json({
                success: false,
                message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
            });
        }
    },

    // ✅ POST /register/create-account - bước 3: tạo tài khoản
    createAccount: async (req, res) => {
        try {
            await registerService.createAccountStep3(req);

            return res.json({
                success: true,
                message: "Tài khoản đã được tạo, vui lòng đăng nhập"
            });

        } catch (err) {
            return res.json({
                success: false,
                message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
            });
        }
    },

    // ✅ POST /register/resend-otp - gửi lại OTP
    resendOtp: async (req, res) => {
        try {
            await registerService.resendOtpRegister(req);

            return res.json({
                success: true,
                message: "OTP mới đã được gửi tới email của bạn"
            });

        } catch (err) {
            return res.json({
                success: false,
                message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
            });
        }
    }
};
