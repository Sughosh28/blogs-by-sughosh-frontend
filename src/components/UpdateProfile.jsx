import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function UpdateProfile() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
          "http://localhost:8089/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(response.data);
      } catch (err) {
        setError("Failed to fetch user data." ,+err);
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
      setMessage("Authentication required. Redirecting to login...");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8089/api/users/profile",
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
        setMessage(response.data);
        setInterval(() => {
          setMessage("");
        }, 3000);
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        setMessage("Error updating profile");
      }
    } catch (error) {
      alert("Error updating profile:", error);
      setError("Failed to update profile. Please try again later.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`max-w-7xl mx-auto backdrop-blur-sm bg-opacity-80 ${
        theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
      } rounded-2xl shadow-2xl p-8`}>
        
        <h1 className={`text-4xl font-extrabold text-center mb-12 ${
          theme === "dark" 
            ? "bg-gradient-to-r from-green-400 to-emerald-500" 
            : "bg-gradient-to-r from-orange-400 to-orange-600"
        } bg-clip-text text-transparent`}>
          Update Profile
        </h1>
  
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
            <div className="relative group mx-auto">
              <img 
                className={`w-32 h-32 rounded-full ring-4 ring-offset-4 transition-transform duration-300 group-hover:scale-105 ${
                  theme === "dark" ? "ring-green-500" : "ring-orange-500"
                }`}
                src={`data:image/png;base64,${formData.profilePicture}`}
                alt="Profile"
              />
              <Link to="/upload-profile-picture" 
                className={`absolute bottom-0 right-0 p-2 rounded-full ${
                  theme === "dark" ? "bg-green-500" : "bg-orange-500"
                } hover:scale-110 transition-transform duration-200`}>
                <FaPen className="text-white" />
              </Link>
            </div>
  
            {["username", "fullName"].map((field) => (
              <div key={field} className="space-y-2">
                <label className={`block text-sm font-medium ${
                  theme === "dark" ? "text-green-400" : "text-orange-500"
                }`}>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  readOnly={field === "username"}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    theme === "dark" 
                      ? "bg-gray-700/50 border-green-400 focus:border-green-500 text-white" 
                      : "bg-gray-50/50 border-orange-400 focus:border-orange-500 text-gray-900"
                  } border-2 focus:ring-2 focus:ring-offset-2 ${
                    theme === "dark" ? "focus:ring-green-500/50" : "focus:ring-orange-500/50"
                  } outline-none`}
                />
              </div>
            ))}
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {["email", "role"].map((field) => (
              <div key={field} className="space-y-2">
                <label className={`block text-sm font-medium ${
                  theme === "dark" ? "text-green-400" : "text-orange-500"
                }`}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    theme === "dark" 
                      ? "bg-gray-700/50 border-green-400 focus:border-green-500 text-white" 
                      : "bg-gray-50/50 border-orange-400 focus:border-orange-500 text-gray-900"
                  } border-2 focus:ring-2 focus:ring-offset-2 ${
                    theme === "dark" ? "focus:ring-green-500/50" : "focus:ring-orange-500/50"
                  } outline-none`}
                />
              </div>
            ))}
          </div>
  
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              theme === "dark" ? "text-green-400" : "text-orange-500"
            }`}>
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                theme === "dark" 
                  ? "bg-gray-700/50 border-green-400 focus:border-green-500 text-white" 
                  : "bg-gray-50/50 border-orange-400 focus:border-orange-500 text-gray-900"
              } border-2 focus:ring-2 focus:ring-offset-2 ${
                theme === "dark" ? "focus:ring-green-500/50" : "focus:ring-orange-500/50"
              } outline-none h-32 resize-none`}
            />
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["github", "twitter", "instagram", "linkedin"].map((social) => (
              <div key={social} className="space-y-2">
                <label className={`block text-sm font-medium ${
                  theme === "dark" ? "text-green-400" : "text-orange-500"
                }`}>
                  {social.charAt(0).toUpperCase() + social.slice(1)}
                </label>
                <input
                  type="text"
                  name={social}
                  value={formData[social]}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    theme === "dark" 
                      ? "bg-gray-700/50 border-green-400 hover:border-green-500 text-white" 
                      : "bg-gray-50/50 border-orange-400 hover:border-orange-500 text-gray-900"
                  } border-2 focus:ring-2 focus:ring-offset-2 ${
                    theme === "dark" ? "focus:ring-green-500/50" : "focus:ring-orange-500/50"
                  } outline-none`}
                />
              </div>
            ))}
          </div>
  
          {error && <p className="text-red-500 font-medium text-center">{error}</p>}
          {message && <p className="text-green-500 font-medium text-center">{message}</p>}
  
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                theme === "dark"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              }`}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default UpdateProfile;
