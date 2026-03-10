const express = require('express');
const router = express.Router();
const testDataController = require('../../controllers/admin/testData.controller');

router.post('/create', testDataController.createTestData);

module.exports = router;
