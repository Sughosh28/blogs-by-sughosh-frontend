import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload, FaArrowLeft } from "react-icons/fa";

function UploadProfilePicture() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useSelector((state) => state.auth.isDarkMode ? "dark" : "light");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setError("");
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!profilePicture) {
      setError("Please select a file before uploading.");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('file', profilePicture);

    try {
      const response = await axios.post(
        "https://api.blogsbysughosh.xyz/api/users/upload-profile-picture",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Profile picture uploaded successfully!");
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"} transition-all duration-300`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm ${
            theme === "dark" 
              ? "bg-slate-800/50 border border-slate-700/50" 
              : "bg-white border border-gray-100"
          }`}
        >
          {/* Header */}
          <div className="relative h-[20vh] sm:h-[25vh] min-h-[200px] sm:min-h-[250px] w-full overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${
              theme === "dark" 
                ? "from-purple-900/50 via-slate-900/50 to-slate-900/50" 
                : "from-purple-500/30 via-white/30 to-white/30"
            }`} />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMmUyZTIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10" />
            
            <div className="relative h-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <h1 className={`text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${
                  theme === "dark" 
                    ? "from-white to-gray-300" 
                    : "from-gray-900 to-gray-600"
                }`}>Upload Profile Picture</h1>
                <p className={`text-lg sm:text-xl ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>Choose a photo to personalize your profile</p>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="max-w-xl mx-auto">
              {/* Preview */}
              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mb-6"
                  >
                    <div className="relative group">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 blur-xl opacity-50 animate-pulse`} />
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full object-cover ring-4 ring-white/20 shadow-2xl relative z-10"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm ${
                  theme === "dark" 
                    ? "bg-slate-800/50 border border-slate-700/50" 
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                      />
                      <label
                        htmlFor="fileInput"
                        className={`flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                          theme === "dark"
                            ? "border-slate-600 hover:border-purple-500 bg-slate-700/50"
                            : "border-gray-300 hover:border-purple-500 bg-gray-50"
                        }`}
                      >
                        <FaUpload className={`text-3xl sm:text-4xl mb-3 ${
                          theme === "dark" ? "text-purple-400" : "text-purple-600"
                        }`} />
                        <p className={`text-base sm:text-lg font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Click to upload or drag and drop
                        </p>
                        <p className={`text-xs sm:text-sm mt-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}>
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                    </div>

                    {/* Messages */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm ${
                            theme === "dark"
                              ? "bg-red-500/10 border border-red-500/20 text-red-400"
                              : "bg-red-50 border border-red-200 text-red-600"
                          }`}
                        >
                          {error}
                        </motion.div>
                      )}
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm ${
                            theme === "dark"
                              ? "bg-green-500/10 border border-green-500/20 text-green-400"
                              : "bg-green-50 border border-green-200 text-green-600"
                          }`}
                        >
                          {success}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                          theme === "dark"
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        <FaArrowLeft />
                        Back
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={isLoading || !profilePicture}
                        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                          theme === "dark"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        } shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FaUpload />
                            Upload Picture
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default UploadProfilePicture;
