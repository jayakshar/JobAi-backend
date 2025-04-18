const auth = require("../controllers/auth.Controller");
const { verifyAuthToken } = require('../middleware/authJwt');
const upload = require("../middleware/multer");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );  
    next();
  });


  app.post("/register", auth.register);
  app.post("/login", auth.login);
  app.get("/candidate-profile", verifyAuthToken, auth.getProfile);
  app.put("/candidateProfile-update", verifyAuthToken, auth.updateProfile);
  app.post("/upload-cv", verifyAuthToken, upload.single("cv"), auth.uploadCv);
  app.get("/getJob", verifyAuthToken, auth.getJob);
};
