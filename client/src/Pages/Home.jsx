import React from "react";
import {
  Home,
  Bell,
  Users,
  Settings,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";


const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col ">
      {/* Header */}
      <header className="bg-[#0B1724] text-white py-4 px-6 rounded-md shadow-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="/zoro.png"
            alt="Logo"
            className="w-12 h-12 rounded-full"
          />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Welcome Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Admin Panel
          </h2>
          <p className="text-gray-600 mb-6">
            Manage notifications, disputes, jobs, users, and settings
            seamlessly. Your administrative tools in one place.
          </p>
          <button className="bg-[#0B1724] text-white px-6 py-2 rounded-md shadow hover:bg-blue-900">
            <Link
              to="/dashboard" >
              Get Started
              <ArrowRight className="inline ml-2" />
            </Link>
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 w-full max-w-6xl">
          {/* Feature Cards */}
          {[
            {
              title: "Manage Users",
              icon: Users,
              description: "Control user access and monitor activity.",
            },
            {
              title: "Manage Jobs",
              icon: Briefcase,
              description: "Post, manage, and review job listings.",
            },
            {
              title: "Manage Disputes",
              icon: Users,
              description: "Oversee and resolve disputes effectively.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <feature.icon className="w-12 h-12 text-[#0B1724] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
