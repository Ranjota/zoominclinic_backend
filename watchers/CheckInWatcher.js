const CheckIn  = require('../models/checkInModel');
const { triggerLiveUpdates } = require('../controllers/waitingRoomStatsController');

const watchCheckIns = () => {
    const changeStream = CheckIn.watch();

    changeStream.on('change', (change) => {
        // console.log('Change detected in CheckIn collection:', change);

        if(change.operationType === 'update' || change.operationType === 'insert') {
            triggerLiveUpdates();
        }
    });

    changeStream.on('error', (err) => {
        console.error('Error in CheckIn change stream:', err);
    });
};

module.exports = watchCheckIns;