const multer = require('multer');
const path = require('path');

const fileStoragePath = path.join(__dirname, '..', 'File');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fileStoragePath);
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname; 
    cb(null, name);
  },
 
});


const upload = multer({ storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB (adjust to your needs)
  } });

module.exports = {
  upload,
};
