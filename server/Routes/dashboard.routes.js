import express from "express";
import { verifyUserJWT, isAdmin } from "../Middlewares/auth.middleware.js";
import { getAdminDashboard } from "../Controller/dashboard.controller.js";

const router = express.Router();


router.get("/analytics", verifyUserJWT, isAdmin, getAdminDashboard);

export default router;