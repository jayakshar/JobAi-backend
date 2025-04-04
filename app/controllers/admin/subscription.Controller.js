const { db } = require("../../models");
const Subscription = db.subscription;

exports.addSubscription = async (req, res) => {
    try {
        const { title, description, price, time, status, type } = req.body;

        if (!title || !price || !time || !description || !status || !type) {
            return res.status(400).json({ status:400, error: "All field are required" });
        }

        const subscription = await Subscription.create({
            title,
            description,
            price,
            time,
            status : status || 'active',
            type
        });

        return res.status(201).json({
            status: 201,
            message: "Subscription created successfully",
            data : subscription,
        });
    } catch (error) {
        console.error("Add subscription error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.subscriptionList = async (req, res) => {
    try {
         const userId = req.user?.id || '';
        console.log("user id",userId);
        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "Admin ID is required."
            });
        }
        const subscriptions = await Subscription.findAll({
            where: {
                status: 'active'
            },
            // order: [['created_at', 'DESC']]
        });
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No subscriptions found."
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Subscription list retrieved successfully.",
            data: subscriptions
        });
    } catch (error) {
        console.error("List Subscription error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

exports.editSubscription = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const subscriptionId = req.params.id || '';
        console.log("user id",userId);
        console.log("subscription id",subscriptionId);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "Admin ID is required."
            });
        }
        if (!subscriptionId) {
            return res.status(400).json({
                status: 400,
                message: "Subscription ID is required."
            });
        }

        const {  title, description, price, time, status, type } = req.body

        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            return res.status(404).json({
                status: 404,
                message: "Subscription not found."
            });
        }

        await subscription.update({
            title,
            description,
            price,
            time,
            status,
            type,
            update_at: Date.now()
        });

        return res.status(200).json({
            status: 200,
            message: "Subscription updated successfully.",
            data: subscription
        });

    } catch (error) {
        console.error("Edit Subscription Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const subscriptionId = req.params.id || '';

        console.log("user id",userId);
        console.log("subscription id",subscriptionId);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "Admin ID is required."
            });
        }
        if (!subscriptionId) {
            return res.status(400).json({
                status: 400,
                message: "Subscription ID is required."
            });
        }

        const subscription = await Subscription.findByPk(subscriptionId);

        if (!subscription) {
            return res.status(404).json({
                status: 404,
                message: "Subscription not found."
            });
        }

        await subscription.update({
            status: 'inactive',
            update_at: Date.now()
        });

        return res.status(200).json({
            status: 200,
            message: "Subscription deleted successfully.",
            data: subscription
        });
        
    } catch (error) {
        console.error("Delete Subscription Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
}

// Destroy data from database
// exports.deleteSubscription = async (req, res) => {
//     try {
//         const userId = req.user?.id || '';
//         const subscriptionId = req.params.id || '';

//         console.log("user id",userId);
//         console.log("subscription id",subscriptionId);

//         if (!userId) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Admin ID is required."
//             });
//         }
//         if (!subscriptionId) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Subscription ID is required."
//             });
//         }

//         const subscription = await Subscription.findByPk(id);
//         if (!subscription) {
//             return res.status(404).json({ error: "Subscription not found" });
//         }

//         await subscription.destroy();

//         return res.status(200).json({
//             status: 200,
//             message: "Subscription deleted successfully",
//         });
//     } catch (error) {
//         console.error("Delete subscription error:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };
