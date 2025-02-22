import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import Tickets from "./Tickets";

export default function User({ isAuthenticated }) {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // 🔹 Redirect to login if not authenticated
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    setUser({
      enrollmentNumber: decoded.enrollmentNumber,
      name: decoded.name,
    });

    async function fetchUserTickets() {
      try {
        const response = await fetch(`http://localhost:5000/tickets/all`);
        const data = await response.json();
        if (response.ok) {
          // 🔹 Filter and sort tickets by latest `createdAt`
          const userTickets = data
            .filter(ticket => ticket.userId === decoded.enrollmentNumber)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Latest first

          setTickets(userTickets);
        } else {
          console.error("Error fetching user tickets:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchUserTickets();
  }, [isAuthenticated, navigate]); // 🔹 Re-run effect when auth state changes

  return (
    <div>
      <Navbar />
      <div className="mt-16 p-6">
        {user ? (
          <div className="p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-bold">User Information</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Enrollment Number:</strong> {user.enrollmentNumber}</p>
          </div>
        ) : (
          <p>Loading user information...</p>
        )}

        <div className="mt-4">
          <h2 className="text-xl font-bold">Your Tickets</h2>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <Tickets 
                key={ticket._id}
                id={ticket._id} 
                time={ticket.time}
                source={ticket.source}
                destination={ticket.destination}
                membersNeeded={ticket.membersNeeded}
                riders={ticket.riders}
              />
            ))
          ) : (
            <p>No tickets raised.</p>
          )}
        </div>
      </div>
    </div>
  );
}
