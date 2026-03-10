const express = require("express");
const router = express.Router();
const ordersAdminCtrl = require("../../controllers/admin/orders.controller");

// /admin/orders
router.get("/", ordersAdminCtrl.index);
router.get("/:id", ordersAdminCtrl.detail);
router.post("/:id/status", ordersAdminCtrl.updateStatus);

module.exports = router;
