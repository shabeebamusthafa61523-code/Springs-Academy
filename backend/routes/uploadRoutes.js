import express from 'express';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload image to Cloudinary and return CDN URL
// @access  Public / Authenticated
router.post('/', async (req, res) => {
  try {
    const { image, folder = 'springs_academy' } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'auto'
    });

    return res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image to Cloudinary',
      error: error.message
    });
  }
});

export default router;
