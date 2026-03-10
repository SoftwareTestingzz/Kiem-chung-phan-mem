const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/dashboard.controller')
const authApiMiddleware = require('../../middlewares/admin/authApi.middleware')

router.get('/', controller.dashboard)

router.get('/revenue/day', authApiMiddleware.requireAuthAPI, controller.revenueDay)
router.get('/revenue/month', authApiMiddleware.requireAuthAPI, controller.revenueMonth)
router.get('/revenue/quarter', authApiMiddleware.requireAuthAPI, controller.revenueQuarter)
router.get('/revenue/year', authApiMiddleware.requireAuthAPI, controller.revenueYear)

router.post('/export-excel', authApiMiddleware.requireAuthAPI, controller.exportExcel)
router.post('/export-word', authApiMiddleware.requireAuthAPI, controller.exportWord)

module.exports = router
