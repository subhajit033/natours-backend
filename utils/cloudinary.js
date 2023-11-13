const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloud = async (localFileName) => {
  try {
    if (!localFileName) return null;
    //upload the file on clodinary
    //clodinary is alreday installed ass v2
    const filePath = path.join(
      __dirname,
      '..',
      'public',
      'temp',
      localFileName
    );
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
    });
    //file uploaded successfully
    fs.unlinkSync(filePath);
    console.log('file is uploaded in clodinary ', response.url);
    return response.url;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(filePath); //remove the localy save tempory file, as the upload operation got failed
    return null;
  }
};

// cloudinary.v2.uploader.upload(
//   'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
//   { public_id: 'olympic_flag' },
//   function (error, result) {
//     console.log(result);
//   }
// );

module.exports = { uploadOnCloud };
