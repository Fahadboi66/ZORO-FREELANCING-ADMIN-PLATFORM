import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
      clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      amount: { type: Number, required: true },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
    },
    { timestamps: true }
);
  
export const Payment = mongoose.model("Payment", paymentSchema);
  