const categoryService = require('../../services/admin/category.service');
const sysConfig = require('../../config/system');
const respond = require('../../helper/respond');

// [GET] /admin/categories
module.exports.index = async (req, res) => {
    try {
        const records = await categoryService.getList(req.query)

        res.render('admin/pages/category/index', {
            pageTitle: 'Danh mục sản phẩm',
            ...records
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`)
    }
}

// [PATCH] /admin/categories/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const { id, status } = req.params;
        await categoryService.changeStatus(id, status);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật trạng thái thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [PATCH] /admin/categories/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { type, ids } = req.body;
        const result = await categoryService.changeMulti(type, ids.split(','));
        return respond(req, res, {
            status: 200,
            json: { success: true, message: result.message },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [DELETE] /admin/categories/delete-category/:id
module.exports.deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Xóa danh mục thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [POST] /admin/categories/create
module.exports.createCategory = async (req, res) => {
    try {
        await categoryService.createCategory(req);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Thêm danh mục thành công!' },
            redirect: `${sysConfig.prefixAdmin}/categories`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [PATCH] /admin/categories/edit/:id
module.exports.editCategory = async (req, res) => {
    try {

        await categoryService.createCategory(req)
        const record = await categoryService.createCategory(req);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Thêm danh mục thành công!', data: { _id: record._id } },
            redirect: `${sysConfig.prefixAdmin}/categories`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/categories`
        });
    }
}


        req.flash('success', 'Thêm doanh mục thành công!')
        res.redirect(`${sysConfig.prefixAdmin}/categories`)

        await categoryService.editCategory(req);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật danh mục thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories/edit/${req.params.id}`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [GET] /admin/categories/create
module.exports.create = async (req, res) => {
    try {
        const tree = await categoryService.create(req)
        res.render('admin/pages/category/create', {
            pageTitle: 'Thêm danh mục',
            tree
        })
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/categories`)
    }
}

// [GET] /admin/categories/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const { data, tree } = await categoryService.edit(req.params.id)
        res.render('admin/pages/category/edit', {
            pageTitle: 'Chỉnh sửa danh mục',
            record: data,
            tree
        })
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/categories`)
    }
}
