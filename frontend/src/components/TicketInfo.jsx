import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TicketInfo() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user details (assuming stored in localStorage)
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userEnrollmentNumber = loggedInUser?.enrollmentNumber; // Logged-in user's enrollment number

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  async function fetchTicketDetails() {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/tickets/${ticketId}`);
      const data = await response.json();
      if (response.ok) {
        setTicket(data);
      } else {
        console.error("Error fetching ticket details:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markRiderAsPaid(riderId, paidStatus) {
    if (userEnrollmentNumber !== ticket.userId) return; // Prevent unauthorized users
    try {
      const response = await fetch(`http://localhost:5000/tickets/markPaid/${ticketId}/${riderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: paidStatus }),
      });

      if (response.ok) {
        setTicket((prevTicket) => {
          const updatedRiders = prevTicket.riders.map((r) =>
            r.enrollmentNumber === riderId ? { ...r, paid: paidStatus } : r
          );
          return {
            ...prevTicket,
            riders: updatedRiders,
            paymentsConfirmed: updatedRiders.every((r) => r.paid),
          };
        });
      } else {
        console.error("Failed to update rider payment.");
      }
    } catch (error) {
      console.error("Error updating rider payment:", error);
    }
  }

  async function closeTicket() {
    if (!window.confirm("Are you sure you want to archive this ticket?")) return;
    try {
      const response = await fetch(`http://localhost:5000/tickets/close/${ticketId}`, {
        method: "PATCH",
      });
  
      if (response.ok) {
        alert("Ticket archived successfully!");
        navigate("/"); // Redirect to homepage or ticket list
      } else {
        console.error("Failed to archive ticket.");
      }
    } catch (error) {
      console.error("Error archiving ticket:", error);
    }
  }

  if (loading) return <p className="text-center mt-6 text-lg">Loading...</p>;
  if (!ticket) return <p className="text-center text-red-500 mt-6 text-lg">Ticket not found.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800">🎟️ Ticket Details</h2>

      <div className="mt-4 text-lg">
        <p><strong>⏰ Time:</strong> {ticket.time}</p>
        <p><strong>📍 From:</strong> {ticket.source} → <strong>To:</strong> {ticket.destination}</p>
        <p><strong>💰 Fare:</strong> ₹{ticket.fare}</p>
      </div>

      <h3 className="text-xl font-semibold mt-6 text-gray-700">👥 Riders</h3>
      <ul className="mt-2 bg-gray-100 p-3 rounded-lg">
        {ticket.riders.map((rider) => (
          <li
            key={rider.enrollmentNumber}
            className="p-3 flex justify-between items-center border-b last:border-none"
          >
            <span className="text-gray-800">
              {rider.name} ({rider.enrollmentNumber}) -{" "}
              <span className={rider.paid ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {rider.paid ? "✅ Paid" : "❌ Not Paid"}
              </span>
            </span>

            {/* Only ticket owner can mark payments */}
            {userEnrollmentNumber === ticket.userId && (
              <button
                onClick={() => markRiderAsPaid(rider.enrollmentNumber, !rider.paid)}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  rider.paid
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {rider.paid ? "Mark as Unpaid" : "Mark as Paid"}
              </button>
            )}
          </li>
        ))}
      </ul>

      {ticket.paymentsConfirmed ? (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
          ✅ All riders have paid! 🎉
          {userEnrollmentNumber === ticket.userId && (
            <button
              onClick={closeTicket}
              className="block mt-4 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded font-medium mx-auto"
            >
              Close Ticket
            </button>
          )}
        </div>
      ) : (
        <p className="text-red-600 font-bold mt-6 text-center">❌ Payment pending from some riders.</p>
      )}
    </div>
  );
}
