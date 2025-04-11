const { where } = require("sequelize");
const {db} = require("../../models");
const User = db.user;
const moment = require("moment");

exports.candidateList = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        console.log("user id", userId);

        if (!userId) {
            return res.status(404).json({
                status : 404,
                message : "Admin id not found",
            });
        }

        const admin = await User.findByPk(userId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                status: 403,
                message: "Forbidden: Admin access only"
            });
        }

        const candidateList = await User.findAll({
            where : {
                role : "candidate"
            },
            attributes : {
                exclude : ["password", "created_at", "updated_at"]
            }
        });

        return res.status(200).json({
            status : 200,
            message : "Candidate list fetched successfully",
            data : candidateList
        })
    } catch (error) {
        console.error("Candidate listing fetch error..");
        res.status(500).json({status : 500, message : "Internal server error" , data : {}});
    }
};

exports.candidateStatusUpdate = async (req, res) => {
    try {
        const adminId = req.user?.id || '';
        const candidateId = req.params.id || '';
        const { status } = req.body;

        console.log("admin id", adminId);
        console.log("candidate id", candidateId);

        if (!adminId) {
            return res.status(404).json({
                status: 404,
                message: "Admin id not found",
            });
        }

        if (!candidateId) {
            return res.status(404).json({
                status: 404,
                message: "Candidate id not found",
                data: {}
            });
        }

        const normalizedStatus = status?.toLowerCase();
        if (!["active", "inactive"].includes(normalizedStatus)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid status value. Use 'active' or 'inactive'.",
                data: {}
            });
        }

        const user = await User.findOne({
            where: {
                id: candidateId,
                role: "candidate"
            }
        });

        await user.update({ status: normalizedStatus });

        return res.status(200).json({
            status: 200,
            message: "Candidate status updated successfully",
            data: user
        });

    } catch (error) {
        console.error("Candidate status update error:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: {}
        });
    }
};

