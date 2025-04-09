import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const Chat = ({ ticketId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({ senderId: "", senderName: "" });
  const chatEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          senderId: decoded.enrollmentNumber,
          senderName: decoded.name,
        });
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/chat/${ticketId}`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [ticketId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      ticketId,
      message: newMessage,
      senderName: user.senderName,
      senderId: user.senderId,
    };

    try {
      const res = await fetch("http://localhost:5000/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error sending message:", data);
      } else {
        setMessages((prev) => [...prev, messageData]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border border-gray-300 rounded-lg bg-white shadow">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
      <h3 className="text-lg font-semibold">Ticket ID: {ticketId}</h3>

        <button onClick={onClose} className="text-white text-sm hover:underline">
          Close
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isOwn = msg.senderId === user.senderId;
            return (
              <div
                key={index}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    isOwn
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >
                  <span className="block">{msg.message}</span>
                  <span className="text-[10px] opacity-60 mt-1 block text-right">
                    {msg.senderName}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-sm">No messages yet.</p>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-2 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-full text-sm focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
