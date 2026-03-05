import express from "express";
import {
  getProfile,
  updateProfile,
  followToggle,
  getUserProfile,
  getSuggestedUsers,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePic"),
  updateProfile,
);
router.get("/suggested", authMiddleware, getSuggestedUsers);
router.get("/:id", authMiddleware, getUserProfile);
router.patch("/:id/follow", authMiddleware, followToggle);

export default router;
