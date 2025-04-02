import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, toggleTheme } from "../state/Slice";
import { motion, AnimatePresence } from "framer-motion";

// Use icons from react-icons packages only
import { FaUserPlus, FaHome, FaNewspaper, FaBars, FaUser, FaSearch, FaTimes } from "react-icons/fa";
import { 
  HiOutlineHome, 
  HiOutlineDocumentText, 
  HiOutlineSearch,
  HiOutlineUser, 
  HiOutlineMenu, 
  HiOutlineX, 
  HiMoon, 
  HiSun,
  HiOutlineCog, 
  HiOutlinePencil, 
  HiOutlineQuestionMarkCircle,
  HiOutlinePlusCircle
} from "react-icons/hi";

function Header() {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const theme = useSelector((state) => state.auth.isDarkMode ? "dark" : "light");
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    localStorage.removeItem("authToken");
    navigate("/home");
  };
  
  const handleLogin = () => {
    navigate("/login");
  };

  const handleToggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  const navItems = useMemo(
    () => [
      { 
        index: 1, 
        title: "Home", 
        icon: <HiOutlineHome className="w-5 h-5" />, 
        link: "/home" 
      },
      {
        index: 2,
        title: "Register",
        icon: <FaUserPlus className="w-5 h-5" />,
        link: "/register",
        onClick: () => {
          if (location.pathname === "/register") {
            window.location.reload();
          }
        },
      },
      {
        index: 3,
        title: theme === "dark" ? "Light Mode" : "Dark Mode",
        icon: theme === "dark" 
          ? <HiSun className="w-5 h-5" /> 
          : <HiMoon className="w-5 h-5" />,
        action: () => dispatch(toggleTheme()),
      },
    ],
    [theme, dispatch, location.pathname]
  );

  const navItemsLoggedIn = useMemo(
    () => [
      {
        index: 1,
        title: "Feed",
        icon: <HiOutlineDocumentText className="w-5 h-5" />,
        link: "/feed",
        onClick: () => {
          if (location.pathname === "/feed") {
            window.location.reload();
          }
        },
      },
      {
        index: 2,
        title: "Post",
        icon: <HiOutlinePlusCircle className="w-5 h-5" />,
        link: "/create-post",
        onClick: () => {
          if (location.pathname === "/create-post") {
            window.location.reload();
          }
        },
      },
      {
        index: 3,
        title: "Search",
        icon: <HiOutlineSearch className="w-5 h-5" />,
        link: "/search",
        onClick: () => {
          if (location.pathname === "/search") {
            window.location.reload();
          }
        },
      },
      {
        index: 4,
        title: "Profile",
        icon: <HiOutlineUser className="w-5 h-5" />,
        link: "/profile",
        onClick: () => {
          if (location.pathname === "/profile") {
            window.location.reload();
          }
        },
      },
      
      {
        index: 5,
        title: theme === "dark" ? "Light Mode" : "Dark Mode",
        icon: theme === "dark" 
          ? <HiSun className="w-5 h-5" /> 
          : <HiMoon className="w-5 h-5" />,
        action: () => dispatch(toggleTheme()),
      },
    ],
    [theme, dispatch, location.pathname]
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? `${theme === "dark" ? "bg-slate-900/90" : "bg-white/90"} backdrop-blur-lg shadow-lg` 
            : `${theme === "dark" ? "bg-slate-900/70" : "bg-white/70"} backdrop-blur-md`
        } border-b ${theme === "dark" ? "border-purple-900/30" : "border-purple-200/30"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <div 
                className="flex items-center cursor-default"
              >
                <div className={`mr-2 p-1.5 rounded-lg bg-gradient-to-br ${
                  theme === "dark" 
                    ? "from-purple-500 to-pink-500" 
                    : "from-purple-600 to-pink-600"
                }`}>
                  <svg 
                    className="w-5 h-5 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                    />
                  </svg>
                </div>
                <span className={`text-xl font-bold bg-gradient-to-r ${
                  theme === "dark" 
                    ? "from-purple-400 to-pink-400" 
                    : "from-purple-600 to-pink-600"
                } bg-clip-text text-transparent`}>
                  StorySpace
                </span>
              </div>
            </div>

            {/* Menu Button (Mobile) */}
            <div className="flex items-center md:hidden">
              <button
                onClick={handleToggleDashboard}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  theme === "dark" 
                    ? "text-gray-300 hover:bg-gray-800/50" 
                    : "text-gray-600 hover:bg-gray-100/70"
                }`}
                aria-label="Menu"
              >
                <HiOutlineMenu className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
              {(loggedIn ? navItemsLoggedIn : navItems).map((item) => (
                <div key={item.index} className="relative group">
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        theme === "dark" 
                          ? "text-gray-300 hover:text-white hover:bg-gray-800/70" 
                          : "text-gray-700 hover:text-purple-600 hover:bg-gray-100/70"
                      } hover:scale-105`}
                      aria-label={item.title}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span className="hidden lg:inline">{item.title}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.link}
                      onClick={item.onClick}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive(item.link)
                          ? theme === "dark"
                            ? "text-purple-400 bg-gray-800/70"
                            : "text-purple-600 bg-gray-100/70"
                          : theme === "dark"
                          ? "text-gray-300 hover:text-white hover:bg-gray-800/70"
                          : "text-gray-700 hover:text-purple-600 hover:bg-gray-100/70"
                      } hover:scale-105`}
                      aria-current={isActive(item.link) ? "page" : undefined}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span className="hidden lg:inline">{item.title}</span>
                    </Link>
                  )}
                  {item.link && isActive(item.link) && (
                    <span 
                      className={`absolute bottom-0 left-0 h-0.5 w-full transform ${
                        theme === "dark" ? "bg-purple-400" : "bg-purple-600"
                      }`}
                    />
                  )}
                </div>
              ))}
              
              {/* Login/Logout Button */}
              <button
                onClick={loggedIn ? handleLogout : handleLogin}
                className={`ml-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
                bg-gradient-to-r ${
                  theme === "dark"
                    ? "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                } text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20`}
              >
                {loggedIn ? "Logout" : "Login"}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isDashboardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black/30 z-50 md:hidden"
            onClick={handleToggleDashboard}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ 
                type: "tween",
                duration: 0.2
              }}
              className={`fixed top-0 left-0 bottom-0 w-72 ${
                theme === "dark" 
                  ? "bg-slate-900" 
                  : "bg-white"
              } shadow-lg overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center cursor-default">
                    <div className={`mr-2 p-1.5 rounded-lg bg-gradient-to-br ${
                      theme === "dark" 
                        ? "from-purple-500 to-pink-500" 
                        : "from-purple-600 to-pink-600"
                    }`}>
                      <svg 
                        className="w-5 h-5 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                        />
                      </svg>
                    </div>
                    <span className={`text-xl font-bold bg-gradient-to-r ${
                      theme === "dark" 
                        ? "from-purple-400 to-pink-400" 
                        : "from-purple-600 to-pink-600"
                    } bg-clip-text text-transparent`}>
                      StorySpace
                    </span>
                  </div>
                  <button
                    onClick={handleToggleDashboard}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      theme === "dark" 
                        ? "text-gray-300 hover:bg-gray-800/70" 
                        : "text-gray-600 hover:bg-gray-100/70"
                    }`}
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Nav Items */}
                <nav className="space-y-2 mb-8">
                  {(loggedIn ? navItemsLoggedIn : navItems).map((item) => (
                    <div key={item.index}>
                      {item.action ? (
                        <button
                          onClick={() => { 
                            item.action();
                            handleToggleDashboard();
                          }}
                          className={`flex items-center w-full px-4 py-3 rounded-xl text-left text-base font-medium ${
                            theme === "dark"
                              ? "text-gray-200 hover:bg-gray-800/70"
                              : "text-gray-700 hover:bg-gray-100/70"
                          } transition-colors duration-200`}
                        >
                          <span className="mr-3 text-purple-500">{item.icon}</span>
                          {item.title}
                        </button>
                      ) : (
                        <Link
                          to={item.link}
                          onClick={() => {
                            if (item.onClick) item.onClick();
                            handleToggleDashboard();
                          }}
                          className={`flex items-center w-full px-4 py-3 rounded-xl text-base font-medium ${
                            isActive(item.link)
                              ? theme === "dark"
                                ? "bg-gray-800/70 text-purple-400"
                                : "bg-gray-100/70 text-purple-600"
                              : theme === "dark"
                              ? "text-gray-200 hover:bg-gray-800/70"
                              : "text-gray-700 hover:bg-gray-100/70"
                          } transition-colors duration-200`}
                        >
                          <span className={`mr-3 ${isActive(item.link) ? "text-purple-500" : ""}`}>{item.icon}</span>
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Login/Logout Button */}
                <div className="pt-8 mt-8">
                  <button
                    onClick={() => {
                      if (loggedIn) handleLogout();
                      else handleLogin();
                      handleToggleDashboard();
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-center text-base font-medium
                      transition-colors duration-200 bg-gradient-to-r 
                      ${theme === "dark"
                        ? "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        : "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      } text-white`}
                  >
                    {loggedIn ? "Logout" : "Login"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-md p-6 rounded-2xl shadow-xl ${
                theme === "dark" 
                  ? "bg-slate-800 border border-slate-700" 
                  : "bg-white border border-gray-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  theme === "dark" ? "bg-red-500/10" : "bg-red-100"
                }`}>
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Confirm Logout
                </h3>
                <p className={`mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>
                  Are you sure you want to log out? You'll need to log in again to access your account.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-6 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
