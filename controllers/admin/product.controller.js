const productService = require('../../services/admin/product.service');
const sysConfig = require('../../config/system');
const respond = require('../../helper/respond');

// [GET] /admin/products
module.exports.index = async (req, res) => {
    try {
        const data = await productService.getList(req.query)

        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Lấy dữ liệu thành công', data },
            render: { view: 'admin/pages/product/index', data: { pageTitle: 'Sản phẩm', ...data } }
        });
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/dashboard`
        });
    }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const { id, status } = req.params;
        await productService.changeStatus(id, status);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật trạng thái thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/products`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/products`
        });
    }
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { type, ids } = req.body;
        const result = await productService.changeMulti(type, ids.split(','));
        return respond(req, res, {
            status: 200,
            json: { success: true, message: result.message },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/products`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/products`
        });
    }
}

// [DELETE] /admin/products/delete-product/:id
module.exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Xóa sản phẩm thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/products`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/products`
        });
    }
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    try {
        const categories = await productService.create()

        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Lấy dữ liệu thành công', data: { categories } },
            render: { view: 'admin/pages/product/create', data: { pageTitle: 'Thêm sản phẩm mới', categories } }
        });
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/products`
        });
    }
}

// [POST] /admin/products/create
module.exports.createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req, res);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Thêm sản phẩm thành công!', data: product },
            redirect: `${sysConfig.prefixAdmin}/products`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/products`
        });
    }
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const records = await productService.edit(req.params.id)

        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Lấy dữ liệu thành công', data: records },
            render: { view: 'admin/pages/product/edit', data: { pageTitle: 'Chỉnh sửa sản phẩm', ...records } }
        });
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/products`
        });
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editProduct = async (req, res) => {
    try {
        const updated = await productService.editProduct(req, req.params.id, res);
        if (!updated) {
            return respond(req, res, {
                status: 404,
                json: { success: false, message: 'Sản phẩm không tồn tại!' },
                redirect: `${sysConfig.prefixAdmin}/products`
            });
        }
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật sản phẩm thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/products/edit/${req.params.id}`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/products`
        });
    }
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const product = await productService.detail(req.params.id)

        if (!product) {
            req.flash('error', 'Sản phẩm không tồn tại!')
            return respond(req, res, {
                status: 404,
                json: { success: false, message: 'Sản phẩm không tồn tại!' },
                redirect: `${sysConfig.prefixAdmin}/products`
            });
        }

        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Lấy dữ liệu thành công', data: { product } },
            render: { view: 'admin/pages/product/detail', data: { pageTitle: product.title, product } }
        });
    } catch (err) {
        console.log(err)
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/products`
        });
    }
}
