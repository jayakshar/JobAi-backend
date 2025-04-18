const express = require("express");
const http = require('http');
const app = express();
require('dotenv').config();
const cors = require("cors");
const { APIChain } = require("langchain/chains");
app.use(cors({ origin: "*" }));
const { db } = require("./app/models"); // Correct import for Sequelize

// Sync the Sequelize models with the database
const { startCron } = require("./app/cron/jobFetcher");
module.exports = startCron;


// Sync the Sequelize models with the database
db.sequelize.sync().then(() => {
    console.log("Database synced.");
})
// app.use(express.json());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));


app.get("/", (req, res) => {
    res.json({ message: "Welcome to JOB AI API." });

});


// Admin Routes
const adminRoute = express.Router();

require("./app/routes/admin/adminAuth.routes")(adminRoute);
require("./app/routes/admin/subscription.routes")(adminRoute);
require("./app/routes/admin/emailTemplate.routes")(adminRoute);
require("./app/routes/admin/candidate.routes")(adminRoute);
require("./app/routes/admin/candidateJobLoop.routes")(adminRoute);

app.use("/api/admin", adminRoute);

// routes
const apiRouter = express.Router(); // Create a router for API routes

require("./app/routes/user.routes")(apiRouter);
require("./app/routes/screeningQustion.routes")(apiRouter);
require("./app/routes/jobLoops.routes")(apiRouter);
require("./app/routes/loopEmail.routes")(apiRouter);
require("./app/routes/loopSetting.routes")(apiRouter);
require("./app/routes/cvScanner.routes")(apiRouter);
require("./app/routes/payment.routes")(apiRouter)

app.use("/api", apiRouter); // Mount the API router under the /api prefix


// set port, listen for requests    
const PORT = process.env.PORT || 5005;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
