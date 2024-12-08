import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast, Slide } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const { userDetails } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/users/profile`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.data);
      } else {
        console.error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/users/update/${userData._id}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Profile updated successfully');
        toast.success(`Profile updated successfully`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        setIsEditing(false);
      } else {
        console.error(data.message || 'Failed to update profile');
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      console.error('Error updating profile', error);
    }
  };

  const handleChangePassword = async () => {
    // Validate password fields
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.error('New passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth/change-password`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Password changed successfully');
        toast.success(`Password changed successfully`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        setIsChangingPassword(false);
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        console.log(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error changing password', error);
      toast.error(`${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/users/delete/${userData._id}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Account deleted successfully');
        toast.success(`Password changed successfully`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
        // Add logout and redirect logic here
      } else {
        console.error(data.message || 'Failed to delete account');
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      console.error('Error deleting account');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-xl text-red-500">Failed to load user profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-8 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <img 
              src={userData.avatar || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="text-blue-600 font-semibold">{userData.role}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            >
              <Edit size={20} />
            </button>
            <button 
              onClick={() => setIsChangingPassword(true)}
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
            >
              <Lock size={20} />
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2 text-blue-500" /> Personal Information
            </h3>
            {isEditing ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={userData.firstName}
                  onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="First Name"
                />
                <input 
                  type="text" 
                  value={userData.lastName}
                  onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Last Name"
                />
                <input 
                  type="email" 
                  value={userData.email}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSaveProfile}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition flex items-center"
                  >
                    <Save className="mr-2" /> Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex items-center"
                  >
                    <X className="mr-2" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>First Name:</strong> {userData.firstName}</p>
                <p><strong>Last Name:</strong> {userData.lastName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
            <div className="space-y-2">
              <p><strong>Role:</strong> {userData.role}</p>
              {userData.profile && (
                <>
                  <p><strong>Bio:</strong> {userData.profile.bio || 'No bio available'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Lock className="mr-2 text-blue-500" /> Change Password
              </h3>
              <div className="space-y-4">
                <input 
                  type="password" 
                  placeholder="Old Password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input 
                  type="password" 
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input 
                  type="password" 
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={handleChangePassword}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition flex items-center"
                  >
                    <Save className="mr-2" /> Change Password
                  </button>
                  <button 
                    onClick={() => setIsChangingPassword(false)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex items-center"
                  >
                    <X className="mr-2" /> Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Section */}
        <div className="border-t pt-4 flex justify-between items-center">
          <div className="flex items-center text-red-600">
            <AlertTriangle className="mr-2" />
            <p className="font-semibold">Danger Zone: Delete Account</p>
          </div>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex items-center"
          >
            <Trash2 className="mr-2" /> Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md text-center">
              <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
              <p className="mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={handleDeleteAccount}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                >
                  Yes, Delete My Account
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;