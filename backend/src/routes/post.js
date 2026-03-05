import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/mine", authMiddleware, getMyPosts);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/:id/like", authMiddleware, toggleLike);

export default router;
