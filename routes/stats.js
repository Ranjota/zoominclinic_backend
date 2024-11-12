const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const sseHandler  = require('../controllers/sseHandler');

router.get('/stats', getStats);

router.get('/stats/live', sseHandler);

module.exports = router;