import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
      raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      reason: { type: String, required: true },
      status: {
        type: String,
        enum: ["open", "in-review", "resolved"],
        default: "open",
      },
      resolutionNotes: { type: String, trim: true },
    },
    { timestamps: true }
);
  
export const Dispute = mongoose.model("Dispute", disputeSchema);
  