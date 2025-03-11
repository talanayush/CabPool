import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import User from "./components/UserProfile";
import TicketInfo from "./components/TicketInfo";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    checkAuth(); // ✅ Run immediately
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" /> : <Register setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route
          path="/user"
          element={isAuthenticated ? <User isAuthenticated={isAuthenticated} /> : <Navigate to="/login" />}
        />
         <Route path="/ticket/:ticketId" element={<TicketInfo />} /> {/* Route for TicketInfo */}
      </Routes>
    </Router>
  );
}

export default App;
