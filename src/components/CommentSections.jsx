import  { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function CommentSections({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showAllComments, setShowAllComments] = useState(false);
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8089/api/comments/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
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
    <div className={`max-w-full mx-auto ${theme==='dark'?'bg-gray-700':'bg-white'} mt-2 px-2`}>
      {loading ? (
        <div className="flex justify-center items-center h-16">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {showAllComments && (
            <button
              onClick={() => setShowAllComments(false)}
              className={`flex items-center text-sm ${theme==='dark'?'text-gray-100':'text-black'} ${theme==='dark'?'hover:text-gray-200':'  hover:text-gray-700'}`}
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          )}
          {comments.length>0?(
          <h3 className={`text-md font-bold ${theme==='dark'?'text-white':'text-gray-500'} p-2 `}>Comments</h3>
        ):(
          <h3 className={`text-md font-bold ${theme==='dark'?'text-white':'text-gray-500'} p-2 `}> No Comments</h3>
        )}

          {!showAllComments && comments.length > 0 && (
            <div
              onClick={() => setShowAllComments(true)}
              className="bg-white rounded-lg shadow-sm p-2 hover:shadow-md transition-shadow duration-300 border border-gray-300 cursor-pointer flex flex-col items-left
              justify-center"
            >
              <div
                className="flex items-center mb-1"
                onClick={() => navigate(`/profile/${comments[0].user?.id}`)}
              >
                <img
                  src={
                    comments[0].user?.profilePicture
                      ? `data:image/png;base64,${comments[0].user?.profilePicture}`
                      : "default-avatar.png"
                  }
                  alt={comments[0].user?.fullName}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
                <div>
                  <p className="font-medium text-gray-800 text-xs">
                    {comments[0].user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateAndTime(
                      comments[0].created_Time,
                      comments[0].created_Date
                    )}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                {comments[0].content}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {comments.length === 1
                  ? "1 comment"
                  : ` View all ${comments.length} comments`}
              </p>
            </div>
          )}

          {showAllComments &&
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-md shadow-sm p-3 hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div
                  className="flex items-center mb-1"
                  onClick={() => navigate(`/profile/${comments[0].user?.id}`)}
                >
                  <img
                    src={
                      comments[0].user?.profilePicture
                        ? `data:image/png;base64,${comments[0].user?.profilePicture}`
                        : "default-avatar.png"
                    }
                    alt={comment.user?.fullName}
                    className="w-6 h-6 rounded-full object-cover mr-2"
                  />
                  <div>
                    <p className="font-medium text-gray-800 text-xs">
                      {comment.user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateAndTime(
                        comment.created_Time,
                        comment.created_Date
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default CommentSections;
