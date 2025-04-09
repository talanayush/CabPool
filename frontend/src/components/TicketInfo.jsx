import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "./Navbar";
import Chat from "./Chat";

export default function TicketInfo() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalFare, setTotalFare] = useState("");
  const [farePerRider, setFarePerRider] = useState(null);
  const [isFareEntered, setIsFareEntered] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [upiLink, setUpiLink] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userEnrollmentNumber = loggedInUser?.enrollmentNumber;

  useEffect(() => {
    fetchTicketDetails();
  }, []);

  async function handlePayment(ownerId, amount) {
    try {
      console.log(ownerId);
      const response = await fetch(`http://localhost:5000/tickets/get-upi/${ownerId}`);
      const data = await response.json();
  
      if (!response.ok) {
        alert("Error fetching UPI ID: " + data.error);
        return;
      }
  
      const upiId = data.upiId;
      const link = `upi://pay?pa=${upiId}&pn=CabSharing&am=${amount}&cu=INR`;
      setUpiLink(link);
  
      const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = link; // Redirect to UPI app
      } else {
        setShowUPIModal(true); // Show modal on desktop
      }
    } catch (error) {
      console.error("Error fetching UPI ID:", error);
      alert("Failed to fetch UPI ID.");
    }
  }
  

  async function fetchTicketDetails() {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/tickets/${ticketId}`);
      const data = await response.json();
      if (response.ok) {
        setTicket(data);
        if (data.fare) {
          setTotalFare(data.fare);
          setFarePerRider((parseFloat(data.fare) / data.riders.length).toFixed(2));
          setIsFareEntered(true);
        }
      } else {
        console.error("Error fetching ticket details:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
        navigate("/");
      } else {
        console.error("Failed to archive ticket.");
      }
    } catch (error) {
      console.error("Error archiving ticket:", error);
    }
  }

  if (loading) return <p className="text-center mt-6 text-lg">Loading...</p>;
  if (!ticket)
    return <p className="text-center text-red-500 mt-6 text-lg">Ticket not found.</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800">🎟️ Ticket Details</h2>

        <div className="mt-4 text-lg">
          <p>
            <strong>⏰ Time:</strong> {ticket.time}
          </p>
          <p>
            <strong>📍 From:</strong> {ticket.source} → <strong>To:</strong> {ticket.destination}
          </p>
        </div>

        {isFareEntered && (
          <div className="mt-4 bg-gray-100 p-3 rounded-lg flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-700">
              💰 Each rider pays: ₹{farePerRider}
            </p>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-6 text-gray-700">👥 Riders</h3>
        <ul className="mt-2 bg-gray-100 p-3 rounded-lg">
          {ticket.riders.map((rider) => (
            <li key={rider.enrollmentNumber} className="p-3 flex justify-between items-center border-b last:border-none">
              <span className="text-gray-800">
                {rider.name} ({rider.enrollmentNumber}) -{" "}
                <span className={rider.paid ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {rider.paid ? "✅ Paid" : "❌ Not Paid"}
                </span>
              </span>

              {!rider.paid && isFareEntered && rider.enrollmentNumber !== ticket.userId && rider.enrollmentNumber === userEnrollmentNumber && (
                <button
                  onClick={() => handlePayment(ticket.userId, farePerRider)}
                  className="ml-4 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded font-medium"
                >
                  Pay ₹{farePerRider}
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

        {showUPIModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Scan QR Code to Pay</h2>
              <QRCodeSVG value={upiLink} size={200} />
              <p className="mt-3 text-gray-600">OR</p>
              <p
                className="mt-1 text-blue-500 underline cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(upiLink);
                  alert("UPI Link copied!");
                }}
              >
                Copy UPI Link
              </p>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowUPIModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}

      <button
        onClick={() => setShowChat(true)}
        className="ml-4 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded font-medium"
      >
        Open Chat
      </button>

      {/* Chat Component (conditionally rendered) */}
      {showChat && <Chat ticketId={ticket._id} closeChat={() => setShowChat(false)} />}
      </div>
    </div>
  );
}
