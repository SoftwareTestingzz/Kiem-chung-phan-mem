const express = require('express')
const router = express.Router()
const validate = require('../../validates/admin/category.validate')
const { validateId, validateStatus } = require('../../validates/admin/common.validate');

const multerError = require('../../middlewares/admin/multerError');
const upload = require("../../config/multer")
const controller = require('../../controllers/admin/category.controller')

router.get('/', controller.index)

router.patch('/change-status/:status/:id', validateStatus, validateId, controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete-category/:id', validateId, controller.deleteCategory)

router.get('/create', controller.create)

router.post('/create', upload.single('thumbnail'), multerError, validate.createPost, controller.createCategory)

router.get('/edit/:id', validateId, controller.edit)

router.patch('/edit/:id', validateId, upload.single('thumbnail'), multerError, validate.createPost, controller.editCategory)

module.exports = router