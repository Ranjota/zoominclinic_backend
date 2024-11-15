const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const sseHandler  = require('../controllers/sseHandler');

router.get('/', getStats);

router.get('/live', sseHandler);

module.exports = router;