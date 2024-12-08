import express from "express";
import {
  getPayments,
  getPaymentById,
  refundPayment
} from "../Controller/payment.controller.js";
import { isAdmin, verifyUserJWT } from "../Middlewares/auth.middleware.js";


const router = express.Router();


router.get("/", verifyUserJWT, isAdmin, getPayments);
router.get("/:paymentId", verifyUserJWT, isAdmin, getPaymentById);
router.post("/refund/:paymentId", verifyUserJWT, isAdmin, refundPayment);


export default router;
