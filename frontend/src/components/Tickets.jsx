import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Tickets({ id, time, source, destination, membersNeeded, riders, userId, isCompleted, onJoin, onUnjoin, onDelete }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let decoded = null;
  try {
    if (token) {
      decoded = jwtDecode(token);
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token"); // Clear invalid token
    navigate("/login"); // Redirect to login
  }

  const userEnrollment = decoded?.enrollmentNumber || "";
  const isAlreadyJoined = riders.some(rider => rider.enrollmentNumber === userEnrollment);
  const isCreator = userEnrollment === userId;

  //console.log("Decoded Enrollment:", userEnrollment);
  //console.log("Ticket Owner Enrollment:", userId);
  //console.log("Is Creator:", isCreator);
  //console.log("Is Already Joined:", isAlreadyJoined);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-bold">{source} → {destination}</h2>
      <p><strong>Time:</strong> {time}</p>
      <p><strong>Seats Left:</strong> {membersNeeded}</p>
      {isCompleted && <p className="text-red-600 font-semibold">Ride Completed</p>}

      <h3 className="font-semibold mt-2">Riders:</h3>
      <ul className="list-disc ml-4">
        {riders.map((rider, index) => (
          <li key={index} className="text-sm">
            {rider.name} (Enrollment: {rider.enrollmentNumber})
          </li>
        ))}
      </ul>

      {!isCompleted && (
        <>
          {isCreator ? (
            <button 
              onClick={() => onDelete(id)} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
            >
              Delete
            </button>
          ) : isAlreadyJoined ? (
            <button 
              onClick={() => onUnjoin(id)} 
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
            >
              Unjoin
            </button>
          ) : membersNeeded > 0 ? (
            <button 
              onClick={() => onJoin(id)} 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
            >
              Join In
            </button>
          ) : (
            <p className="text-sm text-gray-500 mt-2">No seats left</p>
          )}
        </>
      )}
    </div>
  );
}
