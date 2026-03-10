const express = require('express')
const router = express.Router()

const controller = require('../../controllers/admin/role.controller')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', controller.createRole)

router.get('/edit/:id', controller.edit)

router.patch('/edit/:id', controller.editRole)

router.delete('/delete-role/:id', controller.deleteRole)

router.get('/detail/:id', controller.detail)

router.get('/permissions', controller.permissions)

router.patch('/permissions', controller.permissionsRole)

module.exports = router  