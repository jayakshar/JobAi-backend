const candidateJoobLoop = require("../../controllers/admin/candidateJobLoop.Controller");
const { verifyAuthToken } = require("../../middleware/authJwt");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

      app.get('/candidate-jobLoop', verifyAuthToken, candidateJoobLoop.candidateJobLoop);
      app.get('/candidate-jobLoop-detail/:candidateId/loop/:jobLoopId', verifyAuthToken, candidateJoobLoop.loopDetail);
}