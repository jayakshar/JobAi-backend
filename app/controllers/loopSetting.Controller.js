const {db} = require("../models");
const { Op } = require("sequelize");
const LoopSetting = db.loopSettings;
const jobLoops = db.jobLoop;
const User = db.user;

exports.createLoopSetting = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const loopId = req.params.id || '';

        const { auto_send_emails, auto_fill_application, cover_letter, excluded_company } = req.body;

        console.log("user id", userId);
        console.log("loop id", loopId);
        console.log("Body", req.body);

        if(!userId){
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            });
        }
        if(!loopId){
            return res.status(400).json({
                status: 400,
                message: "Loop ID is required."
            });
        }
        if(!auto_fill_application && !auto_send_emails){
            return res.status(400).json({
                status: 400,
                message: "At least one of auto_fill_application or auto_send_emails is required."
            });
        }
        if(!cover_letter){
            return res.status(400).json({
                status: 400,
                message: "Cover letter is required."
            });
        }
        if(!excluded_company){
            return res.status(400).json({
                status: 400,
                message: "Excluded company is required."
            });
        }

        const loopExists = await jobLoops.findOne({
            where:{
                id: loopId,
                user_id: userId
            }
        });

        if(!loopExists){
            return res.status(404).json({
                status: 404,
                message: "Job loop not found or does not belong to the user."
            });
        }

        const existingSetting = await LoopSetting.findOne({
            where: {
                loop_id: loopId
            }
        });

        let loopSetting;

        if(existingSetting){
            loopSetting = await existingSetting.update({
                auto_send_emails : auto_send_emails ?? existingSetting.auto_send_emails,
                auto_fill_application : auto_fill_application ?? existingSetting.auto_fill_applicatio,
                cover_letter,
                excluded_company
            });
        }else{
            loopSetting = await LoopSetting.create({
                loop_id: loopId,
                auto_send_emails : auto_send_emails ?? 0,
                auto_fill_application : auto_fill_application ?? 0,
                cover_letter,
                excluded_company
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Loop setting created successfully.",
            data: existingSetting
        });
    } catch (error) {
        console.error("Create loop setting error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
}