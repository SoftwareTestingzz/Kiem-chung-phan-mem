const passwordService = require("../../services/client/password.service");

// [GET] /password/forgot
module.exports.forgotPassword = async (req, res) => {
    try {
        res.render("client/pages/auth/forgot-password", {
            pageTitle: "Lấy lại mật khẩu"
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
        });
    }
};

// [POST] /password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    try {
        await passwordService.forgotPasswordPost(req);
        req.session.resetPasswordEmail = req.body.email;

        return res.json({
            success: true,
            message: 'Mã OTP đã được gửi vào email của bạn'
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
        });
    }
};

// [POST] /password/resend-otp
module.exports.resendOTP = async (req, res) => {
    try {
        await passwordService.resendOTP(req);
        
        return res.json({
            success: true,
            message: 'Mã OTP mới đã được gửi vào email của bạn'
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
        });
    }
};


// [GET] /password/verify-otp
module.exports.verityOtp = async (req, res) => {
    try {
        res.render("client/pages/auth/verify-otp", {
            pageTitle: "Xác nhận OTP",
            email: req.query.email
        });
 
    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
        });
    }
};

//  [POST] /password/verify-otp
module.exports.verityOtpPost = async (req, res) => {
    try {
        await passwordService.verifyOtpPost(req);
        
        return res.json({
            success: true,
            message: 'OTP đã được xác thực'
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
        });
    }
};

// [GET] /password/reset-password
module.exports.resetPassword = async (req, res) => {
    try {
        res.render("client/pages/auth/reset-password", {
            pageTitle: 'Đặt lại mật khẩu'
        });
 
    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
        });
    }
};

// [POST] /password/reset-password
module.exports.resetPasswordPost = async (req, res) => {
    try {
        const { validationResult } = require("express-validator");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        await passwordService.resetPasswordPost(req);
        
        return res.json({
            success: true,
            message: 'Đặt lại mật khẩu thành công!'
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
        });
    }
};