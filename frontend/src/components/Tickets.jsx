const Tickets = ({ time, source, destination, membersNeeded }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-300 mx-20 my-5">
        <h2 className="text-lg font-semibold text-gray-700">🚕 Ride Details</h2>
        <p className="text-gray-600 mt-2"><strong>Time to Leave:</strong> {time}</p>
        <p className="text-gray-600"><strong>Source:</strong> {source}</p>
        <p className="text-gray-600"><strong>Destination:</strong> {destination}</p>
        <p className="text-gray-600"><strong>Members Needed:</strong> {membersNeeded}</p>
        <button className=" p-4 bg-slate-200 rounded-lg font-bold cursor-pointer mt-2">Add in +</button>
      </div>
    );
  };
  
  export default Tickets;
  