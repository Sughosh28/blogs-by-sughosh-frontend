import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaKey, FaArrowLeft, FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";

function ValidateOTP() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const theme = useSelector((state) => state.auth.isDarkMode ? "dark" : "light");

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put(
        "https://api.blogsbysughosh.xyz/api/users/reset-password",
        { otp, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setMessage("Password Reset Successful");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(response.message || "Invalid OTP");
      }
    } catch (e) {
      setMessage(e.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"} transition-all duration-300 flex items-center justify-center`}>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
          <div className="relative h-[15vh] sm:h-[20vh] min-h-[150px] sm:min-h-[200px] w-full overflow-hidden">
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
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-4"
                >
                  <FaKey className={`text-4xl sm:text-5xl mx-auto ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`} />
                </motion.div>
                <h1 className={`text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${
                  theme === "dark" 
                    ? "from-white to-gray-300" 
                    : "from-gray-900 to-gray-600"
                }`}>Validate OTP</h1>
                <p className={`text-lg sm:text-xl ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>Enter the OTP sent to your email</p>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="max-w-xl mx-auto">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-4"
              >
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className={`text-xl sm:text-2xl transition-colors duration-300 ${
                      theme === "dark" ? "text-purple-400 group-hover:text-purple-300" : "text-purple-600 group-hover:text-purple-500"
                    }`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base ${
                      theme === "dark"
                        ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 group-hover:border-purple-500/50"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 group-hover:border-purple-500/50"
                    }`}
                  />
                </motion.div>

                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className={`text-xl sm:text-2xl transition-colors duration-300 ${
                      theme === "dark" ? "text-purple-400 group-hover:text-purple-300" : "text-purple-600 group-hover:text-purple-500"
                    }`} />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base ${
                      theme === "dark"
                        ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 group-hover:border-purple-500/50"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 group-hover:border-purple-500/50"
                    }`}
                  />
                </motion.div>

                {newPassword && (
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

                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm ${
                        theme === "dark"
                          ? "bg-red-500/10 border border-red-500/20 text-red-400"
                          : "bg-red-50 border border-red-200 text-red-600"
                      }`}
                    >
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <motion.button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                      theme === "dark"
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <FaArrowLeft />
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isLoading || passwordStrength < 2}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                      theme === "dark"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    } shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <FaKey />
                        Reset Password
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ValidateOTP;
