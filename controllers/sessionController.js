const Session = require('../models/sessionModel');
const Doctor = require('../models/doctorListModel');

const assignDoctorToPatient = async (req, res) => {
    const { patientId } = req.body;

    try {
        // Step 2: Find the pending check-in record for the patient
        const checkInRecord = await CheckIn.findOne({ patientId, status: 'Pending' });
        if (!checkInRecord) return res.status(404).json({ message: 'No pending check-in found for this patient' });

        const doctor = await Doctor.findOne({available: true});

        if(!doctor) return res.status(404).json({message: 'No available doctors'});

        checkInRecord.doctorId = doctor._id;
        checkInRecord.status = 'Assigned'; 
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

module.exports = {assignDoctorToPatient};