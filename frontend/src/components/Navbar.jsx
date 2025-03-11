import { Link } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";

export default function Navbar({ setIsAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false); // ✅ Track dropdown state

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/login"; // ✅ Force reload to login page
  }

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold hover:text-gray-300">
          My App
        </Link>

        {/* Dropdown Button for Mobile (Right Side) */}
        <div className="md:hidden">
          <button 
            className="focus:outline-none text-white text-2xl" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"} {/* Toggle between 'X' and '☰' */}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex space-x-6">
          <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
          <li><Link to="/services" className="hover:text-gray-300">Services</Link></li>
          <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
          <li><Link to="/user" className="hover:text-gray-300">User</Link></li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 rounded-lg px-4 py-2 hover:bg-red-700 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <ul className="md:hidden absolute right-4 top-16 w-48 bg-slate-900 text-white shadow-lg rounded-lg p-4 space-y-4">
          <li><Link to="/about" className="block hover:text-gray-300" onClick={() => setIsOpen(false)}>About</Link></li>
          <li><Link to="/services" className="block hover:text-gray-300" onClick={() => setIsOpen(false)}>Services</Link></li>
          <li><Link to="/contact" className="block hover:text-gray-300" onClick={() => setIsOpen(false)}>Contact</Link></li>
          <li><Link to="/user" className="block hover:text-gray-300" onClick={() => setIsOpen(false)}>User</Link></li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 rounded-lg px-4 py-2 hover:bg-red-700 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}

// ✅ Add PropTypes validation
Navbar.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};
