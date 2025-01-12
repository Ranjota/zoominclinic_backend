const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    }, 
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    startTime: {
        type:Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['waiting', 'In Progress', 'ended'],
        default: 'waiting'
    }
});

module.exports = mongoose.model('Session', sessionSchema);
