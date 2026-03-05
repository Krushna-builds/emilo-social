import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer, folder = "emilo/avatars") =>
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

export const getProfile = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { name, bio } = req.body;

  if (name && name.trim().length < 3) {
    return res
      .status(400)
      .json({ message: "Name must be at least 3 characters" });
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (bio !== undefined) updates.bio = bio;

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer);
    updates.profilePic = uploaded.secure_url;
  }

  const updatedUser = await User.findByIdAndUpdate(req.userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(updatedUser);
};

export const followToggle = async (req, res) => {
  const targetId = req.params.id;
  if (targetId === req.userId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const [currentUser, targetUser] = await Promise.all([
    User.findById(req.userId),
    User.findById(targetId),
  ]);

  if (!targetUser) return res.status(404).json({ message: "User not found" });

  const isFollowing = currentUser.following.includes(targetId);
  if (isFollowing) {
    currentUser.following.pull(targetId);
    targetUser.followers.pull(req.userId);
  } else {
    currentUser.following.push(targetId);
    targetUser.followers.push(req.userId);
  }

  await Promise.all([currentUser.save(), targetUser.save()]);

  res.json({
    following: currentUser.following,
    followers: targetUser.followers,
    isFollowing: !isFollowing,
  });
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "name profilePic")
    .populate("following", "name profilePic");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const getSuggestedUsers = async (req, res) => {
  const currentUser = await User.findById(req.userId).select("following");
  const excludeIds = [...currentUser.following, req.userId];
  const users = await User.find({ _id: { $nin: excludeIds } })
    .select("name profilePic bio followers")
    .limit(5);
  res.json(users);
};
