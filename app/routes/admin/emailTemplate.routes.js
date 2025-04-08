const emailTemplate = require("../../controllers/admin/emailTemplate.Controller");
const { verifyAuthToken } = require("../../middleware/authJwt");

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post("/create-emailTemplate", verifyAuthToken, emailTemplate.createEmailTemplate);
    app.put("/edit-emailTemplate/:id", verifyAuthToken, emailTemplate.updateEmailTemplate);
    app.get("/get-all-emailTemplate", verifyAuthToken, emailTemplate.getEmailTemplateList);
    app.delete("/delete-emailTemplate/:id", verifyAuthToken, emailTemplate.deleteEmailTemplate);
} 