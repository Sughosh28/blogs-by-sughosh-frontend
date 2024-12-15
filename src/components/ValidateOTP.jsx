import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ValidateOTP() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0); 
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const calculateRemainingTime = () => {
    const expirationTime = parseInt(localStorage.getItem("otpExpirationTime"), 10);
    const now = Date.now();
    return Math.max(Math.floor((expirationTime - now) / 1000), 0);
  };

  useEffect(() => {
    const expirationTime = parseInt(localStorage.getItem("otpExpirationTime"), 10);
    const now = Date.now();

    if (!expirationTime || expirationTime < now) {
      localStorage.setItem("otpExpirationTime", Date.now() + 5 * 60 * 1000); 
    }

    const interval = setInterval(() => {
      const remainingTime = calculateRemainingTime();
      setTimer(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
        localStorage.removeItem("otpExpirationTime"); 
        navigate("/forgot-password");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://blogsbysughosh.xyz:8089/api/users/reset-password",
        { otp, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Password Reset Successful");
        navigate("/login");
        localStorage.removeItem("otpExpirationTime"); 
      } else {
        alert("Invalid OTP");
        setMessage(response.message || "Invalid OTP");
      }
    } catch (e) {
      setMessage(e.message || "Invalid OTP");
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 max-w-sm">
        <span className="p-2 text-center text-blue-700">
          OTP has been sent to the mail you entered.
        </span>
        <h2 className="text-2xl p-2 font-bold text-center mb-6 text-gray-800">
          Validate OTP
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full text-center p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {message && (
            <p className="text-red-600 p-2 text-sm mt-2 text-center">{message}</p>
          )}
          <p className="text-sm text-red-500 text-center mb-2">
            Time left to submit OTP: {formatTime(timer)}
          </p>
          <button
            type="submit"
            className={`w-full p-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
              timer <= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={timer <= 0}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ValidateOTP;
