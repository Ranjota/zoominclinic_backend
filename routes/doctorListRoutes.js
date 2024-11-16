const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const getDoctors = require('../controllers/doctorListController');

router.get('/', authMiddleware, getDoctors);

module.exports = router;