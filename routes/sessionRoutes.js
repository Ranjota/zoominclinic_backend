const express = require('express');
const router = express.Router();
const { assignDoctorToPatient, acceptSession } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/assign-doctor-by-patient', authMiddleware, assignDoctorToPatient);

router.post('/accept-session', authMiddleware, acceptSession);

module.exports = router;
