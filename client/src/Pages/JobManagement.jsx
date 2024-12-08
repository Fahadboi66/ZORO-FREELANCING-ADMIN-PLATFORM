import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Briefcase, 
  FilterIcon 
} from 'lucide-react';
import { toast, Slide } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const JobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const apiUrl = import.meta.env.VITE_APP_API_URL; // Use the environment variable

  // Fetch jobs from the server
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/jobs/all`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setJobs(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  // Approve a job
  const handleApprove = async (jobId) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/jobs/approve/${jobId}`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        fetchJobs(); // Refresh the job list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      console.error('Failed to approve job:', error);
    }
  };

  // Reject a job
  const handleReject = async (jobId) => {
    const rejectReason = prompt('Enter the reason for rejection:');
    if (!rejectReason) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/jobs/suspend/${jobId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectReason }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        fetchJobs(); // Refresh the job list
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      console.error('Failed to reject job:', error);
    }
  };

  // Delete a job
  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/jobs/delete/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        fetchJobs(); // Refresh the job list
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      console.error('Failed to delete job:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter and search logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || job.approvalStatus === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto">
        <div className="flex space-x-4 mb-8 items-center">
          <Briefcase size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search jobs by title or description" 
              className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center space-x-2">
            <select 
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Jobs</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
            <FilterIcon className="text-gray-600" />
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left">Job Title</th>
                <th className="p-4 text-left hidden md:table-cell">Client</th>
                <th className="p-4 text-left hidden lg:table-cell">Budget</th>
                <th className="p-4 text-center">Approval Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-sm text-gray-500 hidden md:block">
                      {job.skillsRequired.join(", ")}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {job.clientId?.firstName} {job.clientId?.lastName}
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    ${job.budget.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        job.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {job.approvalStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {job.approvalStatus === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(job._id)}
                            className="text-green-600 hover:bg-green-100 p-2 rounded-full transition-colors"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            onClick={() => handleReject(job._id)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(job._id)}
                        className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No jobs found matching your search or filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobManagementPage;
