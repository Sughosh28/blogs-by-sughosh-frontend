import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Comments from "./Comments";
import CommentSections from "./CommentSections";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const navigate = useNavigate();
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.blogsbysughosh.xyz/api/posts/feedPosts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data.body);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [navigate]);

  const formatDateAndTime = (createdDate, createdTime) => {
    const formattedTime = createdTime || "Time";
    const formattedDate = createdDate || "Date";
    return `${formattedDate} | ${formattedTime}`;
  };

  const handleCommentClick = (postId) => {
    setActiveCommentId(activeCommentId === postId ? null : postId);
  };

  return (
    <>
      {loading ? (
        <div
          className={`flex ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } justify-center items-center min-h-screen`}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500">
            <p className="text-center mt-10 text-red-500">{error}</p>
          </div>
        </div>
      ) : (
        <div
          className={`min-h-screen ${
            theme === "dark" ? "bg-gray-800" : "bg-zinc-50"
          } transition-colors duration-200`}
        >
          <div
            className={`max-w-4xl mx-auto ${
              theme === "dark" ? "bg-gray-800" : "bg-zinc-50"
            } px-4 sm:px-6 lg:px-8 py-20`}
          >
            <h1
              className={`text-4xl font-extrabold text-center mb-10 ${
                theme === "dark" ? "text-white" : "text-green-500"
              } transition-colors duration-200`}
            >
              Posts for you!
            </h1>
            {posts.length === 0 ? (
              <p
                className={`text-lg text-center font-medium ${
                  theme === "dark" ? "text-white" : "text-orange-500"
                }`}
              >
                No posts available.
              </p>
            ) : (
              <div className="grid gap-8">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={`${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-50"
                    } rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-1 shadow-lg`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {post.authorName?.[0] || "A"}
                        </span>
                      </div>
                      <h2
                        className={`text-xl font-bold ${
                          theme === "dark" ? "text-gray-200" : "text-orange-500"
                        }`}
                      >
                        {post.authorName || "Anonymous"}
                      </h2>
                    </div>

                    <h3
                      className={`text-xl mb-4 font-bold ${
                        theme === "dark" ? "text-zinc-300" : "text-green-600"
                      }`}
                    >
                      {post.title || "Untitled Post"}
                    </h3>

                    <p
                      className={`mb-6 leading-relaxed ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {post.content || "No content available."}
                    </p>

                    {post.picture_content && (
                      <img
                        src={`data:image/png;base64,${post.picture_content}`}
                        alt="Post Content"
                        className="w-full rounded-lg object-cover mb-6 shadow-md"
                      />
                    )}

                    <div className="flex items-center justify-between border-t pt-4 mt-4">
                      <small
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {formatDateAndTime(post.createdDate, post.createdTime)}
                      </small>

                      <div className="flex space-x-4">
                        <button className="flex items-center px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
                          <svg
                            className="w-5 h-5 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                          Like
                        </button>
                        <button
                          onClick={() => handleCommentClick(post.id)}
                          className={`flex items-center px-4 py-2 rounded-full ${
                            theme === "dark"
                              ? "bg-gray-600 hover:bg-gray-500"
                              : "bg-gray-200 hover:bg-gray-300"
                          } transition-colors duration-200`}
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          Comment
                        </button>
                      </div>
                    </div>

                    {activeCommentId === post.id && (
                      <Comments postId={post.id} theme={theme} />
                    )}

                    <CommentSections postId={post.id} theme={theme} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Feed;
