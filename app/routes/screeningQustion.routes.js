const screeningQuestion = require('../controllers/screeningQustions.Controller');
const { verifyAuthToken } = require('../middleware/authJwt');
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });


    app.get("/screening-Questions", verifyAuthToken, screeningQuestion.screeningQustion);
    app.put('/screeningQustion-Update', verifyAuthToken, screeningQuestion.updateScreeningQustion);
}

