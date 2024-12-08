import { User } from "../Models/user.model.js";
import { Payment } from "../Models/payment.model.js";
import { Earnings } from "../Models/earnings.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";

export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("jobId", "title")
    .populate("clientId", "firstName lastName email")
    .populate("freelancerId", "firstName lastName email");

  if (!payments.length) {
    throw new ErrorHandler(404, "No payments found.");
  }
  return res
    .status(200)
    .json(
      new ApiResponseHandler(200, payments, "Payments retrieved successfully.")
    );
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId)
    .populate("jobId", "title")
    .populate("clientId", "firstName lastName email")
    .populate("freelancerId", "firstName lastName email");

  if (!payment) {
    throw new ErrorHandler(404, "Payment not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponseHandler(200, payment, "Payment retrieved successfully.")
    );
});



export const refundPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;
  
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new ErrorHandler(404, "Payment not found.");
    }
  
    if (payment.status !== "completed") {
      throw new ErrorHandler(400, "Only completed payments can be refunded.");
    }
  
    // Process refund logic
    const freelancerEarnings = await Earnings.findOne({
      freelancerId: payment.freelancerId,
    });
  
    if (!freelancerEarnings) {
      throw new ErrorHandler(404, "Earnings record for the freelancer not found.");
    }
  
    // Update freelancer earnings
    if (freelancerEarnings.totalEarnings < payment.amount) {
      throw new ErrorHandler(400, "Freelancer does not have sufficient earnings for a refund.");
    }
  
    freelancerEarnings.totalEarnings -= payment.amount;
    freelancerEarnings.transactions.push({
      paymentId: payment._id,
      amount: -payment.amount,
      status: "completed",
    });
  
    await freelancerEarnings.save();
  
    // Update payment record
    payment.status = "refunded";
    await payment.save();
  
    return res.status(200).json(
      new ApiResponseHandler(200, null, `Refund of ${payment.amount} processed successfully.`)
    );
  });
