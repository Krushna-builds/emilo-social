import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const PostCard = ({
  post,
  currentUserId,
  onDelete,
  onFollowToggle,
  followingList = [],
}) => {
  const isOwner = post.author?._id === currentUserId;
  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(
    (post.likes || []).map(String).includes(String(currentUserId)),
  );
  const [likeLoading, setLikeLoading] = useState(false);
  const isFollowing = followingList
    .map(String)
    .includes(String(post.author?._id));

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    // Optimistic update
    setLiked((prev) => !prev);
    setLikes((prev) =>
      liked
        ? prev.filter((id) => String(id) !== String(currentUserId))
        : [...prev, currentUserId],
    );
    try {
      const { data } = await axiosInstance.patch(`/api/posts/${post._id}/like`);
      setLikes(data.likes);
      setLiked(data.liked);
    } catch {
      // revert
      setLiked((prev) => !prev);
      setLikes(post.likes || []);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!onFollowToggle) return;
    onFollowToggle(post.author._id, isFollowing);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          {post.author?.profilePic ? (
            <img
              src={post.author.profilePic}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg flex-shrink-0">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              {post.author?.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{date}</p>
          </div>
        </div>

        {!isOwner && onFollowToggle && (
          <button
            onClick={handleFollow}
            className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
              isFollowing
                ? "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-500"
                : "border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full object-cover max-h-96"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
          {post.text}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className="flex items-center gap-1.5 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              liked
                ? "fill-red-500 text-red-500"
                : "fill-none text-gray-400 dark:text-gray-500"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={liked ? 0 : 1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span
            className={`text-sm font-medium ${liked ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}
          >
            {likes.length > 0 ? likes.length : ""}
          </span>
        </button>

        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
