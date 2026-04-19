const express = require("express");
const router = express.Router();
const ordersAdminCtrl = require("../../controllers/admin/orders.controller");



// API cho test Postman (trả về JSON)
router.get("/api", ordersAdminCtrl.indexApi); // GET /admin/orders/api
router.get("/api/:id", ordersAdminCtrl.detailApi); // GET /admin/orders/api/:id
router.post("/api/:id/status", ordersAdminCtrl.updateStatusApi); // POST /admin/orders/api/:id/status

// View (render giao diện)
router.get("/", ordersAdminCtrl.index);
router.get("/:id", ordersAdminCtrl.detail);
router.post("/:id/status", ordersAdminCtrl.updateStatus);

module.exports = router;
