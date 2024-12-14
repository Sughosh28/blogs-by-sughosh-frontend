import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
);
const token=localStorage.getItem("authToken");
const navigate=useNavigate();

  const handleSearch = async (e) => {
      e.preventDefault();
      setIsLoading(true);
    if(!token){
        navigate("/login");
    }
    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:8089/api/users/search?username=${searchTerm}`,
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
    <div className={`min-h-screen py-8 px-4 md:px-8 pt-24 ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto  mb-8">
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users... Enter the username"
                className={`w-full  pl-4 pr-10 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-green-500/50"
                    : "bg-gray-300 border-gray-700 focus:ring-orange-500/50 shadow-lg"
                }`}
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
            <button
              type="submit"
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                theme === "dark"
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30"
              }`}
            >
              Search
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className={`animate-spin rounded-full h-10 w-10 border-t-2 ${
              theme === "dark" ? "border-green-500" : "border-orange-500"
            }`}></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className={`rounded-xl transition-transform duration-300 hover:scale-105 ${
                theme === "dark" 
                  ? "bg-gray-800 shadow-lg shadow-gray-900/50" 
                  : "bg-white shadow-lg shadow-gray-200/50"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  {user.profilePicture ? (
                    <img
                      src={`data:image/png;base64,${user.profilePicture}`}
                      alt={user.username}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2 ring-opacity-50 ring-offset-gray-800"
                    />
                  ) : (
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}>
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{user.fullName}</h3>
                    <p className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>@{user.username}</p>
                  </div>
                </div>
                <Link
                  to={`/profile/${user.id}`}
                  className={`mt-4 block text-center py-3 rounded-lg font-medium transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {searchResults.length === 0 && searchTerm && !isLoading && (
          <div className={`text-center mt-8 p-6 rounded-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}>
            <p className="text-lg font-medium">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
