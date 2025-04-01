import { motion } from "framer-motion";
import { FaPenNib } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.07) 0.5px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1
              }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-500 rounded-full blur-2xl opacity-30 animate-pulse" />
              <FaPenNib className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 mx-auto relative z-10" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 sm:text-6xl"
            >
              Share Your Story With The World
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-gray-300 backdrop-blur-sm"
            >
              Join our community of writers, thinkers, and storytellers. Create, share, and discover amazing content.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                to="/register"
                className="group relative rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 p-0.5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem_#8b5cf6]"
              >
                <span className="relative inline-flex items-center justify-center rounded-full bg-slate-900/50 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-transparent">
                  Get Started
                  <svg
                    className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>
              <Link
                to="/login"
                className="group text-sm font-semibold leading-6 text-gray-200"
              >
                <span className="relative inline-flex items-center transition-colors duration-300 hover:text-violet-400">
                  Log in
                  <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;