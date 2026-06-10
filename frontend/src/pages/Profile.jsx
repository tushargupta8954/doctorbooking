import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    gender: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.put('/api/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(updateUser(response.data.data));
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put('/api/users/profile', formData);
      dispatch(updateUser(response.data.data));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal information
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {/* Avatar Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img
              src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name}&size=150&background=random`}
              alt={user?.name}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-lg"
            />
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
              <FiCamera className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
          <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
          <p className="text-gray-500 capitalize">{user?.role}</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <FiUser className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <FiMail className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <FiPhone className="inline mr-2" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field"
              />
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <FiMapPin className="inline mr-2" />
              Address
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Street</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;