const authService = require('../../services/admin/auth.service')
const sysConfig = require('../../config/system')

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
        req.flash('success', 'Đăng nhập thành công!');

        res.redirect(`${sysConfig.prefixAdmin}/dashboard`);
        
    } catch (err) {
        console.log(err)
        switch (err.message) {
            case "EMAIL_NOT_FOUND":
                req.flash('error', 'Email không tồn tại!');
                break;

            case "PASSWORD_ERROR":
                req.flash('error', 'Mật khẩu không đúng!');
                break;

            case "ACCOUNT_BLOCK":
                req.flash('error', 'Tài khoản đã bị khóa!');
                break;

            default:
                req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
                break;
        }

        res.redirect(`${sysConfig.prefixAdmin}/auth/login`);
    }
};

// [POST] /admin/auth/logout
module.exports.logout = (req, res) => {
    authService.logout(res)

    res.redirect(`${sysConfig.prefixAdmin}/auth/login`);
}

