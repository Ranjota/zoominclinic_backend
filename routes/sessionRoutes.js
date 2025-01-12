const express = require('express');
const router = express.Router();
const { assignDoctorToPatient, acceptSession, generateVideoToken } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/assign-doctor-by-patient', authMiddleware, assignDoctorToPatient);

router.post('/accept-session', authMiddleware, acceptSession);

router.post('/video-token', authMiddleware, generateVideoToken);

module.exports = router;
