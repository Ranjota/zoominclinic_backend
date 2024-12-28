const CheckIn = require('../models/checkInModel');
const DoctorList = require('../models/doctorListModel');
const EventEmitter = require('events');
const { getAverageWaitTimePerPatient, calculateAverageWaitTime, fetchLiveData} = require('../utils/waitTimeStatsUtils');
const statsUtils = require('../utils/waitTimeStatsUtils');
const ActiveSession = require('../models/ActiveSession');

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(0);

const getWaitingRoomDetails = async (req, res) => {
    try{
       const { id: patientId } = req.user;

       const checkIn = await CheckIn.findOne({ patientId, status: 'Pending'});

       if(!checkIn) {
         return res.status(404).json({message: 'No active check-in found for the patient'});
       }

     const totalPatientsOnline = await CheckIn.countDocuments({
        status: 'Pending'
      });

       const positionInQueue = await CheckIn.countDocuments({
         status: 'Pending',
         checkInTime: { $lt: checkIn.checkInTime}
       });

       const averageWaitTimePerPatient = await getAverageWaitTimePerPatient();
       const estimatedWaitTime = positionInQueue * averageWaitTimePerPatient;

       const totalDoctorsOnline = await DoctorList.countDocuments({
            available: true 
        });

        res.status(200).json({
            waitTimeSoFar: calculateAverageWaitTime(checkIn.checkInTime),
            estimatedWaitTime: `${estimatedWaitTime} minutes`,
            positionInQueue: positionInQueue + 1,
            checkInTime: checkIn.checkInTime,
            totalPatientsOnline,
            totalDoctorsOnline,
            reasonForVisit: checkIn.reason
        });

    } catch(error) {
        console.error('Error fetching waiting room details:', error);
        res.status(500).json({message: 'Failed to fetch waiting room details.'});
    }
};

const cancelAppointment = async (req, res) => {
    try{
        const {patientId} = req.user;

        const appointment = await CheckIn.findOneAndUpdate(
            {patientId, status: 'Pending'},
            {status: 'Canceled'},
            {new: true}
        );

        if(!appointment) {
            return res.status(404).json({message: 'No active appointment found to cancel.'});
        }

         // Trigger live updates
         await triggerLiveUpdates();

        res.status(200).json({message: 'Appointment canceled successfully.', appointment});
    } catch(error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({message: 'Failed to cancel appointment.'});
    }
}

const updateWaitingRoomDetails = async (req, res) => {
    try{
        const {patientId} = req.body;
        const { positionInQueue, estimatedWaitTime } = req.body;

        const updateDetails = await CheckIn.findOneAndUpdate(
            {patientId, status: 'Pending'},
            {
                positionInQueue,
                estimatedWaitTime
            },
            {new: true}
        );

        if(!updateDetails) {
            return res.status(404).json({message: 'No active appointment found to update'});
        }

        // Trigger live updates
        await triggerLiveUpdates();

        res.status(200).json({message: 'Waiting room details updated.', updateDetails});
    } catch(error) {
        console.error('Error updating waiting room details:', error);
        res.status(500).json({message: 'Failed to update waiting room details.'});
    }
}

const getLiveQueueDetails = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Requested-With', 'XMLHttpRequest');

    res.write('event: connected\n');
    res.write('data: "Connected to live updates"\n\n');

    const sendUpdate = (update) => {
        res.write(`event: update\n`);
        res.write(`data: ${JSON.stringify(update)}\n\n`);
    }
    
    eventEmitter.on('update', sendUpdate);

    // // req.on('close', () => {
    // //     eventEmitter.removeListener('update', sendUpdate);
    // // });
}

const triggerLiveUpdates = async (patientId) => {
    try { 
          const liveUpdate = await fetchLiveData(patientId);
          eventEmitter.emit('update', liveUpdate);
    } catch(error) {
        console.error('Error triggering live updates:', error);
    }
}


module.exports = {
    getWaitingRoomDetails,
    cancelAppointment,
    updateWaitingRoomDetails,
    getLiveQueueDetails,
    triggerLiveUpdates
};