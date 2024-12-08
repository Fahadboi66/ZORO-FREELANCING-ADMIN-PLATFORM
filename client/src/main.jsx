import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Error from "./Components/Error.jsx";
import DefaultLayout from "./Components/DefaultLayout.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from "./store/store.js";
import ProtectedRoute from "./Auth_Components/ProtectedRoute.jsx";
import LoginDisabled from "./Components/LoginDisabled.jsx";
import {CssBaseline} from "@mui/material";
import {HelmetProvider} from "react-helmet-async"
import AdminDashboard from "./Pages/Dashboard.jsx";
import JobManagementPage from "./Pages/JobManagement.jsx";
import UserManagement from "./Pages/UserManagement.jsx";
import DisputeManagement from "./Pages/DisputeManagement.jsx";
import ProfilePage from "./Pages/MyProfile.jsx";
import PaymentsDashboard from "./Pages/PaymentManagement.jsx";
import NotificationPage from "./Pages/Notification.jsx";
import HomePage from "./Pages/Home.jsx";



const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    path: "/",
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        element: <ProtectedRoute />,
        path: "/",
        children: [
          {
            element: <AdminDashboard />,
            path: "/dashboard",
          },
          {
            element: <DisputeManagement />,
            path: "/disputes",
          },
          {
            element: <JobManagementPage />,
            path: "/jobs",
          },
          {
            element:<UserManagement /> ,
            path: "/users",
          },
          {
            element: <ProfilePage />,
            path: "/profile",
          },
          {
            element: <PaymentsDashboard />,
            path: "/payments",
          },
          {
            element: <NotificationPage />,
            path: "/notification",
          },
        ]
      },
      {
        element: <LoginDisabled />,
        children: [
          {
            element: <Login />,
            path: "/login",
          }
        ]
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </HelmetProvider>
      </PersistGate>
    </Provider>
);
