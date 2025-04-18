const { db } = require("../models");
const User = db.user;
const ScreeningQuestion = db.screeningsQuestion;


exports.screeningQustion = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        console.log("Fetching screening questions for userId:", userId);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found."
            });
        }

        const screeningsQuestion = await ScreeningQuestion.findOne({
            where: { user_id: userId }
        });

        if (!screeningsQuestion) {
            return res.status(404).json({
                status: 404,
                message: "No screening questions found for this user."
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Screening questions fetched successfully.",
            data: screeningsQuestion
        });
    } catch (error) {
        console.error('Screening Questions error:', error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error."
        });
    }
};


exports.updateScreeningQustion = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        console.log("userId",userId);
        const {
            title,
            indeed_url,
            working_for_canada,
            notice_period,
            expected_salary
        } = req.body;

        console.log("Updating screening questions for userId:", userId);
        console.log("Payload received:", req.body);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found."
            });
        }

        const screeningQuestion = await ScreeningQuestion.findOne({
            where: { user_id: userId }
        });

        if (!screeningQuestion) {
            return res.status(404).json({
                status: 404,
                message: "No screening questions found for this user."
            });
        }

        await screeningQuestion.update({
            title,
            indeed_url,
            working_for_canada,
            notice_period,
            expected_salary,
            updated_at: new Date()
        });
        // save code add bro
        return res.status(200).json({
            status: 200,
            message: "Screening question updated successfully.",
            data: screeningQuestion
        });
    } catch (error) {
        console.error('Screening Questions update error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
