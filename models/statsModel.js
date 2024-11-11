const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    totalDoctosOnline: {
        type: Number,
        required: true,
        default: 0
    },
    totalPatients: {
        type: Number,
        required: true,
        default: 0
    },
    averageWaitTime: {
        type: String,
        required: true,
        default: 'Loading...'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Stats', statsSchema, 'stats');