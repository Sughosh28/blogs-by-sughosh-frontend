import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';

function Comments({ postId, theme }) {
  const [newComment, setNewComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `https://api.blogsbysughosh.xyz/api/comments/${postId}`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            'Content-type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setNewComment('');
        setShowSuccess(true);
        setMessage('Comment posted successfully!');
        setTimeout(() => {
          setMessage('');
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setShowSuccess(false);
      setMessage('Failed to post comment. Please try again.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mt-8 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm ${
        theme === "dark" 
          ? "bg-gray-800/50 border border-gray-700/50" 
          : "bg-white border border-gray-100"
      }`}
    >
      <div className="p-6">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                showSuccess
                  ? theme === "dark"
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-green-50 border border-green-200 text-green-600"
                  : theme === "dark"
                    ? "bg-red-500/10 border border-red-500/20 text-red-400"
                    : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                showSuccess ? "bg-green-500" : "bg-red-500"
              }`} />
              <span className="text-sm font-medium">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`rounded-xl p-4 ${
          theme === "dark" 
            ? "bg-gray-800/50 border border-gray-700/50" 
            : "bg-gray-50 border border-gray-100"
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${
              theme === "dark" ? "bg-gray-700" : "bg-white"
            }`}>
              <FaUserCircle className={`text-2xl ${
                theme === "dark" ? "text-gray-600" : "text-gray-400"
              }`} />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={`w-full p-3 rounded-xl resize-none transition-all duration-300 text-sm
                  ${theme === "dark"
                    ? "bg-gray-700/50 text-white placeholder-gray-400 border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    : "bg-white text-gray-900 placeholder-gray-500 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  } border-2`}
                placeholder="Write a comment..."
                rows="3"
              />
              <div className="mt-3 flex justify-end">
                <motion.button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !newComment.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
                    ${isSubmitting || !newComment.trim()
                      ? theme === "dark"
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Post Comment
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Comments;