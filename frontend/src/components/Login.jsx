import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function onChangeEmail(event) {
        setEmail(event.target.value);
    }

    function onChangePassword(event) {
        setPassword(event.target.value);
    }

    async function handleLogin(event) {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include", // To handle HTTP-only cookies
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            alert("Login successful!");
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">Login</h2>

                {error && <p className="text-red-500">{error}</p>}

                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={onChangeEmail} 
                    className="w-full p-2 border rounded mb-3"
                    required 
                />

                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    onChange={onChangePassword} 
                    className="w-full p-2 border rounded mb-4"
                    required 
                />

                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
