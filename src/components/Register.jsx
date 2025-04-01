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
import { motion } from "framer-motion";


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
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    return strength;
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };


  const handleChange = (input) => (e) => {
    const value = e.target.value;
    dispatch(updateFormData({ [input]: value }));
    
    if (input === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
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
        "https://api.blogsbysughosh.xyz/register",
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

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span className={theme === "dark" ? "text-purple-400" : "text-purple-600"}>Full Name</span>
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullName}
                onChange={handleChange("fullName")}
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                  ${theme === "dark"
                    ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                    : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                  border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                required
              />
            </div>

            {/* Username Input */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span className={theme === "dark" ? "text-purple-400" : "text-purple-600"}>Username</span>
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange("username")}
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                  ${theme === "dark"
                    ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                    : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                  border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span className={theme === "dark" ? "text-purple-400" : "text-purple-600"}>Password</span>
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  className={`w-full px-5 py-4 pr-10 rounded-xl text-base transition-all duration-300
                    ${theme === "dark"
                      ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                      : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                    border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
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
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      Password Strength:
                    </span>
                    <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-full ${getStrengthColor(passwordStrength)}`}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Re-enter Password Input */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span className={theme === "dark" ? "text-purple-400" : "text-purple-600"}>Re-enter Password</span>
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="password"
                name="rePassword"
                value={formData.rePassword}
                onChange={handleChange("rePassword")}
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                  ${theme === "dark"
                    ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                    : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                  border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span className={theme === "dark" ? "text-purple-400" : "text-purple-600"}>Email</span>
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange("email")}
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                  ${theme === "dark"
                    ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                    : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                  border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span className={theme === "dark" ? "text-purple-400" : "text-purple-600"}>Role</span>
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="text"
                name="role"
                placeholder="ADMIN, READER, AUTHOR"
                value={formData.role}
                onChange={handleChange("role")}
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                  ${theme === "dark"
                    ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                    : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                  border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span className={theme === "dark" ? "text-purple-400" : "text-purple-600"}>Bio</span>
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleChange("bio")}
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                  ${theme === "dark"
                    ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                    : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                  border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                <span className={theme === "dark" ? "text-purple-400" : "text-purple-600"}>GitHub</span>
              </label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange("github")}
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                  ${theme === "dark"
                    ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                    : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                  border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                <span className={theme === "dark" ? "text-purple-400" : "text-purple-600"}>LinkedIn</span>
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange("linkedin")}
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300
                  ${theme === "dark"
                    ? "bg-gray-700/50 text-white border-gray-600 focus:border-purple-500"
                    : "bg-gray-50/50 text-gray-900 border-gray-200 focus:border-purple-500"}
                  border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "User Details";
      case 2:
        return "Contact Details";
      case 3:
        return "Profile Details";
      default:
        return "";
    }
  };
  
  const getButtonActions = () => {
    if (step === 1) {
      return (
        <button
          type="button"
          onClick={handleNext}
          className={`w-full py-4 px-6 rounded-xl text-white font-medium
            transition-all duration-300 transform hover:scale-[1.02]
            bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
            focus:outline-none focus:ring-2 focus:ring-purple-500
            ${theme === "dark" ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
        >
          Next
        </button>
      );
    } else if (step === 3) {
      return (
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handlePrev}
            className={`flex-1 py-4 px-6 rounded-xl font-medium
              transition-all duration-300
              border-2 ${theme === "dark" 
                ? "border-gray-700 bg-gray-800 text-gray-300" 
                : "border-gray-300 bg-white text-gray-700"}
              hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`flex-1 py-4 px-6 rounded-xl text-white font-medium
              transition-all duration-300 transform ${!isLoading && "hover:scale-[1.02]"}
              bg-gradient-to-r ${isLoading 
                ? "bg-gray-400" 
                : "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"}
              focus:outline-none focus:ring-2 focus:ring-purple-500
              ${isLoading ? "cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handlePrev}
            className={`flex-1 py-4 px-6 rounded-xl font-medium
              transition-all duration-300
              border-2 ${theme === "dark" 
                ? "border-gray-700 bg-gray-800 text-gray-300" 
                : "border-gray-300 bg-white text-gray-700"}
              hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className={`w-full py-4 px-6 rounded-xl text-white font-medium
              transition-all duration-300 transform hover:scale-[1.02]
              bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
              focus:outline-none focus:ring-2 focus:ring-purple-500
              ${theme === "dark" ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
          >
            Next
          </button>
        </div>
      );
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
              {getStepTitle()}
            </h2>
            <p className={`text-sm 
              ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {step === 1 ? "Create your account" : `Step ${step} of 3`}
            </p>
          </motion.div>

          <form className="space-y-6">
            {/* Form fields based on current step */}
            {renderForm()}

            {/* Error Messages */}
            {passwordError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg p-4 bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-500 text-sm text-center">{passwordError}</p>
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-4 ${
                  message.includes("successful")
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                <p className={`text-sm text-center ${
                  message.includes("successful") ? "text-green-500" : "text-red-500"
                }`}>{message}</p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6">
              {getButtonActions()}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
