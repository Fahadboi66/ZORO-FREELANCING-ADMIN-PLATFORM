import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast, Slide } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";

export default function DefaultLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogOut = async () => {
    if (!confirm("Are you sure you want to log out?")) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/logout-user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status > 400) {
        const error = await response.json();
        toast.success(`${error.message}`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        return;
      }

      const data = await response.json();

      navigate("/");
      dispatch(logout());
      toast.success(`Logged out successfully`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
    } catch (err) {
      console.error(err);
      toast.error("Server Error - Please Try again later.", {
        theme: "dark",
        transition: Slide,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } fixed inset-y-0 left-0 z-30 md:w-72 w-full bg-[#0B1724] text-[#cae962] shadow-lg transition-transform md:block ${
            isSidebarOpen ? "h-[calc(100vh-4rem)]" : "h-full"
          } md:h-full`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center">
                <h1 className="text-4xl font-bold mb-8 mt-8">ZORO</h1>
                <img className="h-20" src="/zoro.png" />
              </div>
              <button
                className="text-[#cae962] md:hidden"
                onClick={toggleSidebar}
              >
                X
              </button>
            </div>
            <div className="mb-4 md:block sm:hidden">
              <hr className="opacity-40" />
            </div>
            <nav>
              <ul className="space-y-4">
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "block p-2 rounded bg-[#cae962] text-[#0B1724] transition"
                        : "block p-2 rounded hover:bg-[#cae962] hover:text-[#0B1724] transition"
                    }
                  >
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "block p-2 rounded bg-[#cae962] text-[#0B1724] transition"
                        : "block p-2 rounded hover:bg-[#cae962] hover:text-[#0B1724] transition"
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/disputes"
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "block p-2 rounded bg-[#cae962] text-[#0B1724] transition"
                        : "block p-2 rounded hover:bg-[#cae962] hover:text-[#0B1724] transition"
                    }
                  >
                    Dispute Handling
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/jobs"
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "block p-2 rounded bg-[#cae962] text-[#0B1724] transition"
                        : "block p-2 rounded hover:bg-[#cae962] hover:text-[#0B1724] transition"
                    }
                  >
                    Job Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/users"
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "block p-2 rounded bg-[#cae962] text-[#0B1724] transition"
                        : "block p-2 rounded hover:bg-[#cae962] hover:text-[#0B1724] transition"
                    }
                  >
                    User Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/payments"
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "block p-2 rounded bg-[#cae962] text-[#0B1724] transition"
                        : "block p-2 rounded hover:bg-[#cae962] hover:text-[#0B1724] transition"
                    }
                  >
                    Payment Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/notification"
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "block p-2 rounded bg-[#cae962] text-[#0B1724] transition"
                        : "block p-2 rounded hover:bg-[#cae962] hover:text-[#0B1724] transition"
                    }
                  >
                    Notification
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 ml-0 md:ml-72 flex flex-col">
          {/* Header */}
          <header className="bg-[#0B1724] sticky top-0 z-10 shadow-md">
            <div className="max-w-screen-xl flex items-center justify-between md:justify-end p-4">
              {/* Sidebar Toggle Button for Mobile */}
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 text-[#cae962] rounded hover:bg-[#cae962] hover:text-[#0B1724] transition"
              >
                <span className="sr-only">Toggle sidebar</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>

              {/* Login and Signup Buttons */}
              <div className="flex space-x-2">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogOut}
                    className="bg-[#cae962] text-[#0B1724] px-4 py-2 rounded font-bold shadow hover:shadow-lg hover:bg-white transition"
                  >
                    LOG OUT
                  </button>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="bg-[#cae962] text-[#0B1724] px-4 py-2 rounded font-bold shadow hover:shadow-lg hover:bg-white transition"
                    >
                      LOGIN
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="bg-[#cae962] text-[#0B1724] px-4 py-2 rounded font-bold shadow hover:shadow-lg hover:bg-white transition"
                    >
                      SIGN UP
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 flex-grow">
            <div className="mb-6">
              <h1 className="font-bold text-xl">Admin Panel</h1>
            </div>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Footer */}
      <ToastContainer />
    </div>
  );
}
