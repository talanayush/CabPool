import { useState } from "react";

export default function RideDetailsModal({ isOpen, onClose, onSave }) {
  const [rideDetails, setRideDetails] = useState({
    time: "",
    source: "",
    destination: "",
    membersNeeded: 0,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setRideDetails(prevDetails => ({
      ...prevDetails,
      [name]: name === "membersNeeded" ? Math.min(Math.max(0, Number(value)), 3) : value,
    }));
  }

  function handleSubmit() {
    onSave(rideDetails);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">🚕 Ride Details</h2>

        <div className="flex flex-col space-y-3">
          <label className="font-medium">Time to Leave:</label>
          <input
            type="time"
            name="time"
            className="border p-2 rounded"
            value={rideDetails.time}
            onChange={handleChange}
            required
          />

          <label className="font-medium">Source:</label>
          <input
            type="text"
            name="source"
            className="border p-2 rounded"
            placeholder="Enter source"
            value={rideDetails.source}
            onChange={handleChange}
            required
          />

          <label className="font-medium">Destination:</label>
          <input
            type="text"
            name="destination"
            className="border p-2 rounded"
            placeholder="Enter destination"
            value={rideDetails.destination}
            onChange={handleChange}
            required
          />

          <label className="font-medium">Members Needed (Max 3):</label>
          <input
            type="number"
            name="membersNeeded"
            className="border p-2 rounded"
            value={rideDetails.membersNeeded}
            onChange={handleChange}
            min="0"
            max="3"
            required
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500" onClick={onClose}>Cancel</button>
          <button className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
