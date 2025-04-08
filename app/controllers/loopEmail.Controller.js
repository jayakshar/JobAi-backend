const {db} = require("../models");
const LoopEmail = db.loopEmail;
const User = db.user;
const JobLoop  = db.jobLoop
const EmailTemplate = db.emailTemplate; 
const moment = require("moment");
const { Op } = require("sequelize");

exports.getOneEmailTemplate = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const emailTemplateId = req.params.id || '';

        console.log("user id", userId);
        console.log("emailTemplateId", emailTemplateId);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            });
        }

        if (!emailTemplateId) {
            return res.status(400).json({
                status: 400,
                message: "Email template ID is required."
            });
        }

        const emailTemplate = await EmailTemplate.findByPk(emailTemplateId);

        if (!emailTemplate) {
            return res.status(404).json({
                status: 404,
                message: "Email template not found."
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Email template retrieved successfully.",
            data: emailTemplate
        });

    } catch (error) {
        console.error("Get one email template error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
};

exports.createLoopEmail = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log(userId)

        if (!userId) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized: User ID is missing.",
            });
        }

        const {loop_id , email_id} = req.params;
        if (!loop_id || !email_id) {
            return res.status(400).json({
                status: 400,
                message: "both loop id and email id is required.",
            });
        }

        const jobLoop = await JobLoop.findByPk(loop_id);
        console.log("jobLoop", jobLoop)
        if (!jobLoop) {
            return res.status(404).json({
                status:404,
                message: "Job loop not found"
            });
        }

        const emailTemplate = await EmailTemplate.findByPk(email_id);
        console.log("emailTemplate", emailTemplate)
        if (!emailTemplate) {
            return res.status(404).json({
                status: 404,
                message: "Emails not found"
            });
        }

        const loopEmail = await LoopEmail.create({
            loop_id : loop_id,
            email_id :email_id,
            title: emailTemplate.title,
            subject: emailTemplate.subject,
            body: emailTemplate.body,
        });

        return res.status(201).json({
            status: 201,
            message: "Loop email created successfully.",
            data: loopEmail
        });
    } catch (error) {
        console.error("Create loop email error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
};


exports.createOwnEmailTemaplte = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const { title, subject, body, status } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            });
        }

        if (!title || !subject || !body) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required."
            });
        }

        const validStatus = ['draft', 'active', 'inactive'];
        if (status && !validStatus.includes(status)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid status. Valid statuses are: draft, active, inactive."
            });
        }

        const emailTemplate = await EmailTemplate.create({
            title,
            subject,
            body,
            status: status || 'draft',
            user_id: userId  // <-- attach user_id here
        });

        return res.status(201).json({
            status: 201,
            message: "Email template created successfully.",
            data: emailTemplate,
        });
    } catch (error) {
        console.error("Create email template error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: {} });
    }
}

exports.getEmailTemplateList = async (req, res) => {
    try {
        const userId = req.user?.id || '';

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            });
        }

        const templates = await EmailTemplate.findAll({
            where: {
                [Op.or]: [
                    { user_id: userId },     // user's own templates
                    { user_id: null }        // admin templates
                ]
            },
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            status: 200,
            message: "Templates fetched successfully.",
            data: templates
        });
    } catch (error) {
        console.error("Get email template list error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: {} });
    }
};