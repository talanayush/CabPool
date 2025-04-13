import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";

const ChatP = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
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

  const handleClose = () => {
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <div className="pt-4 md:pt-15 h-[calc(100vh-4rem)] w-full flex flex-col bg-white overflow-hidden pb-5">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center shadow">
        <h2 className="text-lg font-semibold">Chat</h2>
        <button
          onClick={handleClose}
          className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-100"
        >
          Close
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.senderId === user.senderId
                ? "bg-blue-200 self-end ml-auto text-right"
                : "bg-gray-200 self-start mr-auto text-left"
            }`}
          >
            <p className="text-sm font-semibold">{msg.senderName}</p>
            <p className="text-base">{msg.message}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-2 flex gap-2 border-t border-gray-300">
        <input
          type="text"
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatP;
