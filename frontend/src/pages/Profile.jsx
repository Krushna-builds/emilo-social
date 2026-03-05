import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [nameError, setNameError] = useState("");
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");
    setNameError("");
    if (name.trim().length < 3) {
      setNameError("Name must be at least 3 characters");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("bio", bio);
      if (profilePicFile) formData.append("profilePic", profilePicFile);
      const { data } = await axiosInstance.put("/api/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(data);
      setProfilePicFile(null);
      setPreview(data.profilePic || "");
      setSuccess("Profile updated!");
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const following = user?.following?.length || 0;
  const followers = user?.followers?.length || 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Edit Profile
        </h2>

        {/* Avatar + stats */}
        <div className="flex flex-col items-center gap-2 mb-6">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-300 dark:border-indigo-700"
              onError={() => setPreview("")}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <label className="cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <div className="flex gap-6 mt-2">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {followers}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {following}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Following
              </p>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {apiError}
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-xl mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              value={user?.email || ""}
              readOnly
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              placeholder="Your name"
              className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
            />
            {nameError && (
              <p className="text-red-500 text-xs mt-1">{nameError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
