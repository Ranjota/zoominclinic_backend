const mongoose = require("mongoose");

const checkInSchema = mongoose.Schema({
   patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
   },
   doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorList' // See how this has to be related to the waiting room model while presenting to the presenter
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
   checkOutTime: {
      type: Date
   },
   estimatedWaitTime: {
      type: Number, // Wait time in minutes
   },
   positionInQueue: {
      type: Number, // Patient's position in the waiting queue
   },
   status: {
      type: String,
      enum: ['Pending', 'Completed', 'Canceled'],
      default: 'Pending'
   }
}, {
   timestamps: true
});

module.exports = mongoose.model('CheckIn', checkInSchema, 'checkIns');