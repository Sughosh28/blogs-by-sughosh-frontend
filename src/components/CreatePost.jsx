import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
        "http://localhost:8089/api/posts/createPost",
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
      <div
        className={`mt-3 p-6 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-200"
        } rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.01] flex justify-center flex-col`}
      >
        <h3
          className={`text-lg text-center ${
            theme === "dark" ? "text-yellow-100" : "text-black"
          } font-bold mb-4`}
        >
          Post Preview
        </h3>
        <div className="space-y-4">
          <h3
            className={`text-xl p-4 rounded-xl font-bold ${
              theme === "dark"
                ? "text-white bg-zinc-500/80 hover:bg-zinc-500"
                : "text-gray-900 bg-zinc-400/80 hover:bg-zinc-400"
            } transition-colors duration-300`}
          >
            {postData.title}
          </h3>
          <p
            className={`text-md min-h-[40] p-4 rounded-xl ${
              theme === "dark"
                ? "text-white bg-zinc-500/80 hover:bg-zinc-500"
                : "text-black bg-zinc-400/80 hover:bg-zinc-400"
            } break-words transition-colors duration-300 leading-relaxed`}
          >
            {postData.content}
          </p>
        </div>
        {picture && (
          <div className="mt-6 flex justify-center">
            <img
              src={URL.createObjectURL(picture)}
              alt="Preview"
              className="w-72 h-72 object-cover rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            />
          </div>
        )}
      </div>
    );
  };

  switch (step) {
    case 1:
      return (
        <div
          className={`min-h-screen flex items-center justify-center ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-gray-50 to-white"
          }`}
        >
          <div
            className={`max-w-xl mx-auto p-8 ${
              theme === "dark" ? "bg-gray-800/90" : "bg-white/90"
            } backdrop-blur-sm shadow-xl rounded-2xl mt-10 w-11/12 md:w-2/3 border ${
              theme === "dark" ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <h1
              className={`text-4xl font-bold mb-8 ${
                theme === "dark" ? "text-green-400" : "text-gray-800"
              } text-center`}
            >
              Create a New Post
            </h1>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className={`block text-lg font-medium ${
                    theme === "dark" ? "text-green-400" : "text-blue-600"
                  }`}
                >
                  Post Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={postData.title}
                  onChange={handleInputChange("title")}
                  className={`w-full p-4 border-2 rounded-xl ${
                    theme === "dark"
                      ? "bg-gray-700/50 border-gray-600 text-white focus:border-green-500"
                      : "bg-gray-50 border-gray-200 text-black focus:border-blue-500"
                  } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  placeholder="Enter Post Title"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="content"
                  className={`block text-lg font-medium ${
                    theme === "dark" ? "text-green-400" : "text-blue-600"
                  }`}
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={postData.content}
                  onChange={handleInputChange("content")}
                  className={`w-full p-4 border-2 rounded-xl ${
                    theme === "dark"
                      ? "bg-gray-700/50 border-gray-600 text-white focus:border-green-500"
                      : "bg-gray-50 border-gray-200 text-black focus:border-blue-500"
                  } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  placeholder="Enter post content"
                  rows="6"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className={`w-full py-4 px-6 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                } text-white transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg`}
              >
                Next
              </button>
            </form>

            <p
              className={`mt-6 text-center text-lg font-medium ${
                status === "failure" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      );
    case 2:
      return (
        <div
          className={`min-h-screen flex items-center justify-center ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-gray-50 to-white"
          }`}
        >
          <div
            className={`max-w-xl p-8 ${
              theme === "dark" ? "bg-gray-800/90" : "bg-white/90"
            } backdrop-blur-sm shadow-xl rounded-2xl mt-10 w-11/12 md:w-2/3 border ${
              theme === "dark" ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <h1
              className={`text-4xl mt-10 font-bold mb-8 ${
                theme === "dark" ? "text-green-400" : "text-gray-800"
              } text-center`}
            >
              Upload Picture
            </h1>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div
                className={`p-8 rounded-xl border-2 border-dashed ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                } hover:border-blue-500 transition-all duration-300`}
              >
                <label
                  htmlFor="image"
                  className={`block text-lg font-medium mb-4 ${
                    theme === "dark" ? "text-green-400" : "text-blue-600"
                  }`}
                >
                  Choose an Image
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleFileChange}
                  className={`w-full file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 
                    file:text-sm file:font-semibold ${
                      theme === "dark"
                        ? "file:bg-gray-700 file:text-white text-white hover:file:bg-gray-600"
                        : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    } hover:file:cursor-pointer transition-all duration-300`}
                  accept="image/*"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={`px-6 py-3 rounded-xl font-medium ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  } transition-all duration-300 hover:shadow-md`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewVisible(true)}
                  className={`px-6 py-3 rounded-xl font-medium ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  } text-white transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg`}
                >
                  {isLoading ? "Creating Post..." : "Preview Post"}
                </button>
              </div>
            </form>

            {previewVisible && (
              <div
                className={`mt-8 ${
                  theme === "dark" ? "bg-gray-700/50" : "bg-gray-50/50"
                } backdrop-blur-sm rounded-xl p-6 shadow-inner`}
              >
                {renderPreview()}
                <div className="mt-6 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setPreviewVisible(false)}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500  text-white"
                        : "bg-gray-300 hover:bg-gray-400 text-black"
                    }  transition-all duration-300`}
                  >
                    Edit Post
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                        : "bg-gradient-to-r from-green-500 to-emerald-500"
                    } text-white transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg disabled:opacity-50`}
                  >
                    {isLoading ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            )}

            <p
              className={`mt-6 text-center text-lg font-medium ${
                status === "failure" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default CreatePost;
