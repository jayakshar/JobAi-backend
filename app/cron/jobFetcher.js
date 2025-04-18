// cron/jobFetcher.js

const cron = require("node-cron");
const axios = require("axios");
const { db } = require("../models"); // Importing Sequelize models
const Job = db.job; // Job model

const APP_ID = "d525ac0b";
const APP_KEY = "da7855a27f5c4becd8f49b6821cff803";

// Embedded APP_ID and APP_KEY in the URL directly
const API_URL = `http://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=200&what=javascript developer`;

const fetchAndSaveJobs = async () => {
    try {
        const response = await axios.get(API_URL);

        const jobs = response.data.results;

        for (const job of jobs) {
            const [newJob, created] = await Job.findOrCreate({
                where: { adjuna_id: job.id },
                defaults: {
                    title: job.title,
                    category: job.category?.label || null,
                    description: job.description,
                    location: Array.isArray(job.location.area)
                        ? job.location.area.join(", ")
                        : job.location.area || "",
                    country: job.location?.country || "",
                    state: job.location?.state || "",
                    city: job.location?.city || "",
                    company: job.company?.display_name || "",
                    latitude: job.latitude || null,
                    longitude: job.longitude || null,
                    min_salary: job.salary_min || null,
                    max_salary: job.salary_max|| null,
                    contract_type: job.contract_type || "",
                    job_url: job.redirect_url || "",
                    contract_time: job.contract_time || "",
                    source: "Adzuna",
                    server_created_date: new Date(),
                }
            });

            if (created) {
                console.log(`Saved job: ${job.title}`);
            } else {
                console.log(` Job already exists: ${job.title}`);
            }
        }
    } catch (error) {
        console.error(" Error fetching and saving jobs:", error.message);
    }
};

// Run every 5 minutes
cron.schedule("0 0 * * *", fetchAndSaveJobs);
// cron.schedule("*/5 * * * *", fetchAndSaveJobs);
// cron.schedule("*/1 * * * *", fetchAndSaveJobs);

console.log("⏰ Cron job scheduled to fetch and save jobs every 5 minutes.");

