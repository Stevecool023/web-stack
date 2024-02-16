#!/usr/bin/node

// Import necessary modules
const mongoose = require('mongoose');

// Define the patient schema
const patientSchema = new mongoose.Schema({
  nationalId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  medicalHistory: [{
    date: Date,
    hospital: String,
    diagnosis: String,
    medications: [String]
  }],
  familyHistory: {
    type: String
  }
});

// Create the patient model
const patient = mongoose.model('patient', patientSchema);

module.exports = patient;
