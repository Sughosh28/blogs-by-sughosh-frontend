import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommentSections from "./CommentSections";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaShare } from "react-icons/fa";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [sharedPostId, setSharedPostId] = useState(null);
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

  const handleCommentSubmit = async (postId) => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "https://api.blogsbysughosh.xyz/api/comments/create",
        {
          postId,
          content: newComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      setCommentingPostId(null);
      // Refresh comments by toggling the comments section
      handleCommentClick(postId);
      handleCommentClick(postId);
    } catch (err) {
      console.error("Error creating comment:", err);
      setError(err.response?.data?.message || "Error creating comment");
    }
  };

  const handleShare = async (postId) => {
    setSharedPostId(postId);
    setShowShareNotification(true);
    setTimeout(() => {
      setShowShareNotification(false);
      setSharedPostId(null);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"} transition-all duration-300`}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-violet-200 border-opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            } transition-colors duration-300`}>
              Your Feed
            </h1>
            <p className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              Discover stories from your network
            </p>
          </motion.div>

          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col items-center justify-center py-12 px-4 rounded-2xl ${
                theme === "dark" 
                  ? "bg-slate-800/50 border border-slate-700/50" 
                  : "bg-white border border-gray-100"
              } backdrop-blur-sm`}
            >
              <div className={`w-16 h-16 rounded-full ${
                theme === "dark" ? "bg-slate-700" : "bg-gray-100"
              } flex items-center justify-center mb-4`}>
                <svg 
                  className={`w-8 h-8 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" 
                  />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                No Posts Yet
              </h3>
              <p className={`text-sm text-center max-w-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Be the first to share your story! Connect with others and start posting.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`${
                      theme === "dark" 
                        ? "bg-slate-800/50 hover:bg-slate-700/50" 
                        : "bg-white hover:bg-gray-50/80"
                    } rounded-2xl shadow-lg overflow-hidden transition-all duration-300 backdrop-blur-sm border ${
                      theme === "dark" ? "border-slate-700/50" : "border-gray-100"
                    }`}
                  >
                    <div className="p-4 sm:p-6">
                      {/* Author Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                            <span className="text-base font-semibold text-white">
                              {post.authorName?.[0] || "A"}
                            </span>
                          </div>
                        </motion.div>
                        <div>
                          <h2 className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                          }`}>
                            {post.authorName || "Anonymous"}
                          </h2>
                          <p className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}>
                            {formatDateAndTime(post.createdDate, post.createdTime)}
                          </p>
                        </div>
                      </div>

                      {/* Post Content */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className={`text-xl font-bold mb-2 ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}>
                          {post.title || "Untitled Post"}
                        </h3>

                        <p className={`mb-4 text-sm leading-relaxed ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}>
                          {post.content || "No content available."}
                        </p>
                      </motion.div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCommentClick(post.id)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg ${
                              theme === "dark"
                                ? "bg-slate-700 hover:bg-slate-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            } transition-colors duration-300 shadow-md ${
                              theme === "dark" ? "shadow-slate-700/20" : "shadow-gray-200/20"
                            }`}
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-sm">Comments</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleShare(post.id)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg ${
                              theme === "dark"
                                ? "bg-slate-700 hover:bg-slate-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            } transition-colors duration-300 shadow-md ${
                              theme === "dark" ? "shadow-slate-700/20" : "shadow-gray-200/20"
                            }`}
                          >
                            <FaShare className="w-4 h-4 mr-1.5" />
                            <span className="text-sm">Share</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Share Notification */}
                      <AnimatePresence>
                        {showShareNotification && sharedPostId === post.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
                              theme === "dark"
                                ? "bg-yellow-500 text-white"
                                : "bg-yellow-500 text-white"
                            }`}
                          >
                            This function is under development
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {activeCommentId === post.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                          >
                            {/* Comments Display */}
                            <CommentSections postId={post.id} theme={theme} />

                            {/* Comment Input */}
                            <div className={`mt-4 p-3 rounded-lg ${
                              theme === "dark" 
                                ? "bg-slate-700/50 border border-slate-600/50" 
                                : "bg-gray-50 border border-gray-200"
                            }`}>
                              <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className={`w-full p-2 rounded-lg resize-none focus:outline-none ${
                                  theme === "dark"
                                    ? "bg-slate-800 text-white placeholder-gray-400"
                                    : "bg-white text-gray-900 placeholder-gray-500"
                                }`}
                                rows="2"
                              />
                              <div className="flex justify-end mt-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleCommentSubmit(post.id)}
                                  disabled={!newComment.trim()}
                                  className={`inline-flex items-center px-4 py-2 rounded-lg ${
                                    theme === "dark"
                                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                                      : "bg-purple-500 hover:bg-purple-600 text-white"
                                  } transition-colors duration-300 ${
                                    !newComment.trim() ? "opacity-50 cursor-not-allowed" : ""
                                  }`}
                                >
                                  <FaPaperPlane className="w-4 h-4 mr-2" />
                                  <span className="text-sm">Post Comment</span>
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Feed;
