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
        setRides([data.ticket, ...rides]); // 🔹 Add new ride to top
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

  async function handleDelete(ticketId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const decoded = jwtDecode(token);
      const enrollmentNumber = decoded.enrollmentNumber; // Get user's enrollment number
  
      const response = await fetch(`http://localhost:5000/tickets/delete/${ticketId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentNumber }) // Send the owner's enrollment number
      });
  
      const data = await response.json();
      if (response.ok) {
        setRides(rides.filter(ride => ride._id !== ticketId)); // 🔹 Remove deleted ride from state
      } else {
        console.error("Error deleting ticket:", data.error);
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
          // 🔹 Sort tickets by latest createdAt
          const sortedTickets = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRides(sortedTickets);
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
      <Navbar setIsAuthenticated={setIsAuthenticated} />
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
              key={ride._id} // Changed key from index to _id (better for React rendering)
              id={ride._id} 
              time={ride.time}
              source={ride.source}
              destination={ride.destination}
              membersNeeded={ride.membersNeeded}
              riders={ride.riders}
              onJoin={handleJoin}
              onUnjoin={handleUnjoin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
