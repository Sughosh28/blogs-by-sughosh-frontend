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
          "http://blogsbysughosh.xyz:8089/api/users/profile",
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
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-100"
    }`}>
      <div className={`py-20 min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900/95" : "bg-gray-50/95"
      }`}>
        <div className={`container mx-auto p-8 max-w-4xl ${
          theme === "dark" 
            ? "bg-gray-800 shadow-xl shadow-gray-700/20" 
            : "bg-white shadow-xl shadow-gray-200/60"
        } rounded-2xl transition-all duration-300`}>

          {/* Profile header with improved spacing */}
          <h1 className={`text-4xl font-bold mb-8 text-center ${
            theme === "dark" ? "text-white" : "text-green-600"
          } transition-colors duration-300`}>
            User Profile
          </h1>

          {error && (
            <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
          )}

          {userDetails ? (
            <div className="space-y-6">
              {/* Profile picture section with better hover effects */}
              <div className="flex items-center space-x-6 border-b border-opacity-20 pb-6 mb-8">
                <div className="relative group">
                  <div className={`w-32 h-32 rounded-full overflow-hidden ring-4 ring-opacity-50 ${
                    theme === "dark" ? "ring-green-500" : "ring-orange-400"
                  }`}>
                    {userDetails.profilePicture ? (
                      <img
                        className="w-full h-full object-cover"
                        src={`data:image/png;base64,${userDetails.profilePicture}`}
                        alt="Profile Picture"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-500 flex items-center justify-center text-2xl font-bold">
                        {userDetails.username?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <Link to="/upload-profile-picture" 
                    className={`absolute bottom-0 right-0 p-2 rounded-full ${
                      theme === "dark" 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-orange-500 hover:bg-orange-600"
                    } transition-colors duration-200`}>
                    <FaPencilAlt className="text-white text-sm" />
                  </Link>
                </div>
                <div className="flex-1">
                  <h2 className={`text-xl ${
                    theme === "dark" ? "text-white" : "text-green-500"
                  } font-semibold`}>
                    {userDetails.fullName || "N/A"}
                  </h2>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-green-500" : "text-orange-500"
                  }`}>
                    {userDetails.username}
                  </p>
                </div>
                <div>
                  <Link
                    to="/edit-profile"
                    className={`${
                      theme === "dark" ? "text-green-500" : "text-orange-500"
                    } underline px-4 py-2 rounded-md hover:text-orange-500 transition duration-200`}
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>

             
              <div className="space-y-6">
                <div className={`p-4 rounded-lg ${
                  theme === "dark" 
                    ? "bg-gray-700/50 hover:bg-gray-700/70" 
                    : "bg-gray-50 hover:bg-gray-100"
                } transition-all duration-200`}>
                  <h1 className={`text-xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-green-500"
                  }`}>
                    Other info
                  </h1>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <label className={`font-semibold underline ${
                        theme === "dark" ? "text-green-500" : "text-orange-500"
                      }`}>
                        Email:
                      </label>
                      <span className={`${
                        theme === "dark" ? "text-white" : "text-green-500"
                      }`}>
                        {userDetails.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className={`font-semibold underline ${
                        theme === "dark" ? "text-green-500" : "text-orange-500"
                      }`}>
                        Role:
                      </label>
                      <span className={`${
                        theme === "dark" ? "text-white" : "text-green-500"
                      }`}>
                        {userDetails.role}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className={`font-semibold underline ${
                        theme === "dark" ? "text-green-500" : "text-orange-500"
                      }`}>
                        Bio:
                      </label>
                      <span className={`${
                        theme === "dark" ? "text-white" : "text-green-500"
                      }`}>
                        {userDetails.bio || "You have not set a bio yet."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  theme === "dark" 
                    ? "bg-gray-700/50 hover:bg-gray-700/70" 
                    : "bg-gray-50 hover:bg-gray-100"
                } transition-all duration-200`}>
                  <h1 className={`text-xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-green-500"
                  }`}>
                    Other links
                  </h1>
                  <div className="flex gap-6 mt-4">
                    {[
                      { icon: FaTwitter, link: userDetails.twitter },
                      { icon: FaInstagram, link: userDetails.instagram },
                      { icon: FaGithub, link: userDetails.github },
                      { icon: FaLinkedin, link: userDetails.linkedin }
                    ].map((social, index) => (
                      <div key={index} className={`transform hover:scale-110 transition-transform duration-200 ${
                        social.link ? "cursor-pointer" : "opacity-50"
                      }`}>
                        {social.link ? (
                          <a href={social.link} target="_blank" rel="noopener noreferrer">
                            <social.icon className={`text-2xl ${
                              theme === "dark" 
                                ? "text-white hover:text-green-400" 
                                : "text-orange-500 hover:text-green-500"
                            } transition-colors duration-200`} />
                          </a>
                        ) : (
                          <social.icon className={`text-2xl ${
                            theme === "dark" ? "text-white" : "text-orange-500"
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid">
                <p className="text-center mt-10 text-red-500">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile;
