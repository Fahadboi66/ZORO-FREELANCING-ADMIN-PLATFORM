import { Job } from "../Models/job.model.js";
import { Notification } from "../Models/notification.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";



export const approveJobPosting = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
  
    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      throw new ErrorHandler(404, "Job not found.");
    }
  
    if (job.approvalStatus === "approved") {
      throw new ErrorHandler(400, "Job is already approved.");
    }
  
    // Update the job's approval status
    job.approvalStatus = "approved";
    await job.save();
  
    // Create a notification for the client
    const notificationMessage = `Your job titled "${job.title}" has been approved.`;
    const notification = new Notification({
      userId: job.clientId,  // Assuming clientId refers to the user who posted the job
      message: notificationMessage,
    });
    await notification.save();
  
    return res
      .status(200)
      .json(new ApiResponseHandler(200, job, "Job approved successfully."));
  });
  



  export const rejectJobPosting = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const { rejectReason } = req.body;
  
    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      throw new ErrorHandler(404, "Job not found.");
    }
  
    if (job.status === "rejected") {
      throw new ErrorHandler(400, "Job is already rejected.");
    }
  
    job.rejectionReason = rejectReason;
  
    // Suspend the job
    job.approvalStatus = "rejected";
    await job.save();
  
    // Create a notification for the client
    const notificationMessage = `Your job titled "${job.title}" has been rejected. Reason: ${rejectReason}`;
    const notification = new Notification({
      userId: job.clientId,  // Assuming clientId refers to the user who posted the job
      message: notificationMessage,
    });
    await notification.save();
  
    return res
      .status(200)
      .json(new ApiResponseHandler(200, job, "Job rejected successfully."));
  });
  

export const deleteJobPosting = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
  
    // Find and delete the job by ID
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      throw new ErrorHandler(404, "Job not found.");
    }
  
    // Create a notification for the client
    const notificationMessage = `Your job titled "${job.title}" has been deleted from the platform.`;
    const notification = new Notification({
      userId: job.clientId,  // Assuming clientId refers to the user who posted the job
      message: notificationMessage,
    });
    await notification.save();
  
    return res
      .status(200)
      .json(new ApiResponseHandler(200, null, "Job deleted successfully."));
  });
  



export const getJobById = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    // Find the job by ID
    const job = await Job.findById(jobId).populate("clientId", "firstName lastName email");

    if (!job) {
        throw new ErrorHandler(404, "Job not found.");
    }

    return res
        .status(200)
        .json(new ApiResponseHandler(200, job, "Job retrieved successfully."));
});


export const getAllJobs = asyncHandler(async (req, res) => {
    // Retrieve all jobs without filters
    const jobs = await Job.find().populate("clientId");

    if (!jobs || jobs.length === 0) {
        throw new ErrorHandler(404, "No jobs found.");
    }

    return res
        .status(200)
        .json(new ApiResponseHandler(200, jobs, "Jobs retrieved successfully."));
});


export const searchJobs = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        throw new ErrorHandler(400, "Search query is required.");
    }

    // Search jobs by title or description containing the query string
    const jobs = await Job.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    });

    if (!jobs || jobs.length === 0) {
        throw new ErrorHandler(404, "No jobs match your search query.");
    }

    return res
        .status(200)
        .json(new ApiResponseHandler(200, jobs, "Jobs retrieved successfully."));
});



