const CheckIn = require('../models/checkInModel');

const checkIn = async (req, res) => {
    try {
        const {reason} = req.body;

        if(!reason) {
            return res.status(400).json({message: 'Reason for visit is required'});
        }

        const checkInRecord = new CheckIn({
            patientId: req.user.id,
            reason
        });

        await checkInRecord.save();

        res.json({
            success: true,
            message: 'Check-in successful',
            data: checkInRecord
        });

    } catch(error) {
        console.error('Error during check-in:', error);
        res.status(500).json({message: 'Check-in failed. Please try again later,'});
    }
};

module.exports = checkIn;