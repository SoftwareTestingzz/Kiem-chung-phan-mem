const authService = require('../../services/admin/auth.service');
const sysConfig = require('../../config/system');
const respond = require('../../helper/respond');

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    try {
        if (req.cookies.token) {
            res.redirect(`${sysConfig.prefixAdmin}/dashboard`);
        }else{
            res.render('admin/pages/auth/login', {
                pageTitle: 'Đăng nhập',
            });
        }

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        return res.redirect(`${sysConfig.prefixAdmin}/auth/login`);
    }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    try {
        await authService.loginPost(req, res);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: "Đăng nhập thành công!" },
            redirect: `${sysConfig.prefixAdmin}/dashboard`
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
            redirect: `${sysConfig.prefixAdmin}/auth/login`
        });
    }
};

// [POST] /admin/auth/logout
module.exports.logout = async (req, res) => {
    await authService.logout(req, res);
    return respond(req, res, {
        status: 200,
        json: { success: true, message: "Đăng xuất thành công!" },
        redirect: `${sysConfig.prefixAdmin}/auth/login`
    });
};

