#!/usr/bin/node

// Import necessary modules
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

// Route handler for getting all patients
router.get('/', patientController.getAllPatients);

// Route handler for getting a patient by ID
router.get('/:id', patientController.getPatientById);

// Route handler for creating a new patient
router.post('/', patientController.createPatient);

// Route handler for updating a patient by ID
router.put('/:id', patientController.updatePatientById);

// Route handler for deleting a patient by ID
router.delete('/:id', patientController.deletePatientById);

// Route handler for patient login
router.post('/login', patientController.patientLogin);

// Protected routes requiring authentication
router.get('/', authMiddleware, patientController.getAllPatients);
router.get('/:id', authMiddleware, patientController.getPatientById);
router.post('/', authMiddleware, patientController.createPatient);
router.put('/:id', authMiddleware, patientController.updatePatientById);
router.delete('/:id', authMiddleware, patientController.deletePatientById);

// Route handler for updating patient profile
router.put('/profile', authMiddleware, patientController.updatePatientProfile);

module.exports = router;
