const Patient = require('../models/patientModel');
const ActiveSession = require('../models/ActiveSession');
const jwt = require('jsonwebtoken');
const { addActiveSession } = require('../utils/activeSessionsCache');
require('dotenv').config();

const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const patient = await Patient.findOne({email}).setOptions({ new: true });;
        if(!patient) {
            return res.status(400).json( {message: 'Invalid email or password'});
        }

        const isMatch = await patient.isPasswordMatch(password);
        
        if(!isMatch) {
            return res.status(400).json( {message: 'Invalid email or password'});
        }

        const token = jwt.sign({ id: patient._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

       await addActiveSession(patient._id.toString());

        res.json({
            token,
            patient : {
                id: patient._id,
                name: patient.name,
                email: patient.email
            }     
        });
    } catch(error) {
        res.status(500).json({message: 'Server error'});
    }
}

module.exports = login;