const CheckIn = require('../models/checkInModel');
const { fetchWaitingRoomData } = require('../utils/waitTimeStatsUtils');

const checkIn = async (req, res) => {
    try {
        const { reason, cancelExisting, cancellationReason } = req.body;

        // Validate that reason is provided
        if (!reason && !cancelExisting) {
            return res.status(400).json({ message: 'Reason for visit is required' });
        }

        // Check if the user already has an active check-in
        const existingCheckIn = await CheckIn.findOne({
            patientId: req.user.id,
            status: 'Pending',
        });

        if (existingCheckIn || cancelExisting) {
            if (cancelExisting) {
                // Cancel the existing check-in if the user wants to
                existingCheckIn.status = 'Canceled';
                existingCheckIn.cancellationReason = (cancellationReason || 'Create a new request');
                await existingCheckIn.save();  // Ensure we save the canceled record

                if(cancellationReason) {
                    return res.status(200).json({
                        success: true,
                        message: 'Request has been canceled'
                    });
                }
            } else {
                // Return a message if the user already has a pending check-in
                return res.status(200).json({
                    message: 'Continue with existing check in.',
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
