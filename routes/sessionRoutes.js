const express = require('express');
const router = express.Router();
const { assignDoctorToPatient } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, assignDoctorToPatient);

module.exports = router;
