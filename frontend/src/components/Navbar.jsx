
import { Link } from "react-router-dom";

export default function Navbar(){

    return(
        <nav className="bg-slate-800 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
            <Link to="/about" className="hover:text-gray-300 px-5">My App</Link>
                <ul className="flex space-x-6 px-10">
                <li>
                    <Link to="/about" className="hover:text-gray-300">About</Link>
                </li>
                <li>
                    <Link to="/services" className="hover:text-gray-300">Services</Link>
                </li>
                <li>
                    <Link to="/contact" className="hover:text-gray-300">Contact</Link>
                </li>
                </ul>
            </div>
        </nav>
    );
    
}