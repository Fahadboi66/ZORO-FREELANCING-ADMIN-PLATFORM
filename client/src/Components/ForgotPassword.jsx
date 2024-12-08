import React, { useState } from 'react';
import { toast, Slide } from "react-toastify";

const ForgotPasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      toast.error("Please fill all fields", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        onClose();
      } else {
        toast.error(data.message || "Password reset failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
      }
    } catch (err) {
      toast.error("Server error. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0B1724] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-medium text-center text-[#cae962] mb-6">
          Reset Password
        </h2>
        
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label className="text-sm font-medium text-[#cae962]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium text-[#cae962]">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="text-sm font-medium text-[#cae962]">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
              required
            />
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 mr-2 py-3 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 ml-2 py-3 bg-[#cae962] text-[#0B1724] font-semibold rounded hover:bg-white transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;