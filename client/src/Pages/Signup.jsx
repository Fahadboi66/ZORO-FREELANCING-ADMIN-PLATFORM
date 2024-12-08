import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    secretCode: ""
  });

  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { firstName, lastName, email, password, secretCode  } = formData;

    if (!firstName || !lastName || !email || !password || !secretCode  ) {
      toast.warning("Please provide all the information.", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      setLoading(false);
      return;
    }


    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/register-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status > 210) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();

      toast.success(`${data.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });

      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Something went wrong.", {
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
    <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-[#0B1724] shadow rounded sm:w-full md:w-full max-w-[500px] p-8 flex-shrink-0">
        <p className="text-2xl font-medium text-center text-[#cae962]">Sign Up</p>
        <p className="text-sm mt-4 text-center text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300 hover:underline">
            Login
          </Link>
        </p>
        <div className="flex items-center justify-between py-5">

        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm font-medium text-[#cae962]">First Name</label>
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-[#cae962]">Last Name</label>
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-[#cae962]">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-[#cae962]">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
            />
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-[#cae962]">Secret Code</label>
            <input
              type="password"
              name="secretCode"
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#cae962] text-[#0B1724] font-semibold rounded hover:bg-white transition"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
}
