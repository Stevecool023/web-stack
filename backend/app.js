#!/usr/bin/node
// This file is the entry point for the Express.js application. It will set up the server, define routes, and connect to the MongoDB database.

/* Import necessary modules */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

/* Initialize Express application */
const app = express();

// MOngodb uri
const uri = 'mongodb+srv://tallmankaranjastevey:ANTZH8Ao0CdP2CiH@cluster0.rewm74h.mongodb.net/webstack?retryWrites=true&w=majority&appName=Cluster0'
// const uri = 'mongodb+srv://tallmankaranjastevey:ANTZH8Ao0CdP2CiH@cluster0.mongodb.net/webstack'

// Middleware
app.use(bodyParser.json());
app.use(cors());
// server static files from the 'frontend' directory
app.use(express.static('../frontend'));

// Connect to MongoDB database
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // createIndexes: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Define routes
const patientsRouter = require('./routes/patients');
app.use('/patients', patientsRouter);

// Additional routes:
app.get('/', (req, res) => {
  res.sendFile(__dirname + '../frontend/index.html'); // Sending an HTML as the homepage
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
