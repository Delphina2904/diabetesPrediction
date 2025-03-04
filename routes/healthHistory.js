const express = require('express');
const { getHealthHistory, addHealthRecord } = require('../controllers/healthHistoryController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getHealthHistory);
router.post('/', authMiddleware, addHealthRecord);

module.exports = router;