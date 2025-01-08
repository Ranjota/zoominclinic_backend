const CheckIn = require('../models/checkInModel');
const { fetchWaitingRoomData } = require('../utils/waitTimeStatsUtils');

const checkIn = async (req, res) => {
    try {
        const { reason, cancelExisting } = req.body;

        // Validate that reason is provided
        if (!reason) {
            return res.status(400).json({ message: 'Reason for visit is required' });
        }

        // Check if the user already has an active check-in
        const existingCheckIn = await CheckIn.findOne({
            patientId: req.user.id,
            status: 'Pending',
        });

        if (existingCheckIn) {
            if (cancelExisting) {
                // Cancel the existing check-in if the user wants to
                existingCheckIn.status = 'Canceled';
                existingCheckIn.cancellationReason = reason;
                await existingCheckIn.save();  // Ensure we save the canceled record
                return res.status(200).json({
                    success: true,
                    message: 'Existing check-in canceled successfully.',
                    data: existingCheckIn,
                });
            } else {
                // Return a message if the user already has a pending check-in
                return res.status(200).json({
                    message: 'You already have a pending check-in. Cancel it to create a new one.',
                    activeCheckIn: existingCheckIn,
                });
            }
        }

        // If no existing check-in, create a new check-in record
        const newCheckIn = new CheckIn({
            patientId: req.user.id,
            reason,
            status: 'Pending', // Ensure the status is set to 'Pending'
        });

        const savedCheckIn = await newCheckIn.save();

        return res.status(201).json({
            success: true,
            message: 'Check-in successful.',
            data: savedCheckIn,
        });

    } catch (error) {
        console.error('Error during check-in:', error);
        return res.status(500).json({
            message: 'Check-in failed. Please try again later.',
            error: error.message || 'Unknown error',
        });
    }
};

module.exports = checkIn;
