const auth = require("../controllers/auth.Controller");
const { verifyAuthToken } = require('../middleware/authJwt');

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
    app.get("/get-profile", verifyAuthToken, auth.getProfile);
    app.put("/update-profile", verifyAuthToken, auth.updateProfile);
    
};
  