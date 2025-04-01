import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaImage, FaArrowLeft, FaArrowRight, FaEye, FaEdit, FaPaperPlane } from "react-icons/fa";
import {
  createPostFailure,
  createPostRequest,
  createPostSuccess,
  resetPostData,
  updatePostData,
  postsNextStep,
  postsPrevStep,
} from "../state/Slice";

function CreatePost() {
  const [navigateAfterSuccess, setNavigateAfterSuccess] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { step, postData, status, error } = useSelector(
    (state) => state.auth.createPost
  );
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const [picture, setPicture] = useState(null);

  const handleInputChange = (input) => (e) => {
    dispatch(updatePostData({ [input]: e.target.value }));
  };

  const handleNext = () => {
    dispatch(postsNextStep());
  };

  const handlePrev = () => {
    dispatch(postsPrevStep());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    dispatch(
      updatePostData({
        picture_name: file.name,
        imageType: file.type,
      })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setPicture(file);
      dispatch(
        updatePostData({
          picture_name: file.name,
          imageType: file.type,
        })
      );
    }
  };

  const formData = new FormData();
  formData.append(
    "dto",
    new Blob([JSON.stringify(postData)], { type: "application/json" })
  );
  if (picture) {
    formData.append("file", picture);
  }

  useEffect(() => {
    if (navigateAfterSuccess) {
      navigate("/feed");
    }
  }, [navigate, navigateAfterSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(createPostRequest());
    try {
      if (!token) {
        navigate("/login");
      }

      const response = await axios.post(
        "https://api.blogsbysughosh.xyz/api/posts/createPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        dispatch(createPostSuccess());
        setMessage(response.data.message);
        setTimeout(() => {
          setMessage("");
          dispatch(resetPostData());
          dispatch(postsPrevStep());
          setNavigateAfterSuccess(true);
        }, 2500);
      } else {
        dispatch(createPostFailure());
        setMessage(response.data);
      }
    } catch (e) {
      dispatch(createPostFailure({ error: e.message }));
      setMessage("Something went wrong. " + e.message);
      setTimeout(() => {
        setMessage("");
      }, 3500);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "failure") {
      setMessage(error);
      setTimeout(() => {
        setMessage("");
      }, 3500);
    }
  }, [status, error]);

  const renderPreview = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-6 rounded-2xl shadow-xl overflow-hidden ${
          theme === "dark"
            ? "bg-slate-800/50 border border-slate-700/50"
            : "bg-white/80 border border-gray-100/80"
        } backdrop-blur-sm`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${
          theme === "dark" ? "border-slate-700/50" : "border-gray-100"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-medium">U</span>
              </div>
              <div>
                <h3 className={`font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>Your Name</h3>
                <p className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>Posted just now</p>
              </div>
            </div>
            <div className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className={`absolute -left-4 top-0 w-1 h-full rounded-full bg-gradient-to-b from-purple-500 to-pink-500`} />
            <h2 className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              {postData.title}
            </h2>
          </motion.div>

          {/* Content Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`prose prose-lg max-w-none ${
              theme === "dark" ? "prose-invert" : ""
            }`}
          >
            <p className={`whitespace-pre-wrap ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              {postData.content}
            </p>
          </motion.div>

          {/* Image */}
          {picture && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={URL.createObjectURL(picture)}
                  alt="Preview"
                  className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className={`p-4 rounded-lg backdrop-blur-sm ${
                    theme === "dark" ? "bg-black/50" : "bg-white/90"
                  }`}>
                    <div className="flex items-center gap-2 text-sm">
                      <FaImage className={`${
                        theme === "dark" ? "text-purple-400" : "text-purple-600"
                      }`} />
                      <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        {picture.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex items-center justify-between pt-4 border-t ${
              theme === "dark" ? "border-slate-700/50" : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-slate-700/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium">Like</span>
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-slate-700/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium">Comment</span>
              </button>
            </div>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-white hover:bg-slate-700/50"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-sm font-medium">Share</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-screen flex items-center justify-center p-4 sm:p-8 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rotate-12 opacity-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full -rotate-12 opacity-10 bg-gradient-to-br from-blue-500/20 to-green-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`relative max-w-2xl w-full mx-auto p-6 sm:p-8 rounded-2xl shadow-2xl ${
          theme === "dark"
            ? "bg-gray-800/50 border border-gray-700/50"
            : "bg-white/80 border border-gray-100/80"
        } backdrop-blur-xl`}
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl sm:text-4xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Create a New Post
          </motion.h1>
          <p className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
            Share your thoughts with the world
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <label
              htmlFor="title"
              className={`block text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Post Title
            </label>
            <input
              type="text"
              id="title"
              value={postData.title}
              onChange={handleInputChange("title")}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              }`}
              placeholder="Enter a catchy title"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label
              htmlFor="content"
              className={`block text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Content
            </label>
            <textarea
              id="content"
              value={postData.content}
              onChange={handleInputChange("content")}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              }`}
              placeholder="Write your post content here..."
              rows="6"
              required
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            type="button"
            onClick={handleNext}
            className={`w-full py-3 px-6 rounded-xl font-medium text-white
              transition-all duration-300 transform hover:scale-[1.02]
              bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
              focus:outline-none focus:ring-2 focus:ring-purple-500
              ${theme === "dark" ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
          >
            <span className="flex items-center justify-center gap-2">
              Next Step
              <FaArrowRight className="text-sm" />
            </span>
          </motion.button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-6 text-center text-sm font-medium ${
                status === "failure" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-screen flex items-center justify-center p-4 sm:p-8 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rotate-12 opacity-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full -rotate-12 opacity-10 bg-gradient-to-br from-blue-500/20 to-green-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`relative max-w-2xl w-full mx-auto p-6 sm:p-8 rounded-2xl shadow-2xl ${
          theme === "dark"
            ? "bg-gray-800/50 border border-gray-700/50"
            : "bg-white/80 border border-gray-100/80"
        } backdrop-blur-xl`}
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl sm:text-4xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Add an Image
          </motion.h1>
          <p className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
            Make your post more engaging with a visual
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative p-8 rounded-xl border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? theme === "dark"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-purple-500 bg-purple-50"
                : theme === "dark"
                  ? "border-gray-600 hover:border-purple-500"
                  : "border-gray-300 hover:border-purple-500"
            }`}
          >
            <div className="text-center">
              <FaImage className={`mx-auto text-4xl mb-4 ${
                theme === "dark" ? "text-purple-400" : "text-purple-600"
              }`} />
              <label
                htmlFor="image"
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {picture ? "Change Image" : "Choose an Image"}
              </label>
              <p className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Drag and drop or click to upload
              </p>
            </div>
            <input
              type="file"
              id="image"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
          </motion.div>

          <div className="flex items-center justify-between gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              type="button"
              onClick={handlePrev}
              className={`flex-1 py-3 px-6 rounded-xl font-medium
                transition-all duration-300
                border-2 ${
                  theme === "dark"
                    ? "border-gray-700 bg-gray-800 text-gray-300"
                    : "border-gray-300 bg-white text-gray-700"
                }
                hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <span className="flex items-center justify-center gap-2">
                <FaArrowLeft className="text-sm" />
                Back
              </span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              type="button"
              onClick={() => setPreviewVisible(true)}
              className={`flex-1 py-3 px-6 rounded-xl font-medium text-white
                transition-all duration-300 transform hover:scale-[1.02]
                bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
                focus:outline-none focus:ring-2 focus:ring-purple-500
                ${theme === "dark" ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
            >
              <span className="flex items-center justify-center gap-2">
                <FaEye className="text-sm" />
                Preview Post
              </span>
            </motion.button>
          </div>
        </form>

        <AnimatePresence>
          {previewVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              {renderPreview()}
              <div className="mt-6 flex gap-4">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  type="button"
                  onClick={() => setPreviewVisible(false)}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium
                    transition-all duration-300
                    border-2 ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-800 text-gray-300"
                        : "border-gray-300 bg-white text-gray-700"
                    }
                    hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaEdit className="text-sm" />
                    Edit Post
                  </span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium text-white
                    transition-all duration-300 transform hover:scale-[1.02]
                    bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
                    focus:outline-none focus:ring-2 focus:ring-purple-500
                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                    ${theme === "dark" ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-sm" />
                        Post
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-6 text-center text-sm font-medium ${
                status === "failure" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );

  switch (step) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    default:
      return null;
  }
}

export default CreatePost;
