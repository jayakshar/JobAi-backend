const payment = require("../controllers/payment.Controller");
const { verifyAuthToken } = require("../middleware/authJwt");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/initiatePayment/:id', verifyAuthToken, payment.initiatePayment);
    app.post('/completePayment/:id', verifyAuthToken, payment.completePayment);
};

exports.compelete