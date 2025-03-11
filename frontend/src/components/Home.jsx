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
      if (!token) return;

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        console.error("Invalid token:", err);
        return;
      }

      const user = { enrollmentNumber: decoded.enrollmentNumber, name: decoded.name };

      const response = await fetch("http://localhost:5000/tickets/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, userId: decoded.enrollmentNumber, riders: [user] }),
      });

      const data = await response.json();
      if (response.ok) {
        setRides((prevRides) => [data.ticket, ...prevRides]);
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

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        console.error("Invalid token:", err);
        return;
      }

      const user = { enrollmentNumber: decoded.enrollmentNumber, name: decoded.name };

      const response = await fetch(`http://localhost:5000/tickets/join/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      const data = await response.json();
      if (response.ok) {
        setRides((prevRides) =>
          prevRides.map((ride) => (ride._id === ticketId ? data.ticket : ride))
        );
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

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        console.error("Invalid token:", err);
        return;
      }

      const response = await fetch(`http://localhost:5000/tickets/unjoin/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentNumber: decoded.enrollmentNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setRides((prevRides) =>
          prevRides.map((ride) => (ride._id === ticketId ? data.ticket : ride))
        );
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

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        console.error("Invalid token:", err);
        return;
      }

      const enrollmentNumber = decoded.enrollmentNumber;

      const response = await fetch(`http://localhost:5000/tickets/delete/${ticketId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setRides((prevRides) => prevRides.filter((ride) => ride._id !== ticketId));
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
          const sortedTickets = data
            .filter((ticket) => ticket.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRides(sortedTickets);
        } else {
          console.error("Error fetching tickets:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchTickets();
  }, [isAuthenticated]);

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
          {rides.map((ride) => (
            <Tickets
              key={ride._id} // Use unique `_id` for keys
              id={ride._id}
              time={ride.time}
              source={ride.source}
              destination={ride.destination}
              membersNeeded={ride.membersNeeded}
              riders={ride.riders}
              userId={ride.userId} // ✅ Passing `userId` correctly
              isCompleted={ride.isCompleted}
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
