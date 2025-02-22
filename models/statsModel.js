const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    totalDoctorsOnline: {
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

statsSchema.statics.getLiveStats = async function() {
    try {
        return await this.findOne().sort({ updatedAt: -1});
    } catch(error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}

module.exports = mongoose.model('Stats', statsSchema, 'stats');