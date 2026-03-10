const express = require("express");
const router = express.Router();

const checkoutController = require("../../controllers/client/checkout.controller");
const { placeOrderValidates } = require("../../validates/client/checkout.validates");

// POST từ giỏ hàng → checkout
router.post("/", checkoutController.renderCheckout);

// đặt hàng
router.post("/place-order",placeOrderValidates,checkoutController.placeOrder
);

module.exports = router;
