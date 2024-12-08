import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true, trim: true },

    description: { type: String, required: true, trim: true },

    skillsRequired: [{ type: String, trim: true }], // Array of required skills

    budget: { type: Number, required: true },

    duration: {
      type: String,
      enum: ["short-term", "long-term"],
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "closed"],
      default: "open",
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // Jobs will need admin approval by default
    },

    rejectionReason: { type: String, trim: true }, // Optional field for rejected jobs
    
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
