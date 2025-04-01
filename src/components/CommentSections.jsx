import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaComments, FaRegClock } from "react-icons/fa";

function CommentSections({ postId, theme }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://api.blogsbysughosh.xyz/api/comments/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setLoading(false);
      }
    };

    fetchComments();
  }, [navigate, postId]);

  const formatDateAndTime = (createdDate, createdTime) => {
    const formattedTime = createdTime || "Time";
    const formattedDate = createdDate || "Date";
    return `${formattedDate} | ${formattedTime}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mt-8 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl ${
        theme === "dark"
          ? "bg-gray-800/30 border border-gray-700/30"
          : "bg-white/80 border border-gray-100/80"
      }`}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rotate-12 opacity-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full -rotate-12 opacity-10 bg-gradient-to-br from-blue-500/20 to-green-500/20 blur-3xl" />
      </div>

      <div className="relative p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FaComments className={`text-xl animate-pulse ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {showAllComments && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setShowAllComments(false)}
                  className={`group flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FaChevronLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
                  Back to Summary
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
              }`}>
                <FaComments className={`text-2xl ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`} />
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {comments.length > 0 ? "Comments" : "No Comments"}
                </h3>
                <p className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  {comments.length} {comments.length === 1 ? "comment" : "comments"}
                </p>
              </div>
            </div>

            {!showAllComments && comments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowAllComments(true)}
                className={`group relative rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50"
                    : "bg-gray-50 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                <div
                  className="flex items-center gap-3 mb-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${comments[0].user?.id}`);
                  }}
                >
                  <div className={`relative w-12 h-12 rounded-full overflow-hidden ring-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "ring-purple-500/20 group-hover:ring-purple-500/40"
                      : "ring-purple-500/20 group-hover:ring-purple-500/40"
                  }`}>
                    {comments[0].user?.profilePicture ? (
                      <img
                        src={`data:image/png;base64,${comments[0].user?.profilePicture}`}
                        alt={comments[0].user?.fullName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-xl font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } bg-gradient-to-br from-purple-500 to-pink-500`}>
                        {comments[0].user?.fullName?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {comments[0].user?.fullName}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <FaRegClock className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                        {formatDateAndTime(
                          comments[0].created_Time,
                          comments[0].created_Date
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  {comments[0].content}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`}>
                    {comments.length === 1
                      ? "1 comment"
                      : `View all ${comments.length} comments`}
                  </p>
                  <FaChevronLeft className={`text-xs transition-transform duration-300 ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  } group-hover:translate-x-1`} />
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {showAllComments && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`group relative rounded-xl p-4 transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-100"
                      }`}
                    >
                      <div
                        className="flex items-center gap-3 mb-3 cursor-pointer"
                        onClick={() => navigate(`/profile/${comment.user?.id}`)}
                      >
                        <div className={`relative w-12 h-12 rounded-full overflow-hidden ring-2 transition-all duration-300 ${
                          theme === "dark"
                            ? "ring-purple-500/20 group-hover:ring-purple-500/40"
                            : "ring-purple-500/20 group-hover:ring-purple-500/40"
                        }`}>
                          {comment.user?.profilePicture ? (
                            <img
                              src={`data:image/png;base64,${comment.user?.profilePicture}`}
                              alt={comment.user?.fullName}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center text-xl font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            } bg-gradient-to-br from-purple-500 to-pink-500`}>
                              {comment.user?.fullName?.[0] || "?"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>
                            {comment.user?.fullName}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <FaRegClock className={`${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`} />
                            <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                              {formatDateAndTime(
                                comment.created_Time,
                                comment.created_Date
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        {comment.content}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

CommentSections.propTypes = {
  postId: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired
};

export default CommentSections;
