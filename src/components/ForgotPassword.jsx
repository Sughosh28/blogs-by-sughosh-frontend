import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { useRef } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loadingBarRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    try {
      const response = await axios.post(
        `http://localhost:8089/send-otp?email=${email}`
      );

      if (response.status === 200) {
        const token=response.data.token;
        localStorage.setItem("authToken", token);
        
          setMessage(response.data.message)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        setTimeout(() => {
          setMessage("");
        }, 3000);
        navigate("/validate");
      }
    } catch (error) {
      if (error.response) {
        setMessage(
          error.response.data || "An error occurred. Please try again."
        );
        if (loadingBarRef.current) {
            loadingBarRef.current.complete(); 
          }
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } 
      else {
        setMessage("Network error. Please try again.");
        if (loadingBarRef.current) {
            loadingBarRef.current.complete(); 
          }
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <LoadingBar color="#f11946" ref={loadingBarRef} />

      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 max-w-sm"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Forgot Password
          </h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {message && (
            <p className="text-red-600 text-sm p-2 mt-2 text-center">
              <strong>{message}</strong>
            </p>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
