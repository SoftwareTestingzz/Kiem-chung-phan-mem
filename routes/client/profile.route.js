const express = require("express");
const router = express.Router();

const upload = require("../../config/multer")
const multerError = require("../../middlewares/admin/multerError");
const profileController = require("../../controllers/client/profile.controller");
const { updateProfileValidates } = require("../../validates/client/profile.validates");

// Hiển thị profile
router.get("/", profileController.index);

// Cập nhật profile (AJAX)
router.post("/", upload.single("avatar"), multerError, updateProfileValidates, profileController.updateProfile);

module.exports = router;
