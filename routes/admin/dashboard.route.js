const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/dashboard.controller')

router.get('/', controller.dashboard)

router.get('/revenue/day', controller.revenueDay)
router.get('/revenue/month', controller.revenueMonth)
router.get('/revenue/quarter', controller.revenueQuarter)
router.get('/revenue/year', controller.revenueYear)

router.post('/export-excel', controller.exportExcel)
router.post('/export-word', controller.exportWord)

module.exports = router
