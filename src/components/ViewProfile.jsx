import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Comments from "./Comments";
import CommentSections from "./CommentSections";

function ViewProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );
  const token = localStorage.getItem("authToken");

  const toggleComments = (postId) => {
    setActiveCommentId(activeCommentId === postId ? null : postId);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/api/posts/getUserProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (error) {
        alert("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
      </div>
    );
  }

  const formatDateAndTime = (createdDate, createdTime) => {
    const formattedTime = createdTime || "Time";
    const formattedDate = createdDate || "Date";
    return `${formattedDate} | ${formattedTime}`;
  };

  return (
    <div
      className={`min-h-screen p-8 mt-16 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {profile && (
        <>
          <div
            className={`max-w-4xl mx-auto ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-xl p-8 mb-8`}
          >
            <div className="flex flex-col items-center mb-8">
              {profile.profile.profilePicture ? (
                <img
                  src={`data:image/png;base64,${profile.profile.profilePicture}`}
                  alt={profile.profile.username}
                  className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-green-500"
                />
              ) : (
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } border-4 border-green-500`}
                >
                  {profile.profile.username
                    ? profile.profile.username[0].toUpperCase()
                    : ""}
                </div>
              )}
              <h1 className="text-3xl font-bold mb-2">
                {profile.profile.fullName}
              </h1>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {profile.profile.username}
              </p>
              <p
                className={`text-md ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {profile.profile.email}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Bio</h2>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  {profile.profile.bio || "No bio available"}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`max-w-4xl mx-auto ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-xl p-8`}
          >
            <h2 className="text-2xl font-bold mb-6">Posts</h2>
            <div className="grid gap-6">
              {profile.posts &&
                profile.posts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-6 rounded-lg transition-all duration-300 hover:shadow-2xl ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-white"
                    }`}
                  >
                    {post.picture_content && (
                      <img
                        src={`data:image/jpeg;base64,${post.picture_content}`}
                        alt={post.title}
                        className="w-full object-cover rounded-lg mb-4 shadow-lg"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">
                      {post.title || "Untitled"}
                    </h3>
                    <p
                      className={`mb-4 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {post.content || "No content"}
                    </p>
                    <div
                      className={`flex justify-between items-center text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      } mt-4 pt-4 border-t-4 ${
                        theme === "dark" ? "border-gray-500" : "border-gray-400"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-medium">
                          Posted by {post.authorName}
                        </span>
                      </span>
                      <span>
                        {formatDateAndTime(
                          post.createdDate,
                          post.createdTime
                        ) || "Unknown Time"}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className={`mt-4 px-4 py-2 rounded-md ${
                        theme === "dark"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      } transition-colors duration-200`}
                    >
                      {activeCommentId === post.id ? "Hide" : "Comment"}
                    </button>

                    {activeCommentId === post.id && (
                      <Comments postId={post.id} theme={theme} />
                    )}

                    <CommentSections postId={post.id} theme={theme} />
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewProfile;
