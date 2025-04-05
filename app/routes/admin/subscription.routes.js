const subscription = require("../../controllers/admin/subscription.Controller");
const { verifyAuthToken } = require('../../middleware/authJwt');

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post('/create_Subscription', verifyAuthToken,subscription.addSubscription);
    app.get('/getAll_Subscription',verifyAuthToken, subscription.subscriptionList);
    app.put('/edit_Subscription/:id',verifyAuthToken,subscription.editSubscription);
    app.delete('/delete_Subscription/:id',verifyAuthToken, subscription.deleteSubscription);

}    