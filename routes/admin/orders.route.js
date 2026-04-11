const express = require("express");
const router = express.Router();
const ordersAdminCtrl = require("../../controllers/admin/orders.controller");



// View (render giao diện)
router.get("/", ordersAdminCtrl.index);
router.get("/:id", ordersAdminCtrl.detail);
router.post("/:id/status", ordersAdminCtrl.updateStatus);

module.exports = router;
