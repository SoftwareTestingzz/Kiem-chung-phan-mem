const categoryService = require('../../services/admin/category.service');
const sysConfig = require('../../config/system');
const respond = require('../../helper/respond');

// [GET] /admin/categories
module.exports.index = async (req, res) => {
    try {
        const records = await categoryService.getList(req.query)
        
        // Nếu có keyword mà không tìm thấy danh mục nào
        if (req.query.keyword && records.categories.length === 0) {
            req.flash("error", `Không tìm thấy danh mục nào với từ khóa: "${req.query.keyword}"`);
            return res.redirect(`${sysConfig.prefixAdmin}/categories`);
        }

        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Lấy dữ liệu thành công', data: records },
            render: { view: 'admin/pages/category/index', data: { pageTitle: 'Danh mục sản phẩm', ...records } }
        });
    } catch (err) {
        return respond(req, res, {
            status: err.status || 500,
            json: {
                success: false,
                message: err.message || 'Có lỗi xảy ra'
            },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
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
            status: err.status || 500,
            json: {
                success: false,
                message: err.message || 'Có lỗi xảy ra'
            },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [PATCH] /admin/categories/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { type, ids } = req.body;
        const result = await categoryService.changeMulti(type, ids);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: result.message },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    } catch (err) {
        return respond(req, res, {
            status: err.status || 500,
            json: {
                success: false,
                message: err.message || 'Có lỗi xảy ra'
            },
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
            status: err.status || 500,
            json: {
                success: false,
                message: err.message || 'Có lỗi xảy ra'
            },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [POST] /admin/categories/create
module.exports.createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Thêm danh mục thành công!', data: category },
            redirect: `${sysConfig.prefixAdmin}/categories`
        });
    } catch (err) {
        return respond(req, res, {
            status: err.status || 500,
            json: {
                success: false,
                message: err.message || 'Có lỗi xảy ra'
            },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [PATCH] /admin/categories/edit/:id
module.exports.editCategory = async (req, res) => {
    try {
        await categoryService.editCategory(req);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật danh mục thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories/edit/${req.params.id}`
        });
    } catch (err) {
        return respond(req, res, {
            status: err.status || 500,
            json: {
                success: false,
                message: err.message || 'Có lỗi xảy ra'
            },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [GET] /admin/categories/create
module.exports.create = async (req, res) => {
    try {
        const tree = await categoryService.create(req)
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Lấy dữ liệu thành công', data: { tree } },
            render: { view: 'admin/pages/category/create', data: { pageTitle: 'Thêm danh mục', tree } }
        });
    } catch (err) {
        return respond(req, res, {
            status: err.status || 500,
            json: {
                success: false,
                message: err.message || 'Có lỗi xảy ra'
            },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    }
}

// [GET] /admin/categories/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const { data, tree } = await categoryService.edit(req.params.id)
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Lấy dữ liệu thành công', data: { record: data, tree } },
            render: { view: 'admin/pages/category/edit', data: { pageTitle: 'Chỉnh sửa danh mục', data, tree } }
        });
    } catch (err) {
        return respond(req, res, {
            status: err.status || 500,
            json: {
                success: false,
                message: err.message || 'Có lỗi xảy ra'
            },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/categories`
        });
    }
}
