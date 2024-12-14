import { useState } from 'react';
import axios from 'axios';

function Comments({ postId, theme,  }) {
  const [newComment, setNewComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');
  

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8089/api/comments/${postId}`,
        {content: newComment},
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
        setTimeout(() => 
          setMessage(''),
            setShowSuccess(false),
        3000); 
      }
    } catch (error) {
      setShowSuccess(false);
      setMessage('Failed to post comment. Please try again.', +error);
      setTimeout(() => 
        setMessage(''),
      3000); 
    }
  };

  return (
    <div className={`mt-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}>
      <div className="p-4">
        {showSuccess && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {message}
            </span>
          </div>
        )}
        <div className={`mb-4 ${theme === "dark" ? "bg-gray-600" : "bg-white"} rounded-lg p-4`}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`w-full p-2 rounded-lg mb-2 ${
              theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-800"
            }`}
            placeholder="Write a comment..."
            rows="3"
          />
          <button
            onClick={handleSubmitComment}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Comments;