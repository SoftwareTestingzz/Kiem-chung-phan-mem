const express = require("express");
const router = express.Router();

const cartController = require("../../controllers/client/cart.controller");

router.get("/", cartController.index);

router.post("/add", cartController.add);

router.post("/update", cartController.update);

router.post("/delete", cartController.delete);

router.post("/clear", cartController.clear);

module.exports = router;
