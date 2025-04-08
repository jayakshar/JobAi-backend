const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mdb = {};

mdb.mongoose = mongoose;
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.screeningsQuestion = require("./screeningQustion.model.js")(sequelize, Sequelize);
db.subscription = require("../models/subscription.model.js")(sequelize, Sequelize);
db.jobLoop = require("../models/jobLoops.model.js")(sequelize, Sequelize);
db.emailTemplate = require("../models/emailTemplate.model.js")(sequelize, Sequelize);
db.loopEmail = require("../models/loopEmail.model.js")(sequelize, Sequelize);

module.exports = { db, mdb };