const mongoose = require("mongoose");

const checkInSchema = mongoose.Schema({
   patientId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
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
    enum: ['Pending', 'Completed', 'Canceled'],
    default: 'Pending'
   }
});

module.exports = mongoose.model('CheckIn', checkInSchema, 'checkIns');