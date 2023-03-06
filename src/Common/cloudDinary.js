const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.API_CLOUD_NAME,
  api_key: process.env.API_CLOUD_KEY,
  api_secret: process.env.API_CLOUD_SECRET,
});

exports.uploads = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          url: result.url,
          id: result.public_id,
        });
      },
      {
        resource_type: "auto",
        folder: folder,
      }
    );
  });
};
exports.deleteImg = async (id) => {
  return await cloudinary.uploader.destroy(id);
};
