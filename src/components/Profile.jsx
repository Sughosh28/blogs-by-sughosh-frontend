import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaPencilAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePencilSquare } from "react-icons/hi2";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );

  const token = localStorage.getItem("authToken");
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          "https://api.blogsbysughosh.xyz/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails(response.data);
      } catch (error) {
        alert("Error fetching user details:", error);
        setError(
          error.response?.data?.message || "Failed to fetch user details"
        );
        navigate("/login");
      }
    };

    fetchUserDetails();
  }, [navigate, token]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-12 lg:py-16">
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
          {/* Profile header */}
          <div className="relative h-[35vh] sm:h-[30vh] lg:h-[35vh] min-h-[250px] sm:min-h-[300px] lg:min-h-[350px] w-full overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${
              theme === "dark" 
                ? "from-purple-900/50 via-slate-900/50 to-slate-900/50" 
                : "from-purple-500/30 via-white/30 to-white/30"
            }`} />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMmUyZTIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10" />
            
            <div className="relative h-full flex items-center">
              <div className="w-full px-2 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <motion.div 
                    className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 lg:gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                    >
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 blur-xl opacity-50 animate-pulse`} />
                        {userDetails?.profilePicture ? (
                          <img
                            className="w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover ring-4 ring-white/20 shadow-2xl relative z-10"
                            src={`data:image/png;base64,${userDetails.profilePicture}`}
                            alt="Profile Picture"
                          />
                        ) : (
                          <div className={`w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full flex items-center justify-center text-5xl sm:text-6xl font-bold ${
                            theme === "dark" ? "bg-slate-800" : "bg-white"
                          } ring-4 ring-white/20 shadow-2xl relative z-10`}>
                            {userDetails?.username?.[0] || "U"}
                          </div>
                        )}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="absolute bottom-0 right-0 z-20"
                        >
                          <Link to="/upload-profile-picture" 
                            className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20 ring-2 ring-white/20`}>
                            <FaPencilAlt className="text-white text-base sm:text-xl" />
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>

                    <div className="text-center sm:text-left mt-4 sm:mt-0">
                      <motion.h1 
                        className={`text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
                          theme === "dark" 
                            ? "from-white to-gray-300" 
                            : "from-gray-900 to-gray-600"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        {userDetails?.fullName || "N/A"}
                      </motion.h1>
                      <motion.p
                        className={`text-lg sm:text-2xl ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        @{userDetails?.username}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Edit Profile Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="relative z-50"
                  >
                    <Link
                      to="/edit-profile"
                      className={`flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20 ring-2 ring-white/20`}
                      title="Edit Profile"
                    >
                      <HiOutlinePencilSquare className="text-white text-lg sm:text-2xl" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-3 sm:p-6 lg:p-8 mt-20 sm:mt-24 lg:mt-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm ${
                  theme === "dark" 
                    ? "bg-slate-800/50 border border-slate-700/50" 
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="p-3 sm:p-6 lg:p-8">
                  <h2 className={`text-xl sm:text-3xl font-bold mb-3 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r ${
                    theme === "dark" 
                      ? "from-white to-gray-300" 
                      : "from-gray-900 to-gray-600"
                  }`}>About</h2>
                  
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <label className={`font-semibold ${
                        theme === "dark" ? "text-purple-400" : "text-purple-600"
                      }`}>Email:</label>
                      <span className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>{userDetails?.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <label className={`font-semibold ${
                        theme === "dark" ? "text-purple-400" : "text-purple-600"
                      }`}>Role:</label>
                      <span className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>{userDetails?.role}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <label className={`font-semibold ${
                        theme === "dark" ? "text-purple-400" : "text-purple-600"
                      }`}>Bio:</label>
                      <span className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>{userDetails?.bio || "No bio available"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Social Links Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm ${
                  theme === "dark" 
                    ? "bg-slate-800/50 border border-slate-700/50" 
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="p-3 sm:p-6 lg:p-8">
                  <h2 className={`text-xl sm:text-3xl font-bold mb-3 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r ${
                    theme === "dark" 
                      ? "from-white to-gray-300" 
                      : "from-gray-900 to-gray-600"
                  }`}>Social Links</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    {[
                      { icon: FaTwitter, link: userDetails?.twitter, label: "Twitter" },
                      { icon: FaInstagram, link: userDetails?.instagram, label: "Instagram" },
                      { icon: FaGithub, link: userDetails?.github, label: "GitHub" },
                      { icon: FaLinkedin, link: userDetails?.linkedin, label: "LinkedIn" }
                    ].map((social, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl ${
                          theme === "dark"
                            ? "bg-slate-700/50 hover:bg-slate-700/70"
                            : "bg-gray-50 hover:bg-gray-100"
                        } transition-all duration-300`}
                      >
                        <social.icon className={`text-lg sm:text-2xl ${
                          social.link 
                            ? theme === "dark" 
                              ? "text-purple-400" 
                              : "text-purple-600"
                            : theme === "dark"
                              ? "text-gray-600"
                              : "text-gray-400"
                        }`} />
                        <span className={`font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}>{social.label}</span>
                        {social.link && (
                          <a 
                            href={social.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-auto text-purple-400 hover:text-purple-500 transition-colors duration-200"
                          >
                            Visit →
                          </a>
                        )}
                      </motion.div>
                    ))}
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

export default Profile;
