
import { User } from "../Models/user.model.js";
import { Dispute } from "../Models/dispute.model.js";
import { Job } from "../Models/job.model.js";
import { Payment } from "../Models/payment.model.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";


export const getAdminDashboard = asyncHandler(async (req, res) => {
    // Fetch aggregated statistics
    const [totalUsers, totalAdmins, totalFreelancers, totalClients] = await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "freelancer" }),
        User.countDocuments({ role: "client" }),
    ]);

    const [activeJobs, completedJobs, totalPayments, completedPayments] = await Promise.all([
        Job.countDocuments({ status: "open" }),
        Job.countDocuments({ status: "completed" }),
        Payment.countDocuments({}),
        Payment.countDocuments({ status: "completed" }),
    ]);

    const [openDisputes, resolvedDisputes] = await Promise.all([
        Dispute.countDocuments({ status: "open" }),
        Dispute.countDocuments({ status: "resolved" }),
    ]);

    // Fetch recent jobs
    const recentJobs = await Job.find({})
        .sort({ createdAt: -1 }) // Sort by creation date, descending
        .limit(5) // Get only the 5 most recent jobs
        .populate('clientId', 'firstName lastName')
        .select("title clientId status") // Populate specific fields (firstName, lastName) from the User model

    // Format the jobs
    let formattedJobs = null;
    if (recentJobs.length > 0) {
        formattedJobs = recentJobs.map((job) => ({
            id: job._id,
            title: job.title,
            client: `${job.clientId.firstName} ${job.clientId.lastName}`, // Concatenate the first name and last name
            status: job.status,
        }));
    }

    // Response data
    const dashboardData = {
        users: {
            total: totalUsers,
            admins: totalAdmins,
            freelancers: totalFreelancers,
            clients: totalClients,
        },
        jobs: {
            active: activeJobs,
            completed: completedJobs,
        },
        payments: {
            total: totalPayments,
            completed: completedPayments,
        },
        disputes: {
            open: openDisputes,
            resolved: resolvedDisputes,
        },
        recentJobs: formattedJobs,
    };

    return res
        .status(200)
        .json(new ApiResponseHandler(200, dashboardData, "Dashboard data fetched successfully."));
});
