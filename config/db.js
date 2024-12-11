const mongoose = require('mongoose');
const dotenv = require('dotenv');
const watchCheckIns = require('../watchers/CheckInWatcher');
const watchDoctorList = require('../watchers/DoctorListWatcher');

dotenv.config();

const connectDB = async () => {
    // Database connection
    mongoose.connect(process.env.MONGO_URI, {
        dbName: 'zoominclinic_db'
    })
        .then(() => {
            console.log('Connected to MongoDB')

            // Start watchers after successful connection
            watchCheckIns();
            watchDoctorList();
        })
        .catch(err => console.error('Error connecting to MongoDB:', err));
}

module.exports = connectDB;
