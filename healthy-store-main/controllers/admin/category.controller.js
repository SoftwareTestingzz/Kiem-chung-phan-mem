const categoryService = require('../../services/admin/category.service')
const sysConfig = require('../../config/system')

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
        const { id, status } = req.params
        await categoryService.changeStatus(id, status)

        req.flash('success', 'Cập nhật trạng thái thành công!')
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
    }

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/categories`)
}

// [PATCH] /admin/categories/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { type, ids } = req.body

        const result = await categoryService.changeMulti(type, ids.split(','))

        req.flash(result.status, result.message)
    } catch (err) {
        console.log(err)
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
    }

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/categories`)
}

// [DELETE] /admin/categories/delete-category/:id
module.exports.deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id)

        req.flash('success', 'Xóa danh mục thành công!')
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
    }

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/categories`)
}

// [GET] /admin/categories/create
module.exports.create = async (req, res) => {
    try {
        const records = await categoryService.create()

        res.render('admin/pages/category/create', {
            pageTitle: 'Tạo danh mục sản phẩm',
            records
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/categories`)
    }
}

// [POST] /admin/categories/create
module.exports.createCategory = async (req, res) => {
    try {
        await categoryService.createCategory(req)

        req.flash('success', 'Thêm doanh mục thành công!')
        res.redirect(`${sysConfig.prefixAdmin}/categories`)

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/categories`)
    }
}

// [GET] /admin/categories/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const data = await categoryService.edit(req.params.id)

        res.render('admin/pages/category/edit', {
            pageTitle: 'Chỉnh sửa danh mục sản phẩm',
            ...data
        })

    } catch (err) {
        console.log(err)
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/categories`)
    }
}

// [PATCH] /admin/categories/edit/:id
module.exports.editCategory = async (req, res) => {
    try {
        await categoryService.editCategory(req)

        req.flash('success', 'Cập nhật doanh mục thành công!')
        res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/categories/edit/${req.params.id}`)

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/categories`)
    }
}