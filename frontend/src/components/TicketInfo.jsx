import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TicketInfo() {
  const { ticketId } = useParams();
  console.log(ticketId);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    async function fetchTicketDetails() {
      try {
        const response = await fetch(`http://localhost:5000/tickets/${ticketId}`);
        const data = await response.json();
        if (response.ok) {
          setTicket(data);
        } else {
          console.error("Error fetching ticket details:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchTicketDetails();
  }, [ticketId]);

  async function markRiderAsPaid(riderId) {
    try {
      const response = await fetch(`http://localhost:5000/tickets/markPaid/${ticketId}/${riderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        setTicket(prevTicket => ({
          ...prevTicket,
          riders: prevTicket.riders.map(r => 
            r.enrollmentNumber === riderId ? { ...r, paid: true } : r
          ),
          paymentsConfirmed: prevTicket.riders.every(r => r.paid || r.enrollmentNumber === riderId)
        }));
      } else {
        console.error("Failed to update rider payment.");
      }
    } catch (error) {
      console.error("Error updating rider payment:", error);
    }
  }

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Ticket Details</h2>
      <p><strong>Time:</strong> {ticket.time}</p>
      <p><strong>From:</strong> {ticket.source} → <strong>To:</strong> {ticket.destination}</p>
      <p><strong>Fare:</strong> ₹{ticket.fare}</p>

      <h3 className="text-lg font-semibold mt-4">Riders</h3>
      <ul>
        {ticket.riders.map(rider => (
          <li key={rider.enrollmentNumber} className="p-2 border-b">
            {rider.name} ({rider.enrollmentNumber}) - 
            {rider.paid ? " ✅ Paid" : " ❌ Not Paid"}
            {!rider.paid && (
              <button 
                onClick={() => markRiderAsPaid(rider.enrollmentNumber)} 
                className="ml-2 bg-green-500 text-white px-2 py-1 rounded">
                Mark as Paid
              </button>
            )}
          </li>
        ))}
      </ul>

      {ticket.paymentsConfirmed ? (
        <p className="text-green-600 font-bold mt-2">✅ All riders have paid!</p>
      ) : (
        <p className="text-red-600 font-bold mt-2">❌ Payment pending from some riders.</p>
      )}
    </div>
  );
}
