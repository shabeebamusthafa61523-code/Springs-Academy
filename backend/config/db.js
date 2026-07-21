import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/academy-office';
    console.log(`Attempting MongoDB connection to: ${connStr}`);
    
    // Set connection timeout options
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Ensure MongoDB is installed and running, or provide a valid MONGODB_URI in the environment variables.');
    // We will not exit here to allow running with an in-memory/mock fallback if needed, 
    // or let server handle the error gracefully.
    throw error;
  }
};

export default connectDB;
