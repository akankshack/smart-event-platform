const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_event_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Do not crash the process automatically in a dev/student environment
    // to allow front-end routing tests even without a running Mongo service.
    console.log('MongoDB server might not be running. Proceeding anyway...');
  }
};

module.exports = connectDB;
