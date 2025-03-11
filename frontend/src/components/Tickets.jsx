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

  // ❌ Don't render completed rides
  if (isCompleted) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 mb-4 max-w-md mx-auto sm:max-w-lg lg:max-w-xl">
      {/* Ride Info */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{source} → {destination}</h2>
        <p className="text-sm text-gray-600">{time}</p>
      </div>

      {/* Seats Left */}
      <p className="text-gray-700 mb-2">
        <strong>Seats Left:</strong> <span className="font-semibold">{membersNeeded}</span>
      </p>

      {/* Riders List */}
      <div className="bg-gray-100 p-2 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-1">Riders:</h3>
        <ul className="list-none text-sm text-gray-600">
          {riders.map((rider, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="block w-2 h-2 bg-blue-500 rounded-full"></span>
              {rider.name} (Enrollment: {rider.enrollmentNumber})
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {isCreator ? (
          <button 
            onClick={() => onDelete(id)} 
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        ) : isAlreadyJoined ? (
          <button 
            onClick={() => onUnjoin(id)} 
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Unjoin
          </button>
        ) : membersNeeded > 0 ? (
          <button 
            onClick={() => onJoin(id)} 
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Join In
          </button>
        ) : (
          <p className="text-sm text-gray-500 mt-2 w-full text-center">No seats left</p>
        )}
      </div>
    </div>
  );
}
