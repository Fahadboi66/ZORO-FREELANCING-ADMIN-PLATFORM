import React, { useState, useEffect } from "react";
import { Send, Users, MessageCircle, CheckCircle2, AlertTriangle } from "lucide-react";

const NotificationPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  // Fetch users from server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/users/all`,
          { method: "GET", credentials: "include" }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        setStatus({ type: "error", message: error.message });
      }
    };

    fetchUsers();
  }, []);

  // Handle notification send
  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!selectedUser || !message.trim()) {
      console.log(selectedUser);
      setStatus({
        type: "error",
        message: "Please select a user and enter a message.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/notifications/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: selectedUser, message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send notification.");
      }

      const data = await response.json();

      setStatus({ type: "success", message: data.message });

      // Reset form
      setSelectedUser("");
      setMessage("");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-[#0B1724] text-white p-6 flex items-center">
          <MessageCircle className="w-10 h-10 mr-4" />
          <div>
            <h1 className="text-2xl font-bold">Send Notification</h1>
            <p className="text-blue-100">Send personalized messages to users</p>
          </div>
        </div>

        <form onSubmit={handleSendNotification} className="p-8 space-y-6">
          <div>
            <label
              htmlFor="user"
              className="text-sm font-medium text-gray-700 mb-2 flex items-center"
            >
              <Users className="w-5 h-5 mr-2 text-[#0B1724]" />
              Select User
            </label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Choose a User</option>
              {users.map((user) => (
                <option key={user._id} value={user.email}>
                  {`${user.firstName} ${user.lastName} (${user.email})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700 mb-2 flex items-center"
            >
              <MessageCircle className="w-5 h-5 mr-2 text-[#0B1724]" />
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notification message here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {status && (
            <div
              className={`p-4 rounded-lg flex items-center ${
                status.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="w-6 h-6 mr-3" />
              ) : (
                <AlertTriangle className="w-6 h-6 mr-3" />
              )}
              {status.message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#0B1724] text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition flex items-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationPage;
