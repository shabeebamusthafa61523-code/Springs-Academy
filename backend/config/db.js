import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const FALLBACK_ATLAS_URI = 'mongodb+srv://shabeeba:9995982324@cluster0.i23tzbf.mongodb.net/springs-academy?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || FALLBACK_ATLAS_URI;
    console.log(`Attempting MongoDB connection...`);
    
    // Set connection timeout options
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 8000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Ensure internet connection is active or MONGODB_URI is set correctly.');
    throw error;
  }
};

export default connectDB;
