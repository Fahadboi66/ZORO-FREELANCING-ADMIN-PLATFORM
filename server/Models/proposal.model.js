import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
      freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      coverLetter: { type: String, trim: true },
      expectedBudget: { type: Number },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
    { timestamps: true }
);
  
export const Proposal = mongoose.model("Proposal", proposalSchema);
  