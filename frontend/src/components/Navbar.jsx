import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        navigate("/register");
    }

    return (
        <nav className="bg-slate-800 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="hover:text-gray-300 px-5">My App</Link>
                <ul className="flex space-x-6 px-10">
                    <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
                    <li><Link to="/services" className="hover:text-gray-300">Services</Link></li>
                    <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
                {isAuthenticated && (
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 px-2 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>
                )}
                </ul>
            </div>
        </nav>
    );
}
