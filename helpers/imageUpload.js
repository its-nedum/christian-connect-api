const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ImageUpload = {
    uploadToCloudinary(image) {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(image.tempFilePath, {folder: 'Christian Connect/images'} , (err, url) => {
            if (err) return reject(err);
            return resolve(url);
          });
        });
      },

}

module.exports = ImageUpload;