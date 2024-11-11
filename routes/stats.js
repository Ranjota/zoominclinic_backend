const express = require('express');
const router = express.Router();
const {getStats} = require('../controllers/statsController');

// console.log(getStats);
router.get('/stats', getStats);

module.exports = router;