const express = require("express");
const router = express.Router();
const ordersCtrl = require("../../controllers/client/orders.controller");

router.get("/", ordersCtrl.orderList);

router.get("/:id", ordersCtrl.orderDetail);


router.post("/:id/cancel", ordersCtrl.cancelOrder);

module.exports = router;