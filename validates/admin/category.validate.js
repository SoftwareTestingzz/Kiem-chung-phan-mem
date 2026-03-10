const sysConfig = require('../../config/system');

module.exports.createPost = (req, res, next) => {

    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập Tên danh mục!');
        return res.redirect(`${sysConfig.prefixAdmin}/categories/create`);
    }

    if (req.body.title.length < 3) {
        req.flash('error', 'Tên danh mục phải có ít nhất 3 ký tự!');
        return res.redirect(`${sysConfig.prefixAdmin}/categories/create`);
    }

    if (req.body.description && req.body.description.length < 10) {
        req.flash('error', 'Mô tả danh mục phải có ít nhất 10 ký tự!');
        return res.redirect(`${sysConfig.prefixAdmin}/categories/create`);
    }

    const position = req.body.position;
    if (position && (isNaN(position) || position <= 0)) {
        req.flash('error', 'Vị trí không hợp lệ (phải là số nguyên >= 1)!');
        return res.redirect(`${sysConfig.prefixAdmin}/categories/create`);
    }


    if (!['active', 'inactive'].includes(req.body.status)) {
        req.flash('error', 'Trạng thái không hợp lệ!');
        return res.redirect(`${sysConfig.prefixAdmin}/categories/create`);
    }

    next();
};
