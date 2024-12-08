import mongoose from "mongoose";

const earningsSchema = new mongoose.Schema(
    {
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        totalEarnings: {
            type: Number,
            default: 0,
        },
        pendingPayments: {
            type: Number,
            default: 0,
        },
        transactions: [
            {
                paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
                amount: { type: Number },
                date: { type: Date, default: Date.now },
                status: {
                    type: String,
                    enum: ["completed", "pending", "failed"],
                    default: "completed",
                },
            },
        ],
    },
    { timestamps: true }
);

export const Earnings = mongoose.model("Earnings", earningsSchema);
