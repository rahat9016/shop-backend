const multer = require("multer");
const path = require("path");

const store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    let _unique_name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + _unique_name);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb({ message: "Only PNG/JPG formate supported!" }, false);
  }
}

const upload = multer({
  storage: store,
  limits: 1024 * 1024,
  fileFilter: fileFilter,
});
module.exports = upload;
