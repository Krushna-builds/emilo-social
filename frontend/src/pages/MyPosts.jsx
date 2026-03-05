import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/api/posts/mine")
      .then(({ data }) => setPosts(data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load your posts"),
      )
      .finally(() => setLoading(false));
  }, []);

  const handlePostCreated = (newPost) => setPosts((prev) => [newPost, ...prev]);

  const handleDelete = async (postId) => {
    try {
      await axiosInstance.delete(`/api/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        My Posts
      </h2>
      <CreatePostForm onPostCreated={handlePostCreated} />

      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      {!loading && posts.length === 0 && !error && (
        <p className="text-center text-gray-400 dark:text-gray-500 py-10">
          You haven&apos;t posted anything yet.
        </p>
      )}
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          currentUserId={user?._id}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default MyPosts;
