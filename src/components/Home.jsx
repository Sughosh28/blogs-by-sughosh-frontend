import { motion } from "framer-motion";
import { FaPenNib } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white flex items-center justify-center">
      <div className="flex items-center justify-center w-screen h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-10 md:w-3/4 lg:w-1/2"
        >
          <motion.div
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-8"
          >
            <FaPenNib className="text-7xl mb-6 text-violet-600 mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
              Explore the World of Ideas
            </h1>
            <p className="text-gray-600 mt-4 text-base md:text-xl leading-relaxed">
              Discover stories, insights, and the latest trends from thought leaders around the globe.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mt-8"
          >
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-violet-600 text-white font-semibold rounded-xl shadow-lg hover:bg-violet-700 transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Link>
            <p className="text-gray-700 mt-6 text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-violet-600 hover:text-violet-700 font-medium hover:underline transition-colors duration-200"
              >
                Log in
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-10 flex justify-center items-center"
          >
            <div className="w-56 h-56 md:w-72 md:h-72 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <p className="text-xl font-semibold text-white text-center px-4 leading-relaxed">
                Your Next Story Awaits
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;