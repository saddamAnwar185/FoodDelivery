const cloudinary = require('cloudinary').v2;
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDNERY_NAME,  // Replace with your Cloudinary Cloud Name
    api_key: process.env.CLOUDNERY_API_KEY,        // Replace with your Cloudinary API Key
    api_secret: process.env.CLOUDNERY_SECRET,  // Replace with your Cloudinary API Secret
  });

  module.exports = cloudinary