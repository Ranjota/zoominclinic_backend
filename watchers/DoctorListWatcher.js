const DoctorList = require('../models/doctorListModel');
const { triggerLiveUpdates } = require('../controllers/waitingRoomStatsController');

const watchDoctorList = () => {
    const changeStream = DoctorList.watch();

    changeStream.on('change', (change) => {
        console.log('Change detected in DoctorList collection', change);

        if(
            change.operationType === 'update' &&
            change.updateDescription 
            // &&
            // change.updateDescription.updateFileds.available === true
        ) {
            // triggerLiveUpdates();
        }
    });

    changeStream.on('error', (err) => {
        console.error('Error in DoctorList change stream:', err);
    });
};

module.exports = watchDoctorList;

