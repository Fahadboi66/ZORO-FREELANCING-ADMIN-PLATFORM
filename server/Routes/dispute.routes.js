import express from "express";
import { isAdmin, verifyUserJWT } from "../Middlewares/auth.middleware.js";
import { getAllDisputes, getDisputeById, manageDispute } from "../Controller/dispute.controller.js"

const router = express.Router();

router.get("/all", verifyUserJWT, isAdmin, getAllDisputes);
router.get("/:disputeId", verifyUserJWT, isAdmin, getDisputeById);
router.put("/:disputeId", verifyUserJWT, isAdmin, manageDispute);

export default router;