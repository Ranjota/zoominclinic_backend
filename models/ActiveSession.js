const mongoose = require('mongoose');

const ActiveSessionSchema = new mongoose.Schema({
    sessionId: { 
        type: String,
        required: true,
        unique: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

ActiveSessionSchema.index({ expiresAt: 1}, { expireAfterSeconds: 0});

module.exports = mongoose.model('ActiveSession', ActiveSessionSchema);