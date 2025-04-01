import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Comments from "./Comments";
import CommentSections from "./CommentSections";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { HiOutlinePlusCircle } from "react-icons/hi";

function ViewProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [comments, setComments] = useState({});
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );
  const token = localStorage.getItem("authToken");
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  const toggleComments = (postId) => {
    setActiveCommentId(activeCommentId === postId ? null : postId);
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(
        `https://api.blogsbysughosh.xyz/api/comments/getComments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(prev => ({
        ...prev,
        [postId]: response.data
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://api.blogsbysughosh.xyz/api/posts/getUserProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
        // Fetch comments for all posts
        if (response.data.posts) {
          response.data.posts.forEach(post => {
            fetchComments(post.id);
          });
        }
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
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-violet-200 border-opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  const formatDateAndTime = (createdDate, createdTime) => {
    const formattedTime = createdTime || "Time";
    const formattedDate = createdDate || "Date";
    return `${formattedDate} | ${formattedTime}`;
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"} transition-all duration-300 pb-20 md:pb-0`}>
      {/* Hero Section */}
      <motion.div 
        className="relative h-[40vh] sm:h-[50vh] min-h-[400px] w-full overflow-hidden"
        style={{ opacity }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${
          theme === "dark" 
            ? "from-purple-900/50 via-slate-900/50 to-slate-900/50" 
            : "from-purple-500/30 via-white/30 to-white/30"
        }`} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMmUyZTIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div 
            className="flex flex-col md:flex-row items-center md:items-start gap-12 w-full"
            style={{ scale, y }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {profile.profile.profilePicture ? (
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 blur-xl opacity-50 animate-pulse`} />
                  <img
                    src={`data:image/png;base64,${profile.profile.profilePicture}`}
                    alt={profile.profile.username}
                    className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover ring-4 ring-white/20 shadow-2xl relative z-10"
                  />
                </div>
              ) : (
                <div className={`w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full flex items-center justify-center text-6xl font-bold ${
                  theme === "dark" ? "bg-slate-800" : "bg-white"
                } ring-4 ring-white/20 shadow-2xl relative z-10`}>
                  {profile.profile.username
                    ? profile.profile.username[0].toUpperCase()
                    : ""}
                </div>
              )}
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <motion.h1 
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
                  theme === "dark" 
                    ? "from-white to-gray-300" 
                    : "from-gray-900 to-gray-600"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {profile.profile.fullName}
              </motion.h1>
              <motion.p
                className={`text-xl sm:text-2xl mb-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                @{profile.profile.username}
              </motion.p>
              <motion.p
                className={`text-base sm:text-lg ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } max-w-2xl`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {profile.profile.bio || "No bio available"}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Posts Grid */}
          <div className="lg:col-span-2">
            <motion.h2 
              className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r ${
                theme === "dark" 
                  ? "from-white to-gray-300" 
                  : "from-gray-900 to-gray-600"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Posts
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <AnimatePresence>
                {profile.posts && profile.posts.length > 0 ? (
                  profile.posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm ${
                        theme === "dark"
                          ? "bg-slate-800/50 hover:bg-slate-700/50"
                          : "bg-white hover:bg-gray-50"
                      } border ${
                        theme === "dark" ? "border-slate-700/50" : "border-gray-100"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              theme === "dark" ? "bg-slate-700" : "bg-gray-100"
                            }`}>
                              <span className={`text-lg font-medium ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}>
                                {post.authorName[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className={`font-medium ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}>
                                {post.authorName}
                              </p>
                              <p className={`text-sm ${
                                theme === "dark" ? "text-gray-400" : "text-gray-500"
                              }`}>
                                {formatDateAndTime(post.createdDate, post.createdTime)}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleComments(post.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                              theme === "dark"
                                ? "text-gray-400 hover:text-white hover:bg-slate-700/50"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            <motion.svg
                              className="w-4 h-4"
                              animate={{ rotate: activeCommentId === post.id ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </motion.svg>
                            <span className="text-sm font-medium">Comment</span>
                          </motion.button>
                        </div>

                        <div className="mb-4">
                          <h3 className={`text-xl font-bold mb-2 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>
                            {post.title || "Untitled"}
                          </h3>
                          <p className={`text-base ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}>
                            {post.content || "No content"}
                          </p>
                        </div>

                        <AnimatePresence>
                          {activeCommentId === post.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4"
                            >
                              <Comments 
                                postId={post.id} 
                                theme={theme} 
                                comments={comments[post.id] || []}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="mt-4">
                          <CommentSections 
                            postId={post.id} 
                            theme={theme} 
                            onCommentAdded={() => fetchComments(post.id)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col items-center justify-center py-12 text-center rounded-2xl shadow-xl backdrop-blur-sm ${
                      theme === "dark"
                        ? "bg-slate-800/50 border border-slate-700/50"
                        : "bg-white border border-gray-100"
                    } md:col-span-2`}
                  >
                    <HiOutlinePlusCircle className={`w-16 h-16 mb-4 ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`} />
                    <h3 className={`text-xl font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      No Posts Yet
                    </h3>
                    <p className={`mb-6 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      This user hasn&apos;t shared any posts yet
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
