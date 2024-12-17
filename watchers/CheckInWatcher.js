const CheckIn  = require('../models/checkInModel');
const ActiveSession = require('../models/ActiveSession');
const { triggerLiveUpdates } = require('../controllers/waitingRoomStatsController');
const { getActiveSessions } = require('../utils/activeSessionsCache');

const watchCheckIns = () => {
    const changeStream = CheckIn.watch();
    changeStream.on('change', async (change) => {
        // console.log('Change detected in CheckIn collection:', change);

        if(change.operationType === 'update' || change.operationType === 'insert' || change.operationType === 'delete') {
           
           //Commenting it out to check for active sessions whenever there is an update
            // const activeSessions = await ActiveSession.find({});
            //If activeSessions retrieval is missing await, activePatientIds will likely be undefined or invalid.
            // const activePatientIds = activeSessions.map(session => session.patientId.toString());

            const activePatientIds = await getActiveSessions();


            // The first line (map) creates and starts the promises.
            //The second line (await Promise.all) ensures all the promises resolve before continuing.
            //map runs the callback function for all patientIds concurrently.
            // Each triggerLiveUpdates(patientId) is called immediately and returns a Promise.
            //All the promises start executing concurrently (in parallel) because triggerLiveUpdates is asynchronous.
            //If you want the triggerLiveUpdates function to execute sequentially (one by one), you would use a loop and await inside the loop:
            //map itself does not return Promises, but it returns an array of the callback’s return values.
            // Since your callback calls an async function (triggerLiveUpdates), the callback returns a Promise.
            // Thus, map produces an array of Promises.
            //The purpose of a callback is to defer execution of a function until a certain event or condition is met, whether synchronously or asynchronously.
            const promises = activePatientIds.map(patientId => triggerLiveUpdates(patientId));
            await Promise.all(promises);
        }
    });

    changeStream.on('error', (err) => {
        console.error('Error in CheckIn change stream:', err);
    });
};

module.exports = watchCheckIns;