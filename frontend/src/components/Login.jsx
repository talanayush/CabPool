import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({setIsAuthenticated}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        name === "email" ? setEmail(value) : setPassword(value);
    };

    async function handleLogin(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
    
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
    
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
    
            setIsAuthenticated(true);  // ✅ Update state immediately  
            navigate("/");  // ✅ Now it should redirect correctly  
    
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <form 
                onSubmit={handleLogin} 
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Login</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <div className="mb-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        required 
                        aria-label="Enter your email"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        required 
                        aria-label="Enter your password"
                    />
                </div>

                <button 
                    type="submit" 
                    className={`w-full py-2 rounded text-white transition ${
                        loading 
                            ? "bg-blue-300 cursor-not-allowed" 
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="text-center mt-4 text-sm">
                    <span>Don't have an account?</span>{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register here
                    </Link>
                </div>
            </form>
        </div>
    );
}
