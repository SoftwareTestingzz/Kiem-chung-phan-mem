const productService = require('../../services/admin/product.service')
const sysConfig = require('../../config/system')

// [GET] /admin/products
module.exports.index = async (req, res) => {
    try {
        const data = await productService.getList(req.query)

        res.render('admin/pages/product/index', {
            pageTitle: 'Sản phẩm',
            ...data
        })
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`)
    }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const { id, status } = req.params
        await productService.changeStatus(id, status)

        req.flash('success', 'Cập nhật trạng thái thành công!')
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
    }

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/products`)
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { type, ids } = req.body

        const result = await productService.changeMulti(type, ids.split(','))

        req.flash(result.status, result.message)
    } catch (err) {
        console.log(err)
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
    }

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/products`)
}

// [DELETE] /admin/products/delete-product/:id
module.exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id)

        req.flash('success', 'Xóa sản phẩm thành công!')
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
    }

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    try{
        const categories = await productService.create()

        res.render('admin/pages/product/create', {
            pageTitle: 'Thêm sản phẩm mới',
            categories
        })
    }catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/products`)
    }
}

// [POST] /admin/products/create
module.exports.createProduct = async (req, res) => {
    try {
        await productService.createProduct(req, res)

        req.flash('success', 'Thêm sản phẩm thành công!')
        res.redirect(`${sysConfig.prefixAdmin}/products`)
    } catch (err) {
        console.log(err)
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/products`)
    }
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const records = await productService.edit(req.params.id)

        res.render('admin/pages/product/edit', {
            pageTitle: 'Chỉnh sửa sản phẩm',
            ...records
        })
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/products`)
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editProduct = async (req, res) => {
    try {
        const updated = await productService.editProduct(req, req.params.id, res)

        if (!updated) {
            req.flash('error', 'Sản phẩm không tồn tại!')
            return res.redirect(`${sysConfig.prefixAdmin}/products`)
        }

        req.flash('success', 'Cập nhật sản phẩm thành công!')
        res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/products/edit/${req.params.id}`)
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/products`)
    }
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const product = await productService.detail(req.params.id)

        if (!product) {
            req.flash('error', 'Sản phẩm không tồn tại!')
            return res.redirect(`${sysConfig.prefixAdmin}/products`)
        }

        res.render('admin/pages/product/detail', {
            pageTitle: product.title,
            product
        })
    } catch (err) {
        console.log(err)
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/products`)
    }
}
