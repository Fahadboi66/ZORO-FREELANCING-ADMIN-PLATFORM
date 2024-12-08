import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  EyeOff, 
  Info 
} from 'lucide-react';

const DisputeManagement = () => {
  const [disputes, setDisputes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_APP_API_URL;

  // Fetch disputes from the server
  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/disputes/all`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch disputes');
        const data = await response.json();
        console.log(data);
        setDisputes(data.data);
      } catch (error) {
        console.error('Error fetching disputes:', error);
      }
    };

    fetchDisputes();
  }, [API_URL]);

  // Update dispute status on the server
  const updateDisputeStatus = async (status) => {
    if (!selectedDispute) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/disputes/${selectedDispute._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update dispute status');
      const updatedDispute = await response.json();
      console.log("Update dispute:", updatedDispute);
      setDisputes((prevDisputes) =>
        prevDisputes.map((dispute) => 
          dispute._id === updatedDispute._id ? updatedDispute : dispute
        )
      );
      setIsDetailModalOpen(false);
      setSelectedDispute(null);
      
    } catch (error) {
      console.error('Error updating dispute status:', error);
    }
  };

  // Dispute status color and icon mapping
  const statusStyles = {
    open: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="text-red-600 mr-2" size={20} /> },
    'in-review': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="text-yellow-600 mr-2" size={20} /> },
    resolved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="text-green-600 mr-2" size={20} /> },
  };

  // Filtered disputes based on search and status
  const filteredDisputes = disputes.filter(
    (dispute) =>
      (dispute.jobId?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.reason.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedStatus === '' || dispute.status === selectedStatus)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <AlertTriangle className="text-red-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Dispute Management</h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search disputes by job title or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-review">In Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Disputes Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDisputes.map((dispute) => (
                <tr key={dispute._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{dispute.jobId?.title}</div>
                        <div className="text-sm text-gray-500">
                          Client: {dispute.raisedBy?.firstName} {dispute.raisedBy?.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={dispute.raisedBy?.profile?.avatar}
                        alt={`${dispute.raisedBy?.firstName} ${dispute.raisedBy?.lastName}`}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {dispute.raisedBy?.firstName} {dispute.raisedBy?.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{dispute.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center ${statusStyles[dispute.status]?.color}`}>
                      {statusStyles[dispute.status]?.icon}
                      {dispute.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-gray-600 hover:text-red-600 transition"
                      title="View Dispute Details"
                    >
                      <Info size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No Disputes Found */}
          {filteredDisputes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="mx-auto mb-4 text-gray-300" size={48} />
              <p>No disputes found.</p>
            </div>
          )}
        </div>

        {/* Dispute Details Modal */}
        {isDetailModalOpen && selectedDispute && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-[500px] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dispute Details</h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <EyeOff size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700">Job Title</h3>
                  <p className="text-gray-600">{selectedDispute.jobId?.title}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700">Raised By</h3>
                  <p className="text-gray-600">
                    {selectedDispute.raisedBy?.firstName} {selectedDispute.raisedBy?.lastName}
                  </p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700">Reason</h3>
                  <p className="text-gray-600">{selectedDispute.reason}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700">Status</h3>
                  <p className="text-gray-600">{selectedDispute.status}</p>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                {selectedDispute.status === 'open' && (
                  <button
                    onClick={() => updateDisputeStatus('in-review')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Mark as In-Review
                  </button>
                )}
                {selectedDispute.status === 'in-review' && (
                  <button
                    onClick={() => updateDisputeStatus('resolved')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Mark as Resolved
                  </button>
                )}
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeManagement;
