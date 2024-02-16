#!/usr/bin/node

const jwt = require('jsonwebtoken')
const Patient = require('../models/patient');

const authMiddleware = async (req, res, next) => {
  // Extract token from request headers
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied, token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find patient by decoded ID
    const patient = await Patient.findById(decoded.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Attach patient object to request for further processing
    req.patient = patient;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
