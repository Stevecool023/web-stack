#!/usr/bin/node

// Import the patient model
const Patient = require('../models/patient');

// Importing necessary modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Controller function to get a patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a new patient
exports.createPatient = async (req, res) => {
  const patient = new Patient({
    nationalId: req.body.nationalId,
    password: req.body.password,
    medicalHistory: req.body.medicalHistory,
    familyHistory: req.body.familyHistory
  });

  try {
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to add a patient by ID
exports.updatePatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      patient.nationalId = req.body.nationalId || patient.nationalId;
      patient.password = req.body.password || patient.password;
      patient.medicalHistory = req.body.medicalHistory || patient.medicalHistory
      patient.familyHistory = req.body.familyHistory || patient.familyHistory;

      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to delete a patient by ID
exports.deletePatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      await patient.remove();
      res.json({ message: 'Patient deleted' });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function for patient login
exports.patientLogin = async (req, res) => {
  const { nationalId, password } = req.body;

  try {
    // Check if patient exists
    const patient = await Patient.findOne({ nationalId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token in response
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update patient profile
exports.updatePatientProfile = async (req, res) => {
  try {
    // Update patient's family History
    req.patient.familyHistory = req.body.familyHistory;
    await req.patient.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Controller function to get all patients with pagination
exports.getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    result.totalCount = await Patient.countDocuments().exec();
    if (endIndex < results.totalCount) {
      result.next = {
        page: page + 1,
        limit: limit
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.results = await Patient.find().limit(limit).skip(startIndex).exec();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patients. Please try again later.', error: error.message });
  }
};

// Controller function to search for patients by National ID
exports.searchPatients = async (req, res) => {
  try {
    const nationalId = req.query.nationalId;
    const patients = await Patient.find({ nationalId: { $regex: new RegExp(nationalId, 'i') } });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search patients', error: error.message });
  }
};

// Controller function to update patient password
exports.updatePatientPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // Update patient's password
    req.patient.password = newPassword;
    await req.patient.save();

    res.json({ message: 'Password udpated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update password', error: error.message });
  }
};
