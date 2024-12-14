import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useSelector } from "react-redux";

function UploadProfilePicture() {
  const [profilePicture, setProfilePicture] = useState(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const theme = useSelector((state) => state.auth.isDarkMode ? "dark" : "light");


  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUpload = async () => {
    setIsLoading(true);

    if (!profilePicture) {
      alert("Please select a file before uploading.");
      return;
    }
    

    const formDataToSend = new FormData();
    formDataToSend.append('file', profilePicture);

    try {
      const response = await axios.post(
        "http://localhost:8089/api/users/upload-profile-picture",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );


      if (response.status === 200) {
        navigate("/profile");
        alert("Profile picture uploaded successfully");
        setIsLoading(false);
      } else {
        alert("Failed to upload profile picture");
      }
    } catch (error) {
      alert("Error while uploading profile picture", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-11/12 sm:w-96 border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Upload Profile Picture
        </h2>
  
        <div className="mb-6">
          <label
            htmlFor="fileInput"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
          >
            Select Image
          </label>
          <div className="relative">
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 
              rounded-xl shadow-sm 
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              focus:border-blue-500 dark:focus:border-blue-400 
              focus:outline-none transition-all duration-200 
              hover:border-blue-400 dark:hover:border-blue-500 
              cursor-pointer text-gray-700 dark:text-gray-200
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
              file:text-sm file:font-semibold 
              file:bg-blue-50 dark:file:bg-gray-700 
              file:text-blue-700 dark:file:text-gray-200
              hover:file:bg-blue-100 dark:hover:file:bg-gray-600"
            />
          </div>
        </div>
  
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 
          dark:hover:bg-blue-600 text-white py-3 px-6 
          rounded-xl font-semibold transition-all duration-300 transform 
          hover:scale-[1.02] hover:shadow-lg 
          disabled:opacity-70 disabled:cursor-not-allowed 
          focus:ring-2 focus:ring-offset-2 
          focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Picture"
          )}
        </button>
  
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
          💡 Upload a clear, recent photo to personalize your profile
        </p>
      </div>
    </div>
  );
  
}

export default UploadProfilePicture;
