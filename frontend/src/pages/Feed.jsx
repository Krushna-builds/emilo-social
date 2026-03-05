import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";

const Feed = () => {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [following, setFollowing] = useState(user?.following || []);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [postsRes, suggestedRes] = await Promise.all([
          axiosInstance.get("/api/posts"),
          axiosInstance.get("/api/user/suggested"),
        ]);
        setPosts(postsRes.data);
        setSuggested(suggestedRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDelete = async (postId) => {
    try {
      await axiosInstance.delete(`/api/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const handleFollowToggle = async (targetId) => {
    try {
      const { data } = await axiosInstance.patch(
        `/api/user/${targetId}/follow`,
      );
      const newFollowing = data.isFollowing
        ? [...following, targetId]
        : following.filter((id) => String(id) !== String(targetId));
      setFollowing(newFollowing);
      updateUser({ ...user, following: newFollowing });
      if (data.isFollowing) {
        setSuggested((prev) => prev.filter((u) => u._id !== targetId));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="flex gap-6">
        {/* Main feed */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
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
              No posts yet. Be the first to share!
            </p>
          )}
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={user?._id}
              onDelete={handleDelete}
              onFollowToggle={handleFollowToggle}
              followingList={following}
            />
          ))}
        </div>

        {/* Suggested sidebar — desktop only */}
        {suggested.length > 0 && (
          <aside className="hidden lg:flex flex-col gap-3 w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Suggested for you
              </p>
              <div className="flex flex-col gap-3">
                {suggested.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {u.profilePic ? (
                        <img
                          src={u.profilePic}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                          {u.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {u.followers?.length || 0} followers
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowToggle(u._id)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex-shrink-0"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Feed;
