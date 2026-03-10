const sysConfig = require('../../config/system');

module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập Tiêu đề sản phẩm!');
        res.redirect(`${sysConfig.prefixAdmin}/products/create`);
        return;
    }

    if (req.body.title.length < 5) {
        req.flash('error', 'Tiêu đề phải có ít nhất 5 ký tự!');
        res.redirect(`${sysConfig.prefixAdmin}/products/create`); 
        return;
    }

    if (!req.body.description) {
        req.flash('error', 'Vui lòng nhập Mô tả sản phẩm!');
        res.redirect(`${sysConfig.prefixAdmin}/products/create`);
        return;
    }

    const price = parseFloat(req.body.price);
    if (isNaN(price) || price < 0) {
        req.flash('error', 'Giá sản phẩm không hợp lệ (phải là số >= 0)!');
        res.redirect(`${sysConfig.prefixAdmin}/products/create`);
        return;
    }

    const stock = parseInt(req.body.stock);
    if (isNaN(stock) || stock < 0) {
        req.flash('error', 'Số lượng sản phẩm không hợp lệ (phải là số nguyên >= 0)!');
        res.redirect(`${sysConfig.prefixAdmin}/products/create`);
        return;
    }

    next();
};