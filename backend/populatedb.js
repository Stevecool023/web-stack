#!/usr/bin/node env

const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

// Connection URL
const url = 'mongodb+srv://tallmankaranjastevey:ANTZH8Ao0CdP2CiH@cluster0.rewm74h.mongodb.net/webstack?retryWrites=true&w=majority&appName=Cluster0';

// Database Name
const dbName = 'webstack';

// Read data from JSON file
const data = JSON.parse(fs.readFileSync('patients.json', 'utf8'));

// Function to insert data into MongoDB
async function populateDatabase() {
  const client = new MongoClient(url); //, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('patients');

    // Insert data into collection
    await collection.insertMany(data);
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    client.close();
    console.log('Connection to MongoDB closed');
  }
}

// Call the function to populate the database
populateDatabase();
