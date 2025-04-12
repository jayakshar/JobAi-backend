const cvScanner = require("../controllers/cvScanner.Controller");
const { verifyAuthToken } = require("../middleware/authJwt");
const upload = require("../middleware/upload");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

      app.post('/cv-scanner', upload.single('cv'), verifyAuthToken, cvScanner.cvScanner);
      app.post('/cv-scanners', upload.single('cv'), verifyAuthToken, cvScanner.cvScanners);
}