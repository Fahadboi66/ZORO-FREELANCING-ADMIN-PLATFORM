import { User } from "../Models/user.model.js";
import { Job } from "../Models/job.model.js";
import { Dispute } from "../Models/dispute.model.js";
import { Notification } from "../Models/notification.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";

// Get all disputes without populating them
export const getAllDisputes = asyncHandler(async (req, res) => {
  // Fetch all disputes (without populating job and user details)
  const disputes = await Dispute.find().populate("jobId raisedBy");

  if (!disputes.length) {
    throw new ErrorHandler(404, "No disputes found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponseHandler(200, disputes, "Disputes retrieved successfully.")
    );
});



export const getDisputeById = asyncHandler(async (req, res) => {
  const { disputeId } = req.params;

  // Find dispute by ID
  const dispute = await Dispute.findById(disputeId);

  if (!dispute) {
    throw new ErrorHandler(404, "Dispute not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponseHandler(200, dispute, "Dispute retrieved successfully.")
    );
});



export const manageDispute = asyncHandler(async (req, res) => {
    const { disputeId } = req.params;
    const { status, resolutionNotes } = req.body;
  
    // Validate the status change
    if (!["open" , "in-review", "resolved"].includes(status)) {
      throw new ErrorHandler(400, "Invalid dispute status.");
    }
  
    // Find dispute by ID
    const dispute = await Dispute.findById(disputeId).populate("jobId raisedBy");
    if (!dispute) {
      throw new ErrorHandler(404, "Dispute not found.");
    }
  
    // Update dispute status and resolution notes
    dispute.status = status;
    if (resolutionNotes) {
      dispute.resolutionNotes = resolutionNotes;
    }
    await dispute.save();
  
    // Notify both the freelancer and the client involved in the dispute
    const job = await Job.findById(dispute.jobId);
    if (!job) {
      throw new ErrorHandler(404, "Job related to dispute not found.");
    }
  
    const client = await User.findById(job.clientId);
    const freelancer = await User.findById(dispute.raisedBy);
  
    // Create notification for the client
    const clientMessage = `Your dispute for the job titled "${job.title}" has been updated to "${status}".`;
    const clientNotification = new Notification({
      userId: job.clientId,
      message: clientMessage,
    });
    await clientNotification.save();
  
    // Create notification for the freelancer
    const freelancerMessage = `Your dispute for the job titled "${job.title}" has been updated to "${status}".`;
    const freelancerNotification = new Notification({
      userId: dispute.raisedBy,
      message: freelancerMessage,
    });
    await freelancerNotification.save();
  
    return res
      .status(200)
      .json(new ApiResponseHandler(200, dispute, "Dispute status updated and notifications sent."));
  });
  