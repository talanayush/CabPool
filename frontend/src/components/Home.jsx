import Navbar from "./Navbar";
import Tickets from "./Tickets";
import { useState, useEffect } from "react";
import TicketModal from "./TicketModal";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rides, setRides] = useState([]);

  async function handleSave(details) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return <p>Not logged in</p>;

      const decoded = jwtDecode(token);
      const user = { enrollmentNumber: decoded.enrollmentNumber, name: decoded.name };

      const response = await fetch("http://localhost:5000/tickets/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...details, 
          userId: decoded.enrollmentNumber,  
          riders: [user],  
        }), 
      });

      const data = await response.json();
      if (response.ok) {
        setRides([...rides, data.ticket]);
      } else {
        console.error("Error saving ticket:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setIsModalOpen(false);
  }

  async function handleJoin(ticketId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const user = { enrollmentNumber: decoded.enrollmentNumber, name: decoded.name };

      const response = await fetch(`http://localhost:5000/tickets/join/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      const data = await response.json();
      if (response.ok) {
        setRides(rides.map(ride => ride._id === ticketId ? data.ticket : ride));
      } else {
        console.error("Error joining ticket:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  async function handleUnjoin(ticketId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const decoded = jwtDecode(token);
  
      const response = await fetch(`http://localhost:5000/tickets/unjoin/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentNumber: decoded.enrollmentNumber }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setRides(rides.map(ride => ride._id === ticketId ? data.ticket : ride));
      } else {
        console.error("Error unjoining ticket:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch("http://localhost:5000/tickets/all");
        const data = await response.json();
        if (response.ok) {
          setRides(data);
        } else {
          console.error("Error fetching tickets:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchTickets();
  }, []);

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="mt-16 p-6">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="p-4 bg-slate-200 rounded-lg font-bold cursor-pointer mt-2"
        >
          Add +
        </button>
        <TicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        <div className="mt-4">
          {rides.map((ride, index) => (
            <Tickets 
              key={index}
              id={ride._id} 
              time={ride.time}
              source={ride.source}
              destination={ride.destination}
              membersNeeded={ride.membersNeeded}
              riders={ride.riders}
              onJoin={handleJoin}
              onUnjoin={handleUnjoin}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
