const DoctorsList = require('../models/doctorListModel');

const getDoctors = async (req, res) => {
    const {query, page = 1, limit = 10, doctorSpecialty, minRating, doctorAvailability} = req.query;
    const skip = (page - 1) * limit;

   try {
        let filter = {};

        if(query) {
            filter = {
                $or: [
                    {name: {$regex: query , $options: 'i'}}, //Case insensitive name
                    {specialty: { $regex: query, $options: 'i'}}, //Case insensitive specialty
                ]
            }
        }

        if(doctorSpecialty) {
            filter.specialty = { $regex: doctorSpecialty, $options: 'i'};
        }
        
        if(minRating) {
            filter.rating = { $gte: Number(minRating)}
        }

        if(doctorAvailability) {
            filter.available = doctorAvailability === 'true';
        }


        const total = await DoctorsList.countDocuments(filter);
        const doctorList = await DoctorsList.find(filter)
                                .skip(skip)
                                .limit(Number(limit));

        res.status(200).json({
            results: doctorList,
            total,
            page: Number(page),
            limit: Number(limit),
            hasMore: skip + doctorList.length < total
        });

   } catch(error) {
        console.error('Error during search:', error);
        res.status(500).json({message:'Failed to search doctors'});
   }
};

// const searchDoctors = async (req, res) => {
//    const {query} = req.query;

//    try {
//         const doctors = await DoctorsList.find({
//             $or: [
//                 {name: {$regex: query, $options: 'i'}}, //Case insensitive name
//                 {specialty: {$regex: query, $options: 'i'}}, //Case insensitive specialty
//             ]
//         });  
        
//         res.status(200).json(doctors);
//    } catch(error) {
//         console.error('Error during search:', error);
//         res.status(500).json({message:'Failed to search doctors'});
//    }
// };

const getDoctorDetails = async(req, res) => {
    const {doctorId} = req.params;

    try{
        const doctor = await DoctorsList.findById(doctorId);

        if(!doctor) {
            return res.status(404).json({message: 'Doctor not found'});
        }

        res.status(200).json(doctor);
    } catch(error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).json({ message: 'Failed to fetch doctor details' });
    }
}

module.exports = {
    getDoctors,
    getDoctorDetails
};