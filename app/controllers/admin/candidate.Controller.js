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

exports.candidateDetail = async (req, res) => {
    try {
        const adminId = req.user?.id || '';
        const candidateId = req.params.id || '';

        console.log("Admin Id", adminId);
        console.log("Candidate Id", candidateId);

        if (!adminId) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized: Admin not found",
                data: {}
            });
        }
        if (!candidateId) {
            return res.status(400).json({
                status: 400,
                message: "Candidate Id required",
                data: {}
            });
        }

        const candidate = await User.findByPk(candidateId);
        if(!candidate){
            return res.status(404).json({
                status: 404,
                message: "Candidate not found",
                data:{}
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Candidate detail",
            data : candidate
        })
    } catch (error) {
        console.error("Candidate detail error:", error);
        res.status(500).json({status: 500, message: "Internal server error", data: {}});
    }
}
exports.updateCandidate = async (req, res) => {
    try {
        const adminId = req.user?.id || '';
        const candidateId = req.params.id || '';

        console.log("Admin Id", adminId);
        console.log("Candidate Id", candidateId);
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        
        if (!adminId) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized: Admin not found",
                data: {}
            });
        }
        if (!candidateId) {
            return res.status(400).json({
                status: 400,
                message: "Candidate Id required",
                data: {}
            });
        }

        const candidate = await User.findByPk(candidateId);
        if (!candidate) {
            return res.status(404).json({ 
                status: 404, 
                message: "Candidate not found.", 
                data: {} 
            });
        }
         
        const {
            first_name,
            last_name,
            mobile,
            email,
            website,
            qualification,
            address,
            description,
            photo_url
        } = req.body;

        await candidate.update({
            ...(first_name && { first_name }),
            ...(last_name && { last_name }),
            ...(mobile && { mobile }),
            ...(email && { email }),
            ...(website && { website }),
            ...(qualification && { qualification }),
            ...(address && { address }),
            ...(description && { description }),
            ...(photo_url && { photo_url })
        });

        const updatedData = {
            id: candidate.id,
            first_name: candidate.first_name,
            last_name: candidate.last_name,
            mobile: candidate.mobile,
            email: candidate.email,
            website: candidate.website,
            qualification: candidate.qualification,
            address: candidate.address,
            description: candidate.description,
            photo_url: candidate.photo_url
        }
        console.log("Payload recevied: ", req.body);
        
        return res.status(200).json({
            status: 200,
            message: "Profile updated successfully",
            data : updatedData
        });
    } catch (error) {
        console.error('Candidate Profile update error: ', error);
        return res.status(500).json({status: 500, message: "Internal server error.", data: {}});
    }
}; 
