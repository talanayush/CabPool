import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaInfoCircle, FaTools, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";

export default function Navbar({ setIsAuthenticated }) {
  const [isPWA, setIsPWA] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Detect if the app is running as a PWA
    setIsPWA(window.matchMedia("(display-mode: standalone)").matches);

    // Detect screen width changes for mobile mode
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/login";
  }

  return (
    <nav
      className={`bg-slate-800 text-white p-4 shadow-lg z-50 ${
        isMobile ? "fixed bottom-0 w-full bg-slate-800/90" : "fixed top-0 w-full"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo (Only visible on desktop) */}
        {!isMobile && (
          <Link to="/" className="text-lg font-semibold hover:text-gray-300">
            {isPWA ? "📌" : "My App"}
          </Link>
        )}

        {/* Navbar Links */}
        <ul className={`flex ${isMobile ? "justify-around w-full text-3xl p-3" : "space-x-6 text-lg"}`}>
          <li>
            <Link to="/about" className="hover:text-gray-300 flex items-center space-x-2">
              {isMobile ? <FaInfoCircle /> : <> <FaInfoCircle /> <span>About</span> </>}
            </Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-gray-300 flex items-center space-x-2">
              {isMobile ? <FaTools /> : <> <FaTools /> <span>Services</span> </>}
            </Link>
          </li>
          {/* Home Button: Only visible on mobile */}
          {isMobile && (
            <li>
              <Link to="/" className="hover:text-gray-300 flex items-center space-x-2">
                <FaHome />
              </Link>
            </li>
          )}
          <li>
            <Link to="/user" className="hover:text-gray-300 flex items-center space-x-2">
              {isMobile ? <FaUser /> : <> <FaUser /> <span>User</span> </>}
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center space-x-2">
              {isMobile ? <FaSignOutAlt /> : <> <FaSignOutAlt /> <span>Logout</span> </>}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// ✅ PropTypes validation
Navbar.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};
