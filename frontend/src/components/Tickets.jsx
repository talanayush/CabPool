import { jwtDecode } from "jwt-decode";

export default function Tickets({ id, time, source, destination, membersNeeded, riders, onJoin, onUnjoin }) {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const isAlreadyJoined = decoded && riders.some(rider => rider.enrollmentNumber === decoded.enrollmentNumber);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-bold">{source} → {destination}</h2>
      <p><strong>Time:</strong> {time}</p>
      <p><strong>Seats Left:</strong> {membersNeeded}</p>
      
      <h3 className="font-semibold mt-2">Riders:</h3>
      <ul className="list-disc ml-4">
        {riders.map((rider, index) => (
          <li key={index} className="text-sm">
            {rider.name} (Enrollment: {rider.enrollmentNumber})
          </li>
        ))}
      </ul>

      {membersNeeded > 0 && !isAlreadyJoined ? (
        <button 
          onClick={() => onJoin(id)} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
        >
          Join In
        </button>
      ) : isAlreadyJoined ? (
        <button 
          onClick={() => onUnjoin(id)} 
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
        >
          Unjoin
        </button>
      ) : (
        <p className="text-sm text-gray-500 mt-2">No seats left</p>
      )}
    </div>
  );
}
