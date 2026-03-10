const roleService = require('../../services/admin/role.service')
const sysConfig = require('../../config/system')

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    try {
        const records = await roleService.getList()

        res.render('admin/pages/role/index', {
            pageTitle: 'Phân quyền',
            records
        })

    } catch (err) {
        console.log(err)
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`)
    }
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    try {

        res.render('admin/pages/role/create', {
            pageTitle: 'Tạo nhóm quyền',
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/roles`)
    }
}

// [POST] /admin/roles/create
module.exports.createRole = async (req, res) => {
    try {
        await roleService.createRole(req)

        req.flash('success', 'Tạo nhóm quyền thành công!')
        res.redirect(`${sysConfig.prefixAdmin}/roles`)
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/roles`)
    }
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const role = await roleService.edit(req.params.id)

        res.render('admin/pages/role/edit', {
            pageTitle: 'Tạo nhóm quyền',
            role
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/roles`)
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editRole = async (req, res) => {
    try {
        await roleService.editRole(req.params.id)

        req.flash('success', 'Cập nhật thành công!')
        res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/categories/edit/${req.params.id}`)
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/roles`)
    }
}

// [DELETE] /admin/roles/delete-role/:id
module.exports.deleteRole = async (req, res) => {
    try {
        await roleService.deleteRole(req.params.id)

        req.flash('success', 'Xóa nhóm quyền thành công!')
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
    }

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/roles`)
}

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const record = await roleService.detail(req.params.id)

        res.render('admin/pages/role/detail', {
            pageTitle: 'Chi tiết nhóm quyền',
            ...record
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/roles`)
    }
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    try {
        const records = await roleService.permissions(req.params.id)

        res.render('admin/pages/role/permissions', {
            pageTitle: 'Thiết lập phân quyền',
            records
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/roles`)
    }
}


// [PATCH] /admin/roles/permissions
module.exports.permissionsRole = async (req, res) => {
    try {

        await roleService.permissionsRole(req.body)
        req.flash('success', 'Cập nhật phân quyền thành công!')

    } catch (err) {
        console.log(err)
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
    }
    res.redirect(`${sysConfig.prefixAdmin}/roles/permissions`)
}