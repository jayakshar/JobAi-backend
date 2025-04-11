const { db } = require("../models");
const JobLoop = db.jobLoop;
const moment = require("moment");
const User = db.user;
const LoopSetting = db.loopSettings;
const EmailTemplate = db.emailTemplate;


// exports.addJobLoop = async (req, res) => {
//     try {
//         const userId = req.user?.id || '';
//         console.log("user id", userId);
//         const { title, location, is_remote,experience, job_type, updated_cv, status, total_applied_jobs } = req.body
//         console.log("Body", req.body);

//         if (!userId) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "User ID is required."
//             });
//         }
//         if (!title || !location || typeof is_remote === 'undefined'|| !experience || !job_type || !updated_cv || !status ||  typeof total_applied_jobs === 'undefined') {
//             return res.status(400).json({
//                 status: 400,
//                 message: "All field are required."
//             });
//         }

//         const createJobLoop = await JobLoop.create({
//             user_id: userId,
//             title,
//             location,
//             experience,
//             is_remote,
//             job_type,
//             updated_cv,
//             status,
//             total_applied_jobs,
//             created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
//         });


//         if (!createJobLoop) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Job loop not created."
//             });
//         }

//         return res.status(200).json({
//             status: 201,
//             message: "Job loop created successfully.",
//             data: createJobLoop
//         });

//     } catch (error) {
//         console.error("Add job loop error:", error);
//         return res.status(500).json({ status: 500 ,message: "Internal server error" , data : {}});
//     }
// };


exports.createJobLoopWithSettingsAndTemplate = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        if (!userId) {
            return res.status(400).json({ status: 400, message: "User ID is required.", data: {} });
        }

        // Destructure fields from body
        const {
            title, location, is_remote, experience, job_type, updated_cv,
            status, total_applied_jobs,
            auto_send_emails, auto_fill_application, cover_letter, excluded_company,
            email_template // { title, subject, body, status }
        } = req.body;

        // Validate job loop required fields
        if (!title || !location || typeof is_remote === 'undefined' || !experience || !job_type || !updated_cv || !status || typeof total_applied_jobs === 'undefined') {
            return res.status(400).json({ status: 400, message: "All Job Loop fields are required." });
        }

        // Validate loop setting required fields
        if (!cover_letter || !excluded_company || (!auto_send_emails && !auto_fill_application)) {
            return res.status(400).json({ status: 400, message: "Loop settings are incomplete." });
        }

        // Step 1: Create Job Loop
        const jobLoop = await JobLoop.create({
            user_id: userId,
            title,
            location,
            experience,
            is_remote,
            job_type,
            updated_cv,
            status,
            total_applied_jobs,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss")
        });

        // Step 2: Create Loop Setting
        const loopSettings = await LoopSetting.create({
            loop_id: jobLoop.id,
            auto_send_emails: auto_send_emails ?? 0,
            auto_fill_application: auto_fill_application ?? 0,
            cover_letter,
            excluded_company
        });

        // Step 3 (optional): Create Email Template if provided
        let createdTemplate = null;
        if (email_template?.title && email_template?.subject && email_template?.body) {
            const validStatus = ['draft', 'active', 'inactive'];
            const templateStatus = validStatus.includes(email_template.status) ? email_template.status : 'draft';

            createdTemplate = await EmailTemplate.create({
                title: email_template.title,
                subject: email_template.subject,
                body: email_template.body,
                status: templateStatus,
                user_id: userId
            });
        }

        // Success Response
        return res.status(201).json({
            status: 201,
            message: "Job loop, settings, and email template (if any) created successfully.",
            data: {
                jobLoop,
                loopSettings,
                emailTemplate: createdTemplate
            }
        });

    } catch (error) {
        console.error("Create full job loop error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
    }
};

exports.jobLoopList = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        console.log("user id", userId);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            })
        }
        const jobLoops = await JobLoop.findAll({
            where: {
                user_id: userId
            },
            order: [['created_at', 'DESC']]
        });
        if (!jobLoops) {
            return res.status(404).json({
                status: 404,
                message: "No Job Loops found"
            })
        }
        return res.status(200).json({
            status: 200,
            message: "Job loop list retrieved successfully.",
            data: jobLoops
        });
    } catch (error) {
        console.error("Job loop list error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: {} });
    }
};

exports.jobLoopDetail = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const jobLoopId = req.params.id || '';
        console.log("user id", userId);
        console.log("job loop id", jobLoopId);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            })
        }
        if (!jobLoopId) {
            return res.status(400).json({
                status: 400,
                message: "Job Loop ID is required."
            })
        }
        const jobLoop = await JobLoop.findOne({
            where: {
                id: jobLoopId,
                user_id: userId
            }
        });
        if (!jobLoop) {
            return res.status(404).json({
                status: 404,
                message: "Job Loop not found."
            })
        }
        return res.status(200).json({
            status: 200,
            message: 'Job Loop detail retrieved successfully.',
            data: jobLoop
        });
    } catch (error) {
        console.error("Job loop Detail error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: {} });
    }
};
