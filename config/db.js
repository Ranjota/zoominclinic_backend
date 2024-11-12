const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const connectDB = async () => {
    // Database connection
    mongoose.connect(process.env.MONGO_URI, {
        dbName: 'zoominclinic_db'
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
}

module.exports = connectDB;
