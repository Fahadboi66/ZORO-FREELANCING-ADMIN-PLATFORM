import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Edit, 
  Trash2, 
  Search, 
  Plus, 
  Lock, 
  Unlock,
  X, 
} from 'lucide-react';
import { toast, Slide } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
// Server URL
const API_URL = import.meta.env.VITE_APP_API_URL;

// User Modal Component
const UserModal = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password:'',
    role: 'freelancer',
  });

  // Populate form when editing existing user
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        role: currentUser.role || 'freelancer',
      });
    } else {
      // Reset form when adding new user
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'freelancer',
      });
    }
  }, [currentUser, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
    };
    onSubmit(userData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">
          {currentUser ? 'Edit User' : 'Add New User'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          { !currentUser && <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>}
          {!currentUser  && <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0B1724] text-white rounded-md hover:bg-blue-900"
            >
              {currentUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/all`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.data);
      } else {
        console.error('Failed to fetch users', data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Create user
  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/create`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        fetchUsers(); // Reload users
        setModalOpen(false);
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
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
      console.error('Error creating user:', error);
    }
  };

  // Update user
  const handleUpdateUser = async (userData) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/users/update/${currentUser._id}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        fetchUsers(); // Reload users
        setModalOpen(false);
        setCurrentUser(null);
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
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
      console.error('Error updating user:', error);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/users/delete/${userId}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        fetchUsers(); // Reload users
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
      console.error('Error deleting user:', error);
    }
  };

  // Update user status (lock/unlock)
  const handleUpdateUserStatus = async (user) => {
    // Determine the new status based on current status
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    
    // Confirm user action
    const confirmMessage = newStatus === 'suspended' 
      ? 'Are you sure you want to suspend this user?' 
      : 'Are you sure you want to unlock this user?';
    
    const confirmed = window.confirm(confirmMessage);
    
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/users/change-status/${user._id}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        // Update local state to reflect the status change
        fetchUsers();
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
      console.error('Error updating user status:', error);
    }
  };

  // Handle modal open for adding new user
  const handleAddUserClick = () => {
    setCurrentUser(null);
    setModalOpen(true);
  };

  // Handle modal open for editing an existing user
  const handleEditUserClick = (user) => {
    setCurrentUser(user);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtering users based on search and selected role
  const filteredUsers = users.filter(user =>
    (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedRole === '' || user.role === selectedRole)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Users className="text-[#0B1724]" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          </div>
          <button
            className="bg-[#0B1724] text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-900 transition"
            onClick={handleAddUserClick}
          >
            <Plus className="mr-2" /> Add User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td className="p-4">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-semibold 
                      ${user.status === 'suspended' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                      }
                    `}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="p-4 flex items-center space-x-2">
                    <button
                      onClick={() => handleEditUserClick(user)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit User"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete User"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      onClick={() => handleUpdateUserStatus(user)}
                      className={`
                        ${user.status === 'suspended' 
                          ? 'text-green-500 hover:text-green-700' 
                          : 'text-red-500 hover:text-red-700'
                        }
                      `}
                      title={user.status === 'suspended' ? 'Unlock User' : 'Suspend User'}
                    >
                      {user.status === 'suspended' ? <Unlock size={20} /> : <Lock size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={currentUser ? handleUpdateUser : handleCreateUser}
        currentUser={currentUser}
      />
    </div>
  );
};

export default UserManagement;
