import Navbar from "./Navbar";
import Tickets from "./Tickets";
import { useState, useEffect } from "react";
import TicketModal from "./TicketModal";

import { jwtDecode } from "jwt-decode";


export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rides, setRides] = useState([]); // Store multiple rides

  async function handleSave(details) {
    try {
      console.log("mera add function");
      const token = localStorage.getItem("token");

      if (!token) {
          return <p>Not logged in</p>;
      }

      const decoded = jwtDecode(token);
      const response = await fetch("http://localhost:5000/tickets/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...details, userId: decoded.enrollmentNumber }), 
      });
  
      const data = await response.json();
      if (response.ok) {
        setRides([...rides, data.ticket]); // Update state with new ticket
      } else {
        console.error("Error saving ticket:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  
    setIsModalOpen(false);
  }

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch("http://localhost:5000/tickets/all");
        const data = await response.json();
        console.log("hehehe");
        console.log(data);
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
              time={ride.time}
              source={ride.source}
              destination={ride.destination}
              membersNeeded={ride.membersNeeded}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
