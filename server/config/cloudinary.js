import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  allowedFormats: [
    'jpg',
    'svg',
    'png',
    'jpeg',
    'gif',
    'avi',
    'flv',
    'mpeg',
    '3gp',
    'mp4',
    'webm'
  ],
  params: {
    resource_type: 'auto',
    folder: 'teamvale/media'
  }
});

export default storage;
