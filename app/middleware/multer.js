const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "app/uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
