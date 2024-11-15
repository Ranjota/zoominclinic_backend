const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const sseHandler  = require('../controllers/sseHandler');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getStats);

router.get('/live', authMiddleware, sseHandler);

module.exports = router;