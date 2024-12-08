import express from "express";
import { isAdmin, verifyUserJWT } from "../Middlewares/auth.middleware.js";
import { changeUserProfileStatus, createUser, deleteUser, getAllUser, getUserProfile, searchUsers, updateUserInfo } from "../Controller/user.controller.js";


const router = express.Router();

router.get("/profile", verifyUserJWT, getUserProfile); //TODO: Get User Profile
router.post("/create", verifyUserJWT, isAdmin, createUser);
router.get("/all", verifyUserJWT, isAdmin, getAllUser);
router.get("/search", verifyUserJWT, searchUsers);
router.put("/update/:userId",  verifyUserJWT, isAdmin, updateUserInfo);
router.delete("/delete/:userId", verifyUserJWT, isAdmin, deleteUser);
router.put("/change-status/:userId", verifyUserJWT, isAdmin, changeUserProfileStatus);




export default router;