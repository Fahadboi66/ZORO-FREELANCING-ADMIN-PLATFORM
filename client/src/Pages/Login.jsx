import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux"; 
import { toast, Slide } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { loginInStart, loginInSuccess, loginInFailure } from "../features/user/userSlice"; 
import OAuth from "../Auth_Components/OAuth";
import ForgotPasswordModal from '../Components/ForgotPassword'; // We'll create this component

export default function Login() {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "" 
  });
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  
  const { loading, error } = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginInStart());

    const { email, password } = formData;

    if (!email || !password) {
      dispatch(loginInFailure("Please fill the form completely."));
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login-user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status > 210) {
        const error = await response.json();
        console.log(error);
        dispatch(loginInFailure(error.message));
        return;
      }

      const data = await response.json();
      dispatch(loginInSuccess(data.data.user));
      toast.success(`Welcome! ${data.data.user.firstName}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      navigate("/");
    } catch (err) {
      dispatch(loginInFailure("Server error occurred. Please try again later."));
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-[#0B1724] shadow rounded sm:w-full md:w-full max-w-[500px] p-8 flex-shrink-0">
        <p className="text-2xl font-medium text-center text-[#cae962]">
          Login to your account
        </p>
        <p className="text-sm mt-4 text-center text-white">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-300 hover:underline">
            Sign Up
          </Link>
        </p>
        
        <OAuth />
        
        <div className="flex items-center justify-between py-5">
          <hr className="w-full bg-gray-400" />
          <p className="text-base font-medium text-[#cae962] px-2">OR</p>
          <hr className="w-full bg-gray-400" />
        </div>
        
        <form onSubmit={handleLogin}>
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
          
          <div className="mb-6">
            <label className="text-sm font-medium text-[#cae962]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
              required
            />
          </div>
          
          <div 
            className="mb-4 text-blue-300 hover:underline cursor-pointer text-sm"
            onClick={() => setShowForgotPasswordModal(true)}
          >
            Forgot Password?
          </div>
          
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          
          <button
            type="submit"
            className="w-full py-3 bg-[#cae962] text-[#0B1724] font-semibold rounded hover:bg-white transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>

      {showForgotPasswordModal && (
        <ForgotPasswordModal 
          onClose={() => setShowForgotPasswordModal(false)} 
        />
      )}
    </section>
  );
}