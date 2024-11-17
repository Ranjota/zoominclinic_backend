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

const searchDoctors = async (req, res) => {
   const {query} = req.query;

   try {
        const doctors = await DoctorsList.find({
            $or: [
                {name: {$regex: query, $options: 'i'}}, //Case insensitive name
                {specialty: {$regex: query, $options: 'i'}}, //Case insensitive specialty
            ]
        });  
        
        res.status(200).json(doctors);
   } catch(error) {
        console.error('Error during search:', error);
        res.status(500).json({message:'Failed to search doctors'});
   }
};


module.exports = {
    getDoctors,
    searchDoctors
};