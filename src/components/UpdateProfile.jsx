import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLink, FaTwitter, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

function UpdateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    role: "",
    bio: "",
    github: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    profilePicture: " ",
  });

  const token = localStorage.getItem("authToken");
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://api.blogsbysughosh.xyz/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(response.data);
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Authentication required. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    try {
      const response = await axios.put(
        "https://api.blogsbysughosh.xyz/api/users/profile",
        {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          role: formData.role,
          bio: formData.bio,
          github: formData.github,
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          setSuccess("");
          navigate("/profile");
        }, 2000);
      } else {
        setError("Error updating profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-purple-200 border-opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
          <div className="relative h-[30vh] sm:h-[40vh] min-h-[300px] sm:min-h-[400px] w-full overflow-hidden">
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
                <h1 className={`text-4xl sm:text-5xl font-bold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
                  theme === "dark" 
                    ? "from-white to-gray-300" 
                    : "from-gray-900 to-gray-600"
                }`}>Update Profile</h1>
                <p className={`text-xl sm:text-2xl ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>Update your profile information</p>
              </motion.div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {/* Basic Info */}
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
                <div className="p-4 sm:p-8">
                  <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r ${
                    theme === "dark" 
                      ? "from-white to-gray-300" 
                      : "from-gray-900 to-gray-600"
                  }`}>Basic Information</h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <FaUser className={`text-xl sm:text-2xl ${
                          theme === "dark" ? "text-purple-400" : "text-purple-600"
                        }`} />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm sm:text-base ${
                          theme === "dark"
                            ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className={`text-xl sm:text-2xl ${
                          theme === "dark" ? "text-purple-400" : "text-purple-600"
                        }`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm sm:text-base ${
                          theme === "dark"
                            ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <FaLink className={`text-xl sm:text-2xl ${
                          theme === "dark" ? "text-purple-400" : "text-purple-600"
                        }`} />
                      </div>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Bio"
                        rows="3"
                        className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm sm:text-base ${
                          theme === "dark"
                            ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm ${
                  theme === "dark" 
                    ? "bg-slate-800/50 border border-slate-700/50" 
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="p-4 sm:p-8">
                  <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r ${
                    theme === "dark" 
                      ? "from-white to-gray-300" 
                      : "from-gray-900 to-gray-600"
                  }`}>Social Links</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { icon: FaTwitter, name: "twitter", label: "Twitter" },
                      { icon: FaInstagram, name: "instagram", label: "Instagram" },
                      { icon: FaGithub, name: "github", label: "GitHub" },
                      { icon: FaLinkedin, name: "linkedin", label: "LinkedIn" }
                    ].map((social, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <social.icon className={`text-xl sm:text-2xl ${
                            theme === "dark" ? "text-purple-400" : "text-purple-600"
                          }`} />
                        </div>
                        <input
                          type="url"
                          name={social.name}
                          value={formData[social.name]}
                          onChange={handleInputChange}
                          placeholder={`${social.label} URL`}
                          className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm sm:text-base ${
                            theme === "dark"
                              ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3 sm:p-4 rounded-xl text-sm sm:text-base ${
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
                    className={`p-3 sm:p-4 rounded-xl text-sm sm:text-base ${
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                    theme === "dark"
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                    theme === "dark"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  } shadow-lg shadow-purple-500/20`}
                >
                  Save Changes
                </button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default UpdateProfile; 