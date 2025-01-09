const mongoose = require('mongoose');

const doctorListSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    specialty: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }, 
    experience: {
        type: Number,
        required: true
    },
    photoUrl: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('DoctorList', doctorListSchema, 'doctors');