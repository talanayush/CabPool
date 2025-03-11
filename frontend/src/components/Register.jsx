import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register({ setIsAuthenticated }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        enrollmentNumber: "",
        phoneNumber: "",
        upiId: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    async function handleRegister(event) {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            if (!data.token) {
                throw new Error("No token received from backend");
            }

            // ✅ Store token & user info in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setIsAuthenticated(true);
            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">Register Yourself</h2>

                {error && <p className="text-red-500">{error}</p>}

                <label className="block text-sm font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                />

                <label className="block text-sm font-medium">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                />

                <label className="block text-sm font-medium">Enrollment Number</label>
                <input
                    type="text"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                />

                <label className="block text-sm font-medium">Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                />

                <label className="block text-sm font-medium">UPI ID</label>
                <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                />

                <label className="block text-sm font-medium">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <div className="text-center mt-4 text-sm">
                    <span>Already have an account?</span>{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login here
                    </Link>
                </div>
            </form>
        </div>
    );
}
