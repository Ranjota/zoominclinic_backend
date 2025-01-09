const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {getDoctors, getDoctorDetails} = require('../controllers/doctorListController');


router.get('/', authMiddleware, getDoctors);

// router.get('/search', authMiddleware, searchDoctors);

router.get('/doctor', authMiddleware, getDoctorDetails);

module.exports = router;