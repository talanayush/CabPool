import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";

export default function User({ isAuthenticated }) {
  const [user, setUser] = useState(null);
  const [createdTickets, setCreatedTickets] = useState([]);
  const [joinedTickets, setJoinedTickets] = useState([]);
  const [completedTickets, setCompletedTickets] = useState([]);
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

          setCompletedTickets([...created, ...joined].filter(ticket => ticket.isCompleted));
          setCreatedTickets(created.filter(ticket => !ticket.isCompleted));
          setJoinedTickets(joined.filter(ticket => !ticket.isCompleted));
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
    navigate(`/ticket/${ticketId}`); 
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar setIsAuthenticated={isAuthenticated} />
      <div className="max-w-4xl mx-auto mt-16 p-6">
        
        {/* User Info Card */}
        {user ? (
          <div className="p-6 bg-white shadow-md rounded-lg flex items-center space-x-4">
            <div className="bg-blue-500 text-white p-3 rounded-full">
              <i className="fas fa-user text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">🎓 {user.enrollmentNumber}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading user information...</p>
        )}

        {/* Created Tickets */}
        <h2 className="text-xl font-bold mt-8 text-blue-600">Your Created Tickets</h2>
        <div className="space-y-3">
          {createdTickets.length > 0 ? (
            createdTickets.map(ticket => (
              <div 
                key={ticket._id} 
                onClick={() => handleTicketClick(ticket._id)} 
                className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-blue-100 transition"
              >
                <p className="text-gray-700"><strong>📅 Time:</strong> {ticket.time}</p>
                <p className="text-gray-700"><strong>📍 From:</strong> {ticket.source} → <strong>To:</strong> {ticket.destination}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No active tickets created.</p>
          )}
        </div>

        {/* Joined Tickets */}
        <h2 className="text-xl font-bold mt-8 text-purple-600">Tickets You Joined</h2>
        <div className="space-y-3">
          {joinedTickets.length > 0 ? (
            joinedTickets.map(ticket => (
              <div 
                key={ticket._id} 
                onClick={() => handleTicketClick(ticket._id)} 
                className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-purple-100 transition"
              >
                <p className="text-gray-700"><strong>📅 Time:</strong> {ticket.time}</p>
                <p className="text-gray-700"><strong>📍 From:</strong> {ticket.source} → <strong>To:</strong> {ticket.destination}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You have not joined any active tickets.</p>
          )}
        </div>

        {/* Completed Tickets */}
        <h2 className="text-xl font-bold mt-8 text-green-600">Completed Rides</h2>
        <div className="space-y-3">
          {completedTickets.length > 0 ? (
            completedTickets.map(ticket => (
              <div 
                key={ticket._id} 
                className="p-4 bg-gray-300 shadow-md rounded-lg cursor-not-allowed"
              >
                <p className="text-gray-700"><strong>📅 Time:</strong> {ticket.time}</p>
                <p className="text-gray-700"><strong>📍 From:</strong> {ticket.source} → <strong>To:</strong> {ticket.destination}</p>
                <p className="text-green-700 font-semibold">✔️ Ride Completed</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No completed rides.</p>
          )}
        </div>
      </div>
    </div>
  );
}
