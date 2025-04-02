import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../state/Slice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.auth.isDarkMode ? "dark" : "light");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("https://api.blogsbysughosh.xyz/login", {
        username,
        password,
      });
       
      if (response.status === 200) {
        dispatch(login({ token: response.data.token }));
        const token = response.data.token;
        if (token) {
          localStorage.setItem("authToken", token);
        }
        setError("");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/feed");
        }, 3000);
      } else {
        setError(response.message || "Login Failed");
        setTimeout(() => {
          setError("")
        }, 3000)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.message || "Login failed");
        setTimeout(() => {
          setError("")
        }, 3000)
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 md:p-8
      ${theme === "dark" 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"}`}>
      
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rotate-12 opacity-30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full -rotate-12 opacity-30 bg-gradient-to-br from-blue-500/10 to-green-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full max-w-md mx-auto overflow-hidden rounded-2xl shadow-2xl 
          ${theme === "dark" 
            ? "bg-gray-800/80 backdrop-blur-xl" 
            : "bg-white/90 backdrop-blur-xl"}`}
      >
        <div className="px-8 pt-8 pb-6">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className={`text-3xl font-bold mb-2 
              ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Welcome back
            </h2>
            <p className={`text-sm 
              ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Sign in to your account
            </p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                    ${theme === "dark"
                      ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                      : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                    border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                    ${theme === "dark"
                      ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                      : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                    border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg p-4 bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-500 text-sm text-center">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl text-white font-medium
                transition-all duration-300 transform ${!isLoading && "hover:scale-[1.02]"}
                bg-gradient-to-r ${isLoading 
                  ? theme === "dark" ? "bg-gray-700" : "bg-gray-400" 
                  : "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"}
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                ${theme === "dark" ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className={`animate-spin h-5 w-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <Link
                to="/forgot-password"
                className={`text-sm font-medium transition-colors duration-300
                  ${theme === "dark"
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-600 hover:text-purple-700"}`}
              >
                Forgot Password?
              </Link>
              <Link
                to="/register"
                className={`text-sm font-medium transition-colors duration-300
                  ${theme === "dark"
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-600 hover:text-purple-700"}`}
              >
                Create an Account
              </Link>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Success Modal */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-2xl p-6`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className={`text-lg font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Login successful!
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default Login;
