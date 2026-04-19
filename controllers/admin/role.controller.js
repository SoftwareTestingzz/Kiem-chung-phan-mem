const roleService = require('../../services/admin/role.service')
const sysConfig = require('../../config/system')
const respond = require('../../helper/respond')

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    try {
        const records = await roleService.getList()

        return respond(req, res, {
            status: 200,
            json: { success: true, records },
            render: {
                view: 'admin/pages/role/index',
                data: {
                    pageTitle: 'Phân quyền',
                    records
                }
            }
        })

    } catch (err) {
        console.log(err)
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        return respond(req, res, { status: 500, json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' }, redirect: `${sysConfig.prefixAdmin}/dashboard` })
    }
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    try {

        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Form tạo nhóm quyền' },
            render: {
                view: 'admin/pages/role/create',
                data: {
                    pageTitle: 'Tạo nhóm quyền',
                }
            }
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        return respond(req, res, { status: 500, json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' }, redirect: `${sysConfig.prefixAdmin}/roles` })
    }
}

// [POST] /admin/roles/create
module.exports.createRole = async (req, res) => {
    try {
        await roleService.createRole(req)
        return respond(req, res, {
            status: 201,
            json: { success: true, message: 'Tạo nhóm quyền thành công!' },
            redirect: `${sysConfig.prefixAdmin}/roles`
        })
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/roles`
        })
    }
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const role = await roleService.edit(req.params.id)

        return respond(req, res, {
            status: 200,
            json: { success: true, role },
            render: {
                view: 'admin/pages/role/edit',
                data: {
                    pageTitle: 'Tạo nhóm quyền',
                    role
                }
            }
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        return respond(req, res, { status: 500, json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' }, redirect: `${sysConfig.prefixAdmin}/roles` })
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editRole = async (req, res) => {
    try {
        await roleService.editRole(req.params.id)
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/roles/edit/${req.params.id}`
        })
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/roles`
        })
    }
}

// [DELETE] /admin/roles/delete-role/:id
module.exports.deleteRole = async (req, res) => {
    try {
        await roleService.deleteRole(req.params.id)
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Xóa nhóm quyền thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/roles`
        })
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/roles`
        })
    }
}

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const record = await roleService.detail(req.params.id)

        return respond(req, res, {
            status: 200,
            json: { success: true, ...record },
            render: {
                view: 'admin/pages/role/detail',
                data: {
                    pageTitle: 'Chi tiết nhóm quyền',
                    ...record
                }
            }
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        return respond(req, res, { status: 500, json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' }, redirect: `${sysConfig.prefixAdmin}/roles` })
    }
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    try {
        const records = await roleService.permissions(req.params.id)

        return respond(req, res, {
            status: 200,
            json: { success: true, records },
            render: {
                view: 'admin/pages/role/permissions',
                data: {
                    pageTitle: 'Thiết lập phân quyền',
                    records
                }
            }
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        return respond(req, res, { status: 500, json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' }, redirect: `${sysConfig.prefixAdmin}/roles` })
    }
}


// [PATCH] /admin/roles/permissions
module.exports.permissionsRole = async (req, res) => {
    try {
        await roleService.permissionsRole(req.body)
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật phân quyền thành công!' },
            redirect: `${sysConfig.prefixAdmin}/roles/permissions`
        })
    } catch (err) {
        console.log(err)
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: `${sysConfig.prefixAdmin}/roles/permissions`
        })
    }
}