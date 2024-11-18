const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PatientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase: true
    }, 
    passwordHash: {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    dob: Date,
    contactNumber: String,
    address: String,
    medicalHistory: Array
});

PatientSchema.pre('save', async function(next) {
    if(!this.isModified('passwordHash')) return next();
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
});

PatientSchema.methods.isPasswordMatch = async function (enteredPassword) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(enteredPassword, salt);
 
    return await bcrypt.compare(enteredPassword, this.passwordHash);
}

module.exports = mongoose.model('Patient', PatientSchema, 'patients');