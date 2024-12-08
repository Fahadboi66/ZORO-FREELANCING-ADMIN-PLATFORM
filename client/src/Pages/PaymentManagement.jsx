import React, { useState, useEffect } from "react";
import {
  DollarSign,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  TicketSlash
} from "lucide-react";
import { toast, Slide } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const PaymentStatusBadge = ({ status }) => {
  const statusColors = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-orange-200 text-orange-900",

  };

  const statusIcons = {
    completed: <CheckCircle2 className="w-4 h-4 mr-2" />,
    pending: <Clock className="w-4 h-4 mr-2" />,
    failed: <XCircle className="w-4 h-4 mr-2" />,
    refunded: <TicketSlash className="w-4 h-4 mr-2" />,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
    >
      {statusIcons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentsDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/payments`, {
            method: 'GET',
            credentials: 'include',
          }
        );


        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log(data);
        setPayments(data.data); // Assuming `data.data` contains the payments array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleRefund = async (paymentId) => {

    let confirmRefund = confirm("Are you sure you want to refund this payment?");

    if(!confirmRefund) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/payments/refund/${paymentId}`,
        {
          method: "POST",
          credentials: "include"
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to process refund: ${error.message}`);
      }
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === paymentId ? { ...payment, status: "refunded" } : payment
        )
      );
      toast.success(`Refund initiated for payment ${paymentId}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      
    } catch (err) {
      toast.error(`${err.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  const filteredPayments = payments.filter((payment) =>
    (selectedStatus ? payment.status === selectedStatus : true) &&
    (searchTerm
      ? payment.jobId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${payment.clientId.firstName} ${payment.clientId.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true)
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <DollarSign className="w-8 h-8 mr-3 text-[#0B1724]" />
            Payments Dashboard
          </h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search payments..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            <select
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
              <thead className="bg-blue-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Freelancer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.jobId.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{`${payment?.clientId?.firstName} ${payment?.clientId?.lastName}`}</div>
                      <div className="text-xs text-gray-400">
                        {payment.clientId?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{`${payment?.freelancerId?.firstName} ${payment?.freelancerId?.lastName}`}</div>
                      <div className="text-xs text-gray-400">
                        {payment?.freelancerId?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.status === "completed" && (
                        <button
                          onClick={() => handleRefund(payment._id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <RefreshCcw className="w-4 h-4 mr-2" /> Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsDashboard;
