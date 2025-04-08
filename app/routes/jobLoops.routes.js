const jobLoop = require("../controllers/jobLoop.Controller");
const { verifyAuthToken } = require("../middleware/authJwt");

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post("/addJobLoop", verifyAuthToken, jobLoop.addJobLoop);
    app.get("/getAllJobLoop", verifyAuthToken, jobLoop.jobLoopList);
    app.get("/getJobLoop/:id", verifyAuthToken, jobLoop.jobLoopDetail);
}    