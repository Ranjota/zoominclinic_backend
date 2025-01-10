const express = require('express');
const router = express.Router();
const { assignDoctorToPatient } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/assign-doctor-by-patient', authMiddleware, assignDoctorToPatient);

module.exports = router;
