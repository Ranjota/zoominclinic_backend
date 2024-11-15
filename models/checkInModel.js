const mongoose = require("mongoose");

const checkInSchema = mongoose.Schema({
    checkInId: {
        type: String,
        required: true,
        unique: true
    },
    patientId: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    checkInTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
});

module.exports = mongoose.model('CheckIn', checkInSchema);