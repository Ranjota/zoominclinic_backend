const Session = require('../models/sessionModel');
const Doctor = require('../models/doctorListModel');
const CheckIn = require('../models/checkInModel');
const Twilio = require('twilio');
const config = require('../config/config');

const assignDoctorToPatient = async (req, res) => {
    const  patientId = req.user.id;

    try {
        // Step 2: Find the pending check-in record for the patient
        const checkInRecord = await CheckIn.findOne({ patientId, status: 'Pending' });
        if (!checkInRecord) return res.status(404).json({ message: 'No pending check-in found for this patient' });

        const doctor = await Doctor.findOne({available: true});

        if(!doctor) return res.status(409).json({message: 'No available doctors'});

        checkInRecord.doctorId = doctor._id;
        checkInRecord.status = 'Doctor Assigned'; 
        await checkInRecord.save();

        doctor.available = false; 
        await doctor.save();

        const newSession = new Session({
            patientId,
            doctorId: doctor._id,
            status: 'waiting'
        });

        newSession.save();

        res.status(200).json({
            message: 'Doctor assigned successfully',
            doctor: doctor,
            checkInRecord: checkInRecord,
            session: newSession
        });
    } catch(err) {
        console.error('Error assigning doctor:', err);
        res.status(500).json({message: 'Error assgning doctor to patient'});
    }
}

const acceptSession = async (req, res) => {
    const patientId = req.user.id; // Get the patientId from the frontend request

    try {
        // Find the active session for the patient
        const session = await Session.findOne({ patientId, status: 'waiting' });

        if (!session) {
            return res.status(404).json({ message: 'Session not found or already started' });
        }

        // Update the session status to 'Started' or 'In Progress'
        session.status = 'In Progress';
        await session.save();

        // Optionally, update the patient's check-in status to 'Being Seen'
        const checkInRecord = await CheckIn.findOne({ patientId, status: 'Doctor Assigned' });
        if (checkInRecord) {
            checkInRecord.status = 'With Doctor'; // Update to indicate patient is now being seen
            await checkInRecord.save();
        }

        // Send response back with updated session information
        res.status(200).json({
            message: 'Session started successfully',
            session,
        });
    } catch (error) {
        console.error('Error accepting session:', error);
        res.status(500).json({ message: 'Error accepting session' });
    }
};

const generateVideoToken = (req, res) => {
    const identity = req.user.id;
    
    // const {TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET} = config;

    const grant = new Twilio.jwt.AccessToken.VideoGrant({
        room: 'room-name'
    });

    const AccessToken = Twilio.jwt.AccessToken;

    const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY_SID,
        process.env.TWILIO_API_KEY_SECRET,
        {identity: identity}
    );
    
    token.addGrant(grant);
    // token.identity = identity;

    res.json({ token: token.toJwt()});

}

module.exports = {assignDoctorToPatient, acceptSession, generateVideoToken};