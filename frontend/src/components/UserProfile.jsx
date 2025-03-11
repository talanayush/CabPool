import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";

export default function User({ isAuthenticated }) {
  const [user, setUser] = useState(null);
  const [createdTickets, setCreatedTickets] = useState([]);
  const [joinedTickets, setJoinedTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
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
        const response = await fetch("http://localhost:5000/tickets/all");
        const data = await response.json();
        if (response.ok) {
          const created = data.filter(ticket => ticket.userId === decoded.enrollmentNumber);
          const joined = data.filter(ticket => 
            ticket.riders.some(r => r.enrollmentNumber === decoded.enrollmentNumber)
          );

          setCreatedTickets(created);
          setJoinedTickets(joined);
        } else {
          console.error("Error fetching user tickets:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchUserTickets();
  }, [isAuthenticated, navigate]);

  function handleTicketClick(ticketId) {
    navigate(`/ticket/${ticketId}`); // Navigate to TicketInfo
  }

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

        {/* Created Tickets */}
        <h2 className="text-xl font-bold mt-6">Your Created Tickets</h2>
        {createdTickets.length > 0 ? (
          createdTickets.map(ticket => (
            <div 
              key={ticket._id} 
              onClick={() => handleTicketClick(ticket._id)} 
              className="cursor-pointer block p-4 bg-white shadow-md rounded-lg mt-2 hover:bg-gray-100"
            >
              <p><strong>Time:</strong> {ticket.time}</p>
              <p><strong>From:</strong> {ticket.source} → <strong>To:</strong> {ticket.destination}</p>
            </div>
          ))
        ) : (
          <p>No tickets created.</p>
        )}

        {/* Joined Tickets */}
        <h2 className="text-xl font-bold mt-6">Tickets You Joined</h2>
        {joinedTickets.length > 0 ? (
          joinedTickets.map(ticket => (
            <div 
              key={ticket._id} 
              onClick={() => handleTicketClick(ticket._id)} 
              className="cursor-pointer block p-4 bg-white shadow-md rounded-lg mt-2 hover:bg-gray-100"
            >
              <p><strong>Time:</strong> {ticket.time}</p>
              <p><strong>From:</strong> {ticket.source} → <strong>To:</strong> {ticket.destination}</p>
            </div>
          ))
        ) : (
          <p>You have not joined any tickets.</p>
        )}
      </div>
    </div>
  );
}
