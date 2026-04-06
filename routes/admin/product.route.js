const express = require('express')
const router = express.Router()
const validate = require('../../validates/admin/product.validate')
const { validateId, validateStatus } = require('../../validates/admin/common.validate');

const multerError = require('../../middlewares/admin/multerError');
const upload = require("../../config/multer")
const controller = require('../../controllers/admin/product.controller')

router.get('/', controller.index)

router.patch('/change-status/:status/:id', validateStatus, validateId, controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete-product/:id', validateId, controller.deleteProduct)

router.get('/create', controller.create)

router.post('/create', upload.single('thumbnail'), multerError, validate.createPost, controller.createProduct)

router.get('/edit/:id', validateId, controller.edit)

router.patch('/edit/:id', validateId, upload.single('thumbnail'), multerError, validate.createPost, controller.editProduct)

router.get('/detail/:id', validateId, controller.detail)

module.exports = router