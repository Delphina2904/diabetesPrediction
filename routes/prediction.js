const express = require('express');
const { predictDiabetes } = require('../controllers/predictionController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, predictDiabetes);

module.exports = router;
