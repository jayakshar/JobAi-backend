const { AttributeInfo } = require("langchain/chains/query_constructor");
const { db } = require ("../../models");
const JobLoop = db.jobLoop;
const User = db.user;

exports.candidateJobLoop = async (req, res) => {
    try {
        const adminId = req.user?.id || '';
        console.log("admin id", adminId);

        if (!adminId) {
            return res.status(404).json({
                status : 404,
                message : "Admin not found",
                data : {}
            });
        }

        const candidateJobLoops = await JobLoop.findAll({
            include:[
                {
                    model : User,
                    as: 'candidate',
                    attributes : ['id', 'first_name', 'last_name', 'email'],
                    // attributes : {
                    //     exclude : [ "created_at", "updated_at", "password"]
                    // },
                    where : {
                        role : 'candidate'
                    },
                }
            ],
            order : [['created_at', 'DESC']]
        });

        return res.status(200).json({
            status : 200,
            message : "Candidate job loops fetched successfully",
            data : candidateJobLoops
        });
    } catch (error) {
        console.error("Candidate job loops error :", error);
        return res.status(500).json({status : 500, message : "Internal server error", data : {}});
    }
};

exports.loopDetail = async (req, res) => {
    try {
        const adminId = req.user?.id || '';
        const candidateId = req.params.candidateId || '';
        const jobLoopId = req.params.jobLoopId || ''

        console.log('Admin id', adminId);
        console.log('Candidate id', candidateId);
        console.log('Job Loop id', jobLoopId);

        if (!adminId) {
            return res.status(404).json({
                status : 404,
                message : "Admin not found",    
                data : {}
            });
        }
        if (!candidateId) {
            return res.status(404).json({
                status : 404,
                message : "Candidate not found",
                data : {}
            }); 
        }
        if (!jobLoopId) {
            return res.status(404).json({
                status : 404,
                message : "Job Loop not found",
                data : {}
            })
        }
        
        const loopDetail = await JobLoop.findOne({
            where : {
                id: jobLoopId,
                user_id : candidateId
            },
            include: [
                {
                    model : User,
                    as: 'candidate',
                    attributes : ['id', 'first_name', 'last_name', 'email'],
                    // attributes : {
                    //     exclude : [ "created_at", "updated_at", "password"]
                    // },
                }
            ]
        });

        if (!loopDetail) {
            return res.status(404).json({
                status : 404,
                message : "Job Loop detail not found",
                date : {}
            });
        }

        return res.status(200).json({
            status : 200,
            message : "Job Loop detail found",
            data : loopDetail
        })
    } catch (error) {
        console.error("Loop detail error : ", error);
        return res.status(500).json({status : 500, message : "Internal server error", data : {}});
    }
};