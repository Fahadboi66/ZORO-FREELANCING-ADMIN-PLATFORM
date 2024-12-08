import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  ShieldAlert, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, percentage, color }) => {
  const isPositive = percentage >= 0;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`${color} w-6 h-6`} />
        </div>
        <div className="text-right">
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
          <div className="flex items-center justify-end space-x-1">
            <p className="text-2xl font-bold">{value}</p>
            {percentage !== undefined && (
              <span className={`flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {Math.abs(percentage)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentJobsTable = ({ jobs }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Job Title</th>
            <th className="py-2 text-left">Client</th>
            <th className="py-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs ? jobs.map((job) => (
            <tr key={job.id} className="border-b last:border-b-0 hover:bg-gray-50">
              <td className="py-2">{job.title}</td>
              <td className="py-2">{job.client}</td>
              <td className="py-2 text-right">
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${job.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      job.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'}`}
                >
                  {job.status}
                </span>
              </td>
            </tr>
          )) : <p>No jobs at the moment</p>}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/dashboard/analytics`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log(response)
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        console.log(data.data);
        setDashboardData(data.data);  // Assuming your response structure has `data`
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Calculate percentage changes
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const totalUsersPercentage = calculatePercentageChange(dashboardData.users.total, 100); // Assuming 100 as the previous value for demonstration
  const activeJobsPercentage = calculatePercentageChange(dashboardData.jobs.active, 1); // Assuming 1 as the previous value for demonstration
  const completedPaymentsPercentage = calculatePercentageChange(dashboardData.payments.completed, 10); // Assuming 10 as the previous value for demonstration
  const openDisputesPercentage = calculatePercentageChange(dashboardData.disputes.open, 5); // Assuming 5 as the previous value for demonstration

  return (
    <div className="bg-gray-50 min-h-screen p-8 ">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={Users} 
          title="Total Users" 
          value={dashboardData.users.total} 
          percentage={totalUsersPercentage} 
          color="text-blue-500" 
        />
        <StatCard 
          icon={Briefcase} 
          title="Active Jobs" 
          value={dashboardData.jobs.active} 
          percentage={activeJobsPercentage} 
          color="text-green-500" 
        />
        <StatCard 
          icon={DollarSign} 
          title="Completed Payments" 
          value={dashboardData.payments.completed} 
          percentage={completedPaymentsPercentage} 
          color="text-purple-500" 
        />
        <StatCard 
          icon={ShieldAlert} 
          title="Open Disputes" 
          value={dashboardData.disputes.open} 
          percentage={openDisputesPercentage} 
          color="text-red-500" 
        />
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentJobsTable jobs={dashboardData.recentJobs} />
        
        {/* User Roles Breakdown */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">User Roles</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Freelancers</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mx-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${(dashboardData.users.freelancers / dashboardData.users.total) * 100}%`}}
                ></div>
              </div>
              <span>{dashboardData.users.freelancers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Clients</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mx-4">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{width: `${(dashboardData.users.clients / dashboardData.users.total) * 100}%`}}
                ></div>
              </div>
              <span>{dashboardData.users.clients}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Admins</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mx-4">
                <div 
                  className="bg-red-600 h-2.5 rounded-full" 
                  style={{width: `${(dashboardData.users.admins / dashboardData.users.total) * 100}%`}}
                ></div>
              </div>
              <span>{dashboardData.users.admins}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
