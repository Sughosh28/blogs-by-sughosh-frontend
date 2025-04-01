import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(!token){
      navigate("/login");
    }
    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(
        `https://api.blogsbysughosh.xyz/api/users/search?username=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      alert("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"} transition-all duration-300`}>
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-slate-900"
          } transition-colors duration-300`}>
            Search Users
          </h1>
          <p className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Find and connect with other users
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSearch} 
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users... "
                className={`w-full pl-4 pr-10 py-4 rounded-xl outline-none transition-all duration-300 focus:ring-2 ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700/50 text-white focus:ring-purple-500/50"
                    : "bg-white border-gray-200 text-gray-900 focus:ring-purple-500/50"
                } border-2 shadow-lg backdrop-blur-sm`}
              />
              <svg 
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                theme === "dark"
                  ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30"
              }`}
            >
              Search
            </motion.button>
          </div>
        </motion.form>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-violet-200 border-opacity-20"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : searchResults.length === 0 && searchTerm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center justify-center py-12 px-4 rounded-2xl ${
              theme === "dark" 
                ? "bg-slate-800/50 border border-slate-700/50" 
                : "bg-white border border-gray-100"
            } backdrop-blur-sm`}
          >
            <div className={`w-16 h-16 rounded-full ${
              theme === "dark" ? "bg-slate-700" : "bg-gray-100"
            } flex items-center justify-center mb-4`}>
              <svg 
                className={`w-8 h-8 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              No Users Found
            </h3>
            <p className={`text-sm text-center max-w-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              Try searching with a different username or check your spelling.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {searchResults.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`rounded-2xl transition-all duration-300 ${
                    theme === "dark" 
                      ? "bg-slate-800/50 hover:bg-slate-700/50" 
                      : "bg-white hover:bg-gray-50/80"
                  } shadow-lg overflow-hidden backdrop-blur-sm border ${
                    theme === "dark" ? "border-slate-700/50" : "border-gray-100"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      {user.profilePicture ? (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={`data:image/png;base64,${user.profilePicture}`}
                            alt={user.username}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2 ring-purple-500/50"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold ${
                            theme === "dark" ? "bg-slate-700" : "bg-gray-100"
                          }`}
                        >
                          {user.username[0].toUpperCase()}
                        </motion.div>
                      )}
                      <div>
                        <h3 className={`text-lg font-bold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{user.fullName}</h3>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>@{user.username}</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={`/profile/${user.id}`}
                        className={`block text-center py-3 rounded-xl font-medium transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        } shadow-lg shadow-purple-500/20`}
                      >
                        View Profile
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
