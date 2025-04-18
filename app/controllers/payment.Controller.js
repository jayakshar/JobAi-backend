const { db } = require("../models");
const Payments = db.payments;
const Subscription = db.subscription;


exports.initiatePayment = async (req, res) => {
  try {
    const userId = req.user?.id || '';
    const subscriptionId = req.params.id || '';
  
    if (!userId) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: {}
      });
    }
  
    if (!subscriptionId) {
      return res.status(400).json({
        status: 400,
        message: "Subscription Id is required",
        data: {}
      });
    }

    const subscription = await Subscription.findByPk(subscriptionId);

    const newPayment = await Payments.create({
      user_id: userId,
      subscription_id: subscriptionId,
      price: subscription.price,
      total_amount: subscription.price,
      source: 'online',
      payment_status: 'pending',
      transaction_id: null,
      transaction_data: null,
      status : subscription.status
    });

    return res.status(201).json({
      status: 201,
      message: "Payment initiated successfully",
      data: newPayment
    });

  } catch (error) {
    console.error("Initiate payment error: ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      data: {}
    });
  }
};

exports.completePayment = async (req, res) => {
    try {
      const userId = req.user?.id;
      const payment_id = req.params.id || '';
      const { transaction_id, transaction_data, payment_status } = req.body;

      console.log(userId);
      console.log(payment_id);
      console.log(req.body);
  
      if (!userId) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
          data: {},
        });
      }
  
      if (!transaction_id || !transaction_data || !payment_status) {
        return res.status(400).json({
          status: 400,
          message: "Missing required fields: transaction_data, transaction_id, or payment_status",
          data: {},
        });
      }
  
      const payment = await Payments.findByPk(payment_id);
      if (!payment || payment.user_id !== userId) {
        return res.status(404).json({
          status: 404,
          message: "Payment not found or unauthorized",
          data: {},
        });
      }
  
      payment.transaction_id = transaction_id;
      payment.transaction_data = transaction_data || null;
      payment.payment_status = payment_status;
      payment.updated_at = new Date();
  
      await payment.save();
  
      return res.status(200).json({
        status: 200,
        message: "Payment completed successfully",
        data: payment,
      });
  
    } catch (error) {
      console.error("Complete payment error:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: {},
      });
    }
};

