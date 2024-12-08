import mongoose from "mongoose";

const workSubmissionSchema = new mongoose.Schema(
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
      freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      links: [{ type: String, trim: true }], // URLs
      notes: { type: String, trim: true },
      status: { type: String, enum: ["submitted", "under-review", "approved"], default: "submitted" },
    },
    { timestamps: true }
  );
  
  export const WorkSubmission = mongoose.model("WorkSubmission", workSubmissionSchema);
  