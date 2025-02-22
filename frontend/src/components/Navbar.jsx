import { Link, useNavigate } from "react-router-dom";

export default function Navbar({  setIsAuthenticated }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login"); // ✅ Redirects properly
  }

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-semibold hover:text-gray-300">
          My App
        </Link>

        <ul className="flex space-x-6">
          <li>
            <Link to="/about" className="hover:text-gray-300">
              About
            </Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-gray-300">
              Services
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-300">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/user" className="hover:text-gray-300">
              User
            </Link>
          </li>
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
    </nav>
  );
}
