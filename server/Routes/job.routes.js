import express from "express";
import { isAdmin, verifyUserJWT } from "../Middlewares/auth.middleware.js";
import { approveJobPosting, deleteJobPosting, getAllJobs, getJobById, rejectJobPosting, searchJobs } from "../Controller/job.controller.js";


const router = express.Router();

router.get("/all", verifyUserJWT, getAllJobs);
router.get("/search", verifyUserJWT, searchJobs);
router.put("/approve/:jobId", verifyUserJWT, isAdmin, approveJobPosting);
router.put("/suspend/:jobId", verifyUserJWT, isAdmin, rejectJobPosting);
router.delete("/delete/:jobId", verifyUserJWT,isAdmin, deleteJobPosting);
router.get("/:jobId", verifyUserJWT, getJobById);





export default router;