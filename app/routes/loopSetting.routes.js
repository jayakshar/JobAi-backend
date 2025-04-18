const loopSetting = require("../controllers/loopSetting.Controller");
const { verifyAuthToken } = require("../middleware/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/loop-settings/:id', verifyAuthToken, loopSetting.createLoopSetting);
}