import express from "express";
import { changePassword, forgotPassword, loginUser, loginWithGoogle, logoutUser, refreshAccessToken, registerAdmin } from "../Controller/auth.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

//User auth routes:
router.post("/register-admin", registerAdmin);
router.post("/login-user", loginUser);
router.post("/login-google", loginWithGoogle); //google Login
router.post("/logout-user", verifyUserJWT, logoutUser);
router.put("/change-password", verifyUserJWT, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/refresh-token", refreshAccessToken);

export default router;