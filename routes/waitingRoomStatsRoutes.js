const express = require('express');
const router = express.Router();
const { cancelAppointment, updateWaitingRoomDetails, getLiveQueueDetails } = require('../controllers/waitingRoomStatsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getWaitingRoomDetails );

router.put('/cancel', authMiddleware, cancelAppointment);

router.patch('/update', authMiddleware, updateWaitingRoomDetails);

router.get('/live', authMiddleware, getLiveQueueDetails)

module.exports = router;