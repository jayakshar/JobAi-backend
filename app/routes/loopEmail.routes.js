const loopEmial = require('../controllers/loopEmail.Controller');
 const { verifyAuthToken } = require('../middleware/authJwt');
 
 module.exports = function (app) {
     app.use(function (req, res, next) {
         res.header(
           "Access-Control-Allow-Headers",
           "x-access-token, Origin, Content-Type, Accept"
         );
         next();
       });
 
     app.post('/loop-emails/:loop_id/:email_id', verifyAuthToken, loopEmial.createLoopEmail);
     app.post('/addLoopEmail', verifyAuthToken, loopEmial.createOwnEmailTemaplte);//
     app.get('/getLoopEmail/:id', verifyAuthToken, loopEmial.getOneEmailTemplate);  
     app.get('/getAllLoopEmail', verifyAuthToken, loopEmial.getEmailTemplateList);
 }
