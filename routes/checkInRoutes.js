const express = require('express');
const router = express.Router();
const checkIn  = require('../controllers/checkInController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, checkIn);

module.exports = router;