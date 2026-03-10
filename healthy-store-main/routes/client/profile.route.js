const express = require("express");
const router = express.Router();

const upload = require("../../config/multer")
const profileController = require("../../controllers/client/profile.controller");

// Hiển thị profile
router.get("/", profileController.index);

// Cập nhật profile (AJAX)
router.post("/", upload.single("avatar"), profileController.updateProfile);

module.exports = router;
