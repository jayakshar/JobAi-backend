const auth = require("../../controllers/admin/adminAuth.Controller");
const { verifyAuthToken } = require('../../middleware/authJwt');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/admin-register", auth.adminRegister);
  app.post("/admin-login", auth.adminLogin);
  app.get("/admin-profile", verifyAuthToken, auth.getAdminProfile);
}    