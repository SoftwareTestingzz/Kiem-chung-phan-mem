const sysConfig = require('../../config/system');
const respond = require('../../helper/respond');

module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập Tiêu đề sản phẩm!');
        return respond(req, res, {
            status: 400,
            json: { success: false, message: 'Vui lòng nhập Tiêu đề sản phẩm!' },
            redirect: `${sysConfig.prefixAdmin}/products/create`
        });
    }

    if (req.body.title.length < 5) {
        req.flash('error', 'Tiêu đề phải có ít nhất 5 ký tự!');
        return respond(req, res, {
            status: 400,
            json: { success: false, message: 'Tiêu đề phải có ít nhất 5 ký tự!' },
            redirect: `${sysConfig.prefixAdmin}/products/create`
        });
    }

    if (!req.body.description) {
        req.flash('error', 'Vui lòng nhập Mô tả sản phẩm!');
        return respond(req, res, {
            status: 400,
            json: { success: false, message: 'Vui lòng nhập Mô tả sản phẩm!' },
            redirect: `${sysConfig.prefixAdmin}/products/create`
        });
    }

    const price = parseFloat(req.body.price);
    if (isNaN(price) || price < 0) {
        req.flash('error', 'Giá sản phẩm không hợp lệ (phải là số >= 0)!');
        return respond(req, res, {
            status: 400,
            json: { success: false, message: 'Giá sản phẩm không hợp lệ (phải là số >= 0)!' },
            redirect: `${sysConfig.prefixAdmin}/products/create`
        });
    }

    const stock = parseInt(req.body.stock);
    if (isNaN(stock) || stock < 0) {
        req.flash('error', 'Số lượng sản phẩm không hợp lệ (phải là số nguyên >= 0)!');
        return respond(req, res, {
            status: 400,
            json: { success: false, message: 'Số lượng sản phẩm không hợp lệ (phải là số nguyên >= 0)!' },
            redirect: `${sysConfig.prefixAdmin}/products/create`
        });
    }

    next();
};