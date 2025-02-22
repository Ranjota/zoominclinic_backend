const CheckIn = require('../models/checkInModel');
const DoctorList = require('../models/doctorListModel');
const config = require('../config/config');

/**
 * Get the average wait time per patient dynamically based on completed check-ins.
 * Falls back to a default value if no completed check-ins exist.
 * 
 * @returns {Promise<number>} Average wait time in minutes
 */
const getAverageWaitTimePerPatient = async () => {
    try {
        const completedCheckIns = await CheckIn.find({
            status: 'Completed',
            checkOutTime: { $exists: true }
        });

        if (!completedCheckIns || completedCheckIns.length === 0) {
            return config.defaultAverageWaitTime;
        }

        const totalWaitTime = completedCheckIns.reduce((accumulator, checkIn) => {
            const waitTime = (new Date(checkIn.checkOutTime) - new Date(checkIn.checkInTime)) / (1000 * 60);
            return accumulator + waitTime;
        }, 0);

        return Math.round(+totalWaitTime / +completedCheckIns.length);
    } catch (error) {
        console.error('Error calculating average wait time:', error);
        return config.defaultAverageWaitTime;
    }
}

/**
 * Fetch live data for real-time updates.
 * 
 * @returns {Promise<object>} The fetched live data
 */
const fetchLiveData = async (patientId = null) => {
    try {
        const stats = await calculateStats();
        const waitingRoom = await fetchWaitingRoomData(patientId);

        return {
            stats,
            waitingRoom
        }
    } catch (error) {
        console.error('Error fetching live data:', error);
        throw error;
    }
}

/**
 * Fetch waiting room data for real-time updates.
 * 
 * @returns {Promise<object>} The fetched waiting room data
 */
const fetchWaitingRoomData = async (patientId = null) => {
    try {
        let waitingRoom;
        // const liveQueueDetails = await CheckIn.aggregate([
        //     { $match: {status: 'Pending'}},
        //     {$sort: {checkInTime: 1}},
        //     {
        //         $group: {
        //             _id: null,
        //             totalPending: { $sum: 1},
        //             earliestCheckIn: {$first: '$checkInTime'}
        //         }
        //     }
        // ]);

        // let waitingRoom = {
        //     totalPending: liveQueueDetails?.[0]?.totalPending || 0,
        //     earliestCheckIn: liveQueueDetails?.[0]?.earliestCheckIn || null,
        // };

        // Fetch patient-specific details if patientId is provided
        if (patientId) {
            const checkIn = await CheckIn.findOne({ patientId, status: 'Pending' });
            const totalPatientsPending = await CheckIn.countDocuments({ status: 'Pending' });


            if (checkIn) {
                const positionInQueue = await CheckIn.countDocuments({
                    status: 'Pending',
                    checkInTime: { $lt: new Date(checkIn.checkInTime) },
                });

                const averageWaitTimePerPatient = await getAverageWaitTimePerPatient();
                const estimatedWaitTime = positionInQueue * averageWaitTimePerPatient;

                waitingRoom = {
                    averageWaitTimePerPatient: averageWaitTimePerPatient,
                    totalPatientsPending,
                    estimatedWaitTime: `${estimatedWaitTime} minutes`,
                    positionInQueue: positionInQueue + 1,
                    totalDoctorsOnline: await DoctorList.countDocuments({ available: true }),
                    reasonForVisit: checkIn.reason,
                };
            }
        }

        return waitingRoom;
    } catch (error) {
        console.error('Error fetching live data:', error);
        throw error;
    }
}

/**
 * Calculate the time elapsed since a check-in.
 * 
 * @param {Date} checkInTime - The time of the check-in
 * @returns {string} The formatted time elapsed
 */
const calculateStats = async () => {
    try {
        const totalDoctorsOnline = await DoctorList.countDocuments({ available: true });
        const totalPatients = await CheckIn.countDocuments({ status: 'Pending' });
        const averageWaitTimePerPatient = await getAverageWaitTimePerPatient();

        const stats = {
            totalDoctorsOnline,
            totalPatients,
            averageWaitTime: `${averageWaitTimePerPatient} minutes`,
            updatedAt: new Date()
        }

        return stats;
    }
    catch (error) {
        console.error('Error calculating stats:', error);
        throw error;
    }
}

const calculateAverageWaitTime = (checkInTime) => {
    const now = new Date();
    const diffMs = now - checkInTime; // Difference in milliseconds

    const hours = Math.floor(diffMs / 3600000); // Convert milliseconds to hours
    const minutes = Math.floor((diffMs % 3600000) / 60000); // Remaining minutes
    const seconds = Math.floor((diffMs % 60000) / 1000); // Remaining seconds

    return `${hours}h ${minutes}m ${seconds}s`;
}

module.exports = {
    getAverageWaitTimePerPatient,
    fetchLiveData,
    fetchWaitingRoomData,
    calculateStats,
    calculateAverageWaitTime
};