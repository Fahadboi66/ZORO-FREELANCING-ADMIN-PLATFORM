import express from "express";
import {
  sendNotification,
} from "../Controller/notification.controller.js";
import { isAdmin, verifyUserJWT } from "../Middlewares/auth.middleware.js";


const router = express.Router();


router.post("/send", verifyUserJWT, isAdmin, sendNotification);


export default router;
