import Post from "../models/Post.js";
import { createPostSchema } from "../validators/postSchemas.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer, folder = "emilo/posts") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });

export const createPost = async (req, res) => {
  const result = createPostSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const { text } = result.data;
  let imageUrl = "";

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer);
    imageUrl = uploaded.secure_url;
  }

  const post = await Post.create({ author: req.userId, text, imageUrl });
  const populated = await post.populate("author", "name profilePic");

  res.status(201).json(populated);
};

export const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name profilePic")
    .sort({ createdAt: -1 });
  res.json(posts);
};

export const getMyPosts = async (req, res) => {
  const posts = await Post.find({ author: req.userId })
    .populate("author", "name profilePic")
    .sort({ createdAt: -1 });
  res.json(posts);
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== req.userId) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this post" });
  }

  await post.deleteOne();
  res.json({ message: "Post deleted successfully" });
};

export const toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const alreadyLiked = post.likes.map(String).includes(req.userId);
  if (alreadyLiked) {
    post.likes.pull(req.userId);
  } else {
    post.likes.push(req.userId);
  }
  await post.save();
  res.json({ likes: post.likes, liked: !alreadyLiked });
};
