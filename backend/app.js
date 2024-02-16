#!/usr/bin/node
// This file is the entry point for the Express.js application. It will set up the server, define routes, and connect to the MongoDB database.

/* Import necessary modules */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

/* Initialize Express application */
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/hospital_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // createIndexes: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Define routes
const patientsRouter = require('./routes/patients');
app.use('/patients', patientsRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
