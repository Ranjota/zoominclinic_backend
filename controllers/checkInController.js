const CheckIn = require('../models/checkInModel');
const {fetchWaitingRoomData} = require('../utils/waitTimeStatsUtils');

const checkIn = async (req, res) => {
    try {
        const {reason, cancelExisting} = req.body;

        if(!reason) {
            return res.status(400).json({message: 'Reason for visit is required'});
        }

        const existingCheckIn = await CheckIn.findOne({
            patientId: req.user.id,
            status: 'Pending'
        });

        if(existingCheckIn) {
            if(cancelExisting) {
                existingCheckIn.status = 'Canceled';
                await existingCheckIn.save();
            } else {
                // const existingCheckInDetails = await fetchWaitingRoomData(existingCheckIn.patientId);

                const existingCheckInRecord = await CheckIn.findOne({
                    patientId: existingCheckIn.patientId,
                    status: 'Pending'
                });

                return res.status(200).json({
                    activeCheckIn: {data: existingCheckInRecord},
                    message: 'You already have a pending check-in. Cancel it to create a new one.'   
                });
            }        
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