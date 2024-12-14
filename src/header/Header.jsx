import { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, toggleTheme } from "../state/Slice";
import { FaUserPlus } from "react-icons/fa";
import { FaHome, FaNewspaper } from "react-icons/fa";
import { FaBars, FaUser, FaSearch } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

function Header() {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const theme = useSelector((state) =>
    state.auth.isDarkMode ? "dark" : "light"
  );
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      dispatch(logout());
      localStorage.removeItem("authToken");
      console.log("Logging out...");
      navigate("/home");
    }
  };
  const handleLogin = () => {
    navigate("/login");
  };

  const handleToggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
    console.log("Open and close");
  };

  const navItems = useMemo(
    () => [
      { index: 1, title: <FaHome className="w-6 h-6" />, link: "/home" },
      {
        index: 2,
        title: <FaUserPlus className="w-6 h-6" />,
        link: "/register",
        onClick: () => {
          if (location.pathname === "/register") {
            window.location.reload();
          }
        },
      },
      {
        index: 3,
        title:
          theme === "light" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="w-5 h-6 "
            >
              <path
                fill={theme === "dark" ? "#ec7018" : "#79da39"}
                d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-6"
            >
              <path
                fill={theme === "dark" ? "#ec7018" : "#79da39"}
                d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"
              />
            </svg>
          ),
        action: () => dispatch(toggleTheme()),
      },
    ],
    [theme, dispatch]
  );

  const navItemsLoggedIn = useMemo(
    () => [
      {
        index: 1,
        title: <FaNewspaper className="w-5 h-6" />,
        link: "/feed",
        onClick: () => {
          if (location.pathname === "/feed") {
            window.location.reload();
          }
        },
      },
      {
        index: 2,
        title: <FaSearch className="w-5 h-6" />,
        link: "/search",
        onClick: () => {
          if (location.pathname === "/search") {
            window.location.reload();
          }
        },
      },
      {
        index: 3,
        title: <FaUser className="w-5 h-6" />,
        link: "/profile",
        onClick: () => {
          if (location.pathname === "/profile") {
            window.location.reload();
          }
        },
      },

      {
        index: 4,
        title:
          theme === "light" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="w-5 h-6"
            >
              <path
                fill= "#4ade80"
                d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className={`w-5 h-6`}
            >
              <path
                fill= "#f8f9f5" 
                d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"
              />
            </svg>
          ),
        action: () => dispatch(toggleTheme()),
      },
    ],
    [theme, dispatch, location]
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 w-full ${
          theme === "light" ? "bg-white/80" : "bg-gray-900/80"
        } backdrop-blur-md border-b border-green-400/20 text-white z-50 shadow-lg`}
      >
        <nav className="container mx-auto flex justify-between items-center px-6 py-4 max-w-7xl">
          <div
            className={`rounded-full p-2 transition-all duration-300 ${
              theme === "dark" 
                ? "text-white hover:bg-gray-700" 
                : "text-orange-500 hover:bg-orange-50"
            } cursor-pointer`}
            onClick={handleToggleDashboard}
          >
            {!isDashboardOpen ? (
              <FaBars className="w-6 h-6" />
            ) : (
              <FaTimes className="w-6 h-6" />
            )}
          </div>
  
          <ul className="flex items-center gap-8">
            {(loggedIn ? navItemsLoggedIn : navItems).map((item) => (
              <li
                key={item.index}
                className={`relative cursor-pointer px-3 py-2 text-lg font-medium
                  ${theme === "light" ? "text-green-500" : "text-white"}
                  transition-all duration-300 group`}
              >
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="focus:outline-none hover:opacity-80 transition-opacity"
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link
                    to={item.link}
                    onClick={item.onClick}
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    {item.title}
                  </Link>
                )}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-0.5 
                    ${theme === "light" ? "bg-orange-500" : "bg-green-400"}
                    transform scale-x-0 transition-transform duration-300 
                    group-hover:scale-x-100
                    ${item.link && isActive(item.link) ? "scale-x-100" : ""}`} 
                />
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {isDashboardOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          onClick={handleToggleDashboard}
        >
          <div
            className={`${
              theme === "dark"
                ? "bg-slate-800 text-white"
                : "bg-white text-gray-800"
            } w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-4">
              {loggedIn &&
                [
                  ["Create Post", "/add-post"],
                  ["Settings", "/settings"],
                  ["Profile Update", "/edit-profile"],
                ].map(([title, path]) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={handleToggleDashboard}
                      className={`block w-full p-3 rounded-lg text-center font-medium transition-all duration-200 
                ${
                  theme === "dark"
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                } hover:shadow-md`}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  to="/help"
                  onClick={handleToggleDashboard}
                  className={`block w-full p-3 rounded-lg text-center font-medium transition-all duration-200
              ${
                theme === "dark"
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              } hover:shadow-md`}
                >
                  Help
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (loggedIn) handleLogout();
                    else handleLogin();
                    handleToggleDashboard();
                  }}
                  className={`w-full p-3 rounded-lg text-center font-medium transition-all duration-200
              ${
                theme === "dark"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              } hover:shadow-md`}
                >
                  {loggedIn ? "Logout" : "Login"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
