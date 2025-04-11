const candidate = require("../../controllers/admin/candidate.Controller");
const { verifyAuthToken } = require("../../middleware/authJwt");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

      app.get("/candidate-list", verifyAuthToken, candidate.candidateList);
      app.get("/candidate-detail/:id", verifyAuthToken, candidate.candidateDetail);
      app.put("/candidate-status-update/:id", verifyAuthToken, candidate.candidateStatusUpdate);
      app.put("/update-candidate/:id", verifyAuthToken, candidate.updateCandidate);
};