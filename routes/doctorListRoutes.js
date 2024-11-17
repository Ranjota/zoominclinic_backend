const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {getDoctors, searchDoctors} = require('../controllers/doctorListController');


router.get('/', authMiddleware, getDoctors);

router.get('/search', authMiddleware, searchDoctors);

module.exports = router;