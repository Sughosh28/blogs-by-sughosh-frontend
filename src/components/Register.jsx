import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  nextStep,
  prevStep,
  registerRequest,
  registerFailure,
  registerSuccess,
  resetFormData,
} from "../state/Slice";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; 


const Register = () => {
  const dispatch = useDispatch();
  const { step, formData, status, error } = useSelector(
    (state) => state.auth.registration
  );
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };


  const handleChange = (input) => (e) => {
    dispatch(updateFormData({ [input]: e.target.value }));
  };

  const handleNext = () => {
    if (formData.password !== formData.rePassword) {
      setPasswordError("Passwords do not match");
      setTimeout(() => {
        setPasswordError("");
      }, 3500);
    } else {
      setPasswordError("");
      dispatch(nextStep());
    }  };

  const handlePrev = () => {
    dispatch(prevStep());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(registerRequest());
    try {
      const response = await axios.post(
        "http://localhost:8089/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        dispatch(registerSuccess());
        setMessage("Registration successful!");
        dispatch(resetFormData());
        setTimeout(() => setMessage(""), 2500);
        navigate("/login");
      } else {
        dispatch(registerFailure());
        setMessage(response.data);
      }
    } catch (e) {
      dispatch(registerFailure({ error: e.message }));
      setMessage("Something went wrong. " + e.message);
      setInterval(() => {
        setMessage("");
      }, 3500);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "failure") {
      setMessage(error);
      setInterval(() => {
        setMessage("");
      }, 3500);
    }
  }, [status, error]);

  switch (step) {
    case 1:
      return (
        <div className={`min-h-screen flex items-center mt-10 justify-center ${
          theme === "dark" 
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" 
            : "bg-gradient-to-b from-white via-gray-50 to-white"
        }`}>
          <div className={`max-w-lg w-11/12 md:w-2/3 p-8 ${
            theme === "dark" 
              ? "bg-gray-800/80 border border-gray-700" 
              : "bg-white/90 border border-gray-100"
          } backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300`}>
            <h2 className={`text-3xl font-bold mb-8 ${
              theme === "dark" 
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text" 
                : "text-gray-800"
            } text-center`}>User Details</h2>

            <div className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span className={theme === "dark" ? "text-green-400" : "text-blue-600"}>Full Name</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                  className={`w-full p-3.5 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700/50 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                  required
                />
              </div>

              {/* Username Input */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span className={theme === "dark" ? "text-green-400" : "text-blue-600"}>Username</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange("username")}
                  className={`w-full p-3.5 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700/50 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span className={theme === "dark" ? "text-green-400" : "text-blue-600"}>Password</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    className={`w-full p-3.5 pr-10 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700/50 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } hover:text-gray-700 transition-colors`}
                  >
                    {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Re-enter Password Input */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span className={theme === "dark" ? "text-green-400" : "text-blue-600"}>Re-enter Password</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="password"
                  name="rePassword"
                  value={formData.rePassword}
                  onChange={handleChange("rePassword")}
                  className={`w-full p-3.5 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700/50 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                  required
                />
              </div>
            </div>

            {/* Error Messages */}
            {passwordError && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm text-center">
                {passwordError}
              </div>
            )}

            {message && (
              <div className={`mt-4 p-3 rounded-lg ${
                message.includes("successful")
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              } text-sm text-center`}>
                {message}
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className={`w-full mt-6 py-3.5 px-6 rounded-lg font-medium ${
                theme === "dark"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              } text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
            >
              Next
            </button>
          </div>
        </div>
      );

    case 2:
      return (
        <div className={`min-h-screen flex items-center pt-10 justify-center ${
          theme === "dark" 
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" 
            : "bg-gradient-to-b from-white via-gray-50 to-white"
        }`}>
          <div className={`max-w-lg w-11/12 md:w-2/3 p-8 ${
            theme === "dark" 
              ? "bg-gray-800/80 border border-gray-700" 
              : "bg-white/90 border border-gray-100"
          } backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300`}>
            <h2 className={`text-3xl font-bold mb-8 ${
              theme === "dark" 
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text" 
                : "text-gray-800"
            } text-center`}>Contact Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span className={theme === "dark" ? "text-green-400" : "text-blue-600"}>Email</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className={`w-full p-3.5 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700/50 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span className={theme === "dark" ? "text-green-400" : "text-blue-600"}>Role</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="role"
                  placeholder="ADMIN, READER, AUTHOR"
                  value={formData.role}
                  onChange={handleChange("role")}
                  className={`w-full p-3.5 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700/50 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                  required
                />
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-lg ${
                message.includes("successful")
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              } text-sm text-center`}>
                {message}
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePrev}
                className="flex-1 py-3.5 px-6 rounded-lg font-medium bg-gray-500 text-white transition-all duration-300 hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className={`flex-1 py-3.5 px-6 rounded-lg font-medium ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500"
                    : "bg-gradient-to-r from-green-500 to-emerald-500"
                } text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      );

      case 3:
        return (
          <div className={`min-h-screen flex items-center justify-center ${
            theme === "dark" 
              ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" 
              : "bg-gradient-to-b from-white via-gray-50 to-white"
          }`}>
            <div className={`max-w-lg w-11/12 md:w-2/3 p-8 ${
              theme === "dark" 
                ? "bg-gray-800/80 border border-gray-700" 
                : "bg-white/90 border border-gray-100"
            } backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300`}>
              <h2 className={`text-3xl font-bold mb-8 ${
                theme === "dark" 
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text" 
                  : "text-gray-800"
              } text-center`}>Profile Details</h2>
      
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    <div className="flex items-center justify-between">
                      <span className={theme === "dark" ? "text-green-400" : "text-blue-600"}>Bio</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange("bio")}
                    className={`w-full p-3.5 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700/50 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                  />
                </div>
      
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    <span className={theme === "dark" ? "text-green-400" : "text-blue-600"}>GitHub</span>
                  </label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange("github")}
                    className={`w-full p-3.5 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700/50 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                  />
                </div>
      
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    <span className={theme === "dark" ? "text-green-400" : "text-blue-600"}>LinkedIn</span>
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange("linkedin")}
                    className={`w-full p-3.5 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700/50 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                  />
                </div>
              </div>
      
              {message && (
                <div className={`mt-4 p-3 rounded-lg ${
                  message.includes("successful")
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                } text-sm text-center`}>
                  {message}
                </div>
              )}
      
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handlePrev}
                  className="flex-1 py-3.5 px-6 rounded-lg font-medium bg-gray-500 text-white transition-all duration-300 hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className={`flex-1 py-3.5 px-6 rounded-lg font-medium ${
                    isLoading 
                      ? "bg-gray-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-[1.02]"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-[1.02]"
                  } text-white transform transition-all duration-300 hover:shadow-lg active:scale-[0.98]`}
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        );
    default:
      return null;
  }
};

export default Register;
