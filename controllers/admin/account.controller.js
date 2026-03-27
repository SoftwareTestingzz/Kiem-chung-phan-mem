const accountService = require('../../services/admin/account.service');
const sysConfig = require('../../config/system');
const respond = require('../../helper/respond');

// =======================
// [GET] /admin/accounts
// =======================
module.exports.index = async (req, res) => {
    try {
        const records = await accountService.getList();

        res.render('admin/pages/account/index', {
            pageTitle: 'Quản lý tài khoản',
            records
        });

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`);
    }
};


// =======================
// [GET] /admin/accounts/create
// =======================
module.exports.create = async (req, res) => {
    try {
        const roles = await accountService.create();

        res.render('admin/pages/account/create', {
            pageTitle: 'Thêm mới tài khoản',
            roles
        });

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/accounts`);
    }
};


// =======================
// [POST] /admin/accounts/create
// =======================
module.exports.createAccount = async (req, res) => {
    try {
        await accountService.createAccount(req);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Tạo tài khoản thành công!' },
            redirect: `${sysConfig.prefixAdmin}/accounts`
        });
    } catch (err) {
        const msg = err.message === "EMAIL_EXISTS"
            ? 'Email đã tồn tại, vui lòng chọn email khác!'
            : 'Có lỗi xảy ra, vui lòng thử lại!';
        return respond(req, res, {
            status: 400,
            json: { success: false, message: msg },
            redirect: 'back'
        });
    }
};


// =======================
// [PATCH] /admin/accounts/change-status/:status/:id
// =======================
module.exports.changeStatus = async (req, res) => {
    try {
        const { id, status } = req.params;
        await accountService.changeStatus(id, status);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật trạng thái thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
        });
    }
};

module.exports.deleteAccount = async (req, res) => {
    try {
        await accountService.deleteAccount(req.params.id);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Xóa tài khoản thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
        });
    }
};


// =======================
// [GET] /admin/accounts/edit/:id
// =======================
module.exports.edit = async (req, res) => {
    try {
        const records = await accountService.edit(req);

        res.render('admin/pages/account/edit', {
            pageTitle: 'Chỉnh sửa tài khoản',
            ...records
        });

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/accounts`);
    }
};


// =======================
// [PATCH] /admin/accounts/edit/:id
// 🔥 CẬP NHẬT SESSION KHI ADMIN SỬA CHÍNH MÌNH
// =======================
module.exports.editAccount = async (req, res) => {
    try {
        const updatedAccount = await accountService.editAccount(req);

        if (
            req.session.user &&
            req.session.user._id &&
            req.session.user._id.toString() === req.params.id.toString()
        ) {
            req.session.user.fullName = updatedAccount.fullName;
            req.session.user.avatar = updatedAccount.avatar;
            req.session.user.phone = updatedAccount.phone;
            req.session.user.address = updatedAccount.address;
        }

        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật tài khoản thành công!' },
            redirect: `${sysConfig.prefixAdmin}/accounts/edit/${req.params.id}`
        });
    } catch (err) {
        const msg = err.message === "EMAIL_EXISTS"
            ? 'Email đã tồn tại, vui lòng chọn email khác!'
            : 'Có lỗi xảy ra, vui lòng thử lại!';
        return respond(req, res, {
            status: 400,
            json: { success: false, message: msg },
            redirect: `${sysConfig.prefixAdmin}/accounts/edit/${req.params.id}`
        });
    }
};


// =======================
// [GET] /admin/accounts/detail/:id
// =======================
module.exports.detail = async (req, res) => {
    try {
        const records = await accountService.detail(req);

        res.render('admin/pages/account/detail', {
            pageTitle: 'Chi tiết tài khoản',
            ...records
        });

    } catch (err) {
        req.flash('error', 'Không tìm thấy tài khoản!');
        res.redirect(`${sysConfig.prefixAdmin}/accounts`);
    }
};
