import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../state/Slice";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8`}
    >
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } max-w-md w-full space-y-8 p-8 rounded-xl shadow-2xl transition-all duration-300`}
      >
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center">
            <h2
              className={`text-3xl font-extrabold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              } mb-2`}
            >
              Welcome back
            </h2>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Sign in to your account
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-50 text-gray-900"
                } border ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                } focus:ring-2 focus:ring-offset-2 ${
                  theme === "dark"
                    ? "focus:ring-orange-500"
                    : "focus:ring-green-500"
                } transition-all duration-300`}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-50 text-gray-900"
                } border ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                } focus:ring-2 focus:ring-offset-2 ${
                  theme === "dark"
                    ? "focus:ring-orange-500"
                    : "focus:ring-green-500"
                } transition-all duration-300`}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-100 rounded-lg py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
              theme === "dark"
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-green-500 hover:bg-green-600"
            } transition-colors duration-300 transform hover:scale-[1.02]`}
          >
            Sign in
          </button>

          <div className="flex items-center justify-between mt-6 space-x-4">
            <Link
              to="/forgot-password"
              className={`text-sm ${
                theme === "dark"
                  ? "text-orange-400 hover:text-orange-300"
                  : "text-green-600 hover:text-green-500"
              } transition-colors duration-300`}
            >
              Forgot Password?
            </Link>
            <Link
              to="/register"
              className={`text-sm ${
                theme === "dark"
                  ? "text-orange-400 hover:text-orange-300"
                  : "text-green-600 hover:text-green-500"
              } transition-colors duration-300`}
            >
              Create an Account
            </Link>
            {showSuccess && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-50 bg-opacity-50">
                <div
                  className={`${
                    theme === "dark" ? "bg-orange-500" : "bg-green-500"
                  } text-white px-8 py-4 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out`}
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-6 h-6"
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
                    <span className="text-lg font-medium">
                      Login successful!
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
