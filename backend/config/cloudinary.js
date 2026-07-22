import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'davmqgfsq',
  api_key: process.env.CLOUDINARY_API_KEY || '393541385993731',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'O-_6rtJd1iQiOKomPSgOLMwU11s',
  secure: true
});

export default cloudinary;
