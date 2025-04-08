const { db } = require("../../models");
const EmailTemplate = db.emailTemplate; 
const { Op } = require("sequelize");


exports.createEmailTemplate = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const { title, subject, body, status } = req.body;
        console.log("user id", userId);
        console.log("Body", req.body);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            })
        }    
        if (!title || !subject || !body) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required."
            });
        }
        const validStatus = ['draft', 'active', 'inactive'];
        if(status && !validStatus.includes(status)) {
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
        });
        res.status(201).json({
            status: 201,
            message: "Email template created successfully.",
            data: emailTemplate,
        })
    } catch (error) {
        console.error("Create email template error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data : {} }); 
    }
};

exports.updateEmailTemplate = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const emailTemplateId = req.params.id || '';
        const { id, title, subject, body, status } = req.body;

        console.log("user id", userId);
        console.log("Body", req.body);
        console.log("emailTemplateId", emailTemplateId);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            })
        }
        if (!emailTemplateId) {
            return res.status(400).json({
                status: 400,
                message: "Email template ID is required."
            });
        }
        if (!title || !subject || !body) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required."
            });
        }

        const template = await EmailTemplate.findByPk(emailTemplateId);

        if (!template) {
            return res.status(404).json({
                status: 404,
                message: "Email template not found."
            });
        }

        const validStatuses = ['draft', 'sent', 'failed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid status value. Must be one of: draft, sent, failed."
            });
        }

        template.title = title;
        template.subject = subject;
        template.body = body;
        template.status = status || template.status;

        await template.save();

        return res.status(200).json({
            status: 200,
            message: "Email template updated successfully.",
            data: template
        });
        
    } catch (error) {
        console.error("Update email template error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data : {} });
        
    }
};

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

exports.deleteEmailTemplate = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const emailTemplateId = req.params.id || '';

        console.log("user id", userId);
        console.log("emailTemplateId", emailTemplateId);

        if(!userId){
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            });
        }
        if(!emailTemplateId) {
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

        await emailTemplate.destroy();

        return res.status(200).json({
            status: 200,
            message: "Email template deleted successfully.",
            data: {}
        });
    } catch (error) {
        console.error("Delete email template error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data : {} });
    }
};

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
