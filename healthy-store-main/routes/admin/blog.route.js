const express = require("express");
const router = express.Router();
const upload = require("../../config/multer")

const blogAdminController = require("../../controllers/admin/blog.controller");

router.get("/", blogAdminController.index);

router.get("/create", blogAdminController.create);
router.post("/create",upload.single('thumbnail'), blogAdminController.store);

router.get("/edit/:id", blogAdminController.edit);
router.post("/edit/:id",upload.single('thumbnail'), blogAdminController.update);

router.get("/delete/:id", blogAdminController.delete);

module.exports = router;
