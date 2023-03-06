const fs = require("fs");
const { uploads } = require("./cloudDinary");

exports.uploadSingleImage = async (req, res) => {
  const uploader = async (path) => await uploads(path, "Shop");
  let uploadFile;
  if (req.method === "POST") {
    let { path } = req.file;
    uploadFile = await uploader(path);
    fs.unlinkSync(path);
  }
  return uploadFile;
};
exports.uploadMultipleImage = async (req, res) => {
  const uploader = async (path) => await uploads(path, "Shop");
  const urls = [];
  if (req.method === "POST") {
    // const urls = [];
    let files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      // console.log(newPath);
      urls.push({ url: newPath.url, id: newPath.id });
      fs.unlinkSync(path);
    }
  }
  return urls;
};
