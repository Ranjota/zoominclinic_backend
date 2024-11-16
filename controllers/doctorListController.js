const DoctorsList = require('../models/doctorListModel');

const getDoctors = async (req, res) => {
    try{
        const doctorList = await DoctorsList.find({});
        res.json(doctorList);
    }catch(error){
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Failed to fetch doctors' });
    }
};

module.exports = getDoctors;