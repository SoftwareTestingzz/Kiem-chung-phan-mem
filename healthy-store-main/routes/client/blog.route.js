const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/client/blog.controller");

// Danh sách blog (trang 1)
router.get("/", blogController.index);

// Danh sách blog (SEO page)
router.get("/page/:page", blogController.index);

// Chi tiết blog
router.get("/:slug", blogController.detail);

module.exports = router;
