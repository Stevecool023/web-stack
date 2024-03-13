#!/usr/bin/node

// Import the patient model
const Patient = require('./patient');

// Function to add a patient
async function addPatient() {
  try {
    // Create a new patient instance
    const newPatient = new Patient({
      nationalId: '1234567890', // Example national ID
      password: 'password123', // Example password
      medical History: [
        {
          date: new Date('2023-01-15'),
          hospital: 'Hospital A',
          diagnosis: 'Flu',
          medications: ['Medication A, Medication B']
        }
      ],
      familyHistory: 'No significant family History'
    });

    // Save the patient instance to the database
    const savePatient = await newPatient.save();

    console.log('Patient added successfully:', savedPatient);
  } catch (error) {
    console.error('Error adding patient:', error);
  }
}

// call the function to add a patient
addPatient();
