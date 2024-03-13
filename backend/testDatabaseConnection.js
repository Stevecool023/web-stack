const { MongoClient } = require('mongodb');

// MongoDB Atlas connection string
const uri= 'mongodb+srv://tallmankaranjastevey:ANTZH8Ao0CdP2CiH@cluster0.rewm74h.mongodb.net/webstack?retryWrites=true&w=majority&appName=Cluster0';

// Function to test the connection
async function testConnection() {
  try {
    // Connect to MongoDB Atlas
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Connection successful
    console.log('Connected to MongoDB Atlas');

    // Perform additional operations here if needed

    // Close the connection
    await client.close();
  } catch (error) {
    // Connection failed
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

// Call the function to test the connection
testConnection();
