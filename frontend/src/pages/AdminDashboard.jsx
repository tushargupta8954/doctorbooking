import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiUserCheck, FiCalendar, FiDollarSign, 
  FiTrendingUp, FiActivity, FiPieChart 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Simulated admin stats - replace with actual API call
      setStats({
        totalUsers: 1250,
        totalDoctors: 85,
        totalAppointments: 5680,
        totalRevenue: 2850000,
        activeUsers: 890,
        pendingApprovals: 12
      });
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const revenueData = [
    { month: 'Jan', revenue: 450000 },
    { month: 'Feb', revenue: 520000 },
    { month: 'Mar', revenue: 480000 },
    { month: 'Apr', revenue: 580000 },
    { month: 'May', revenue: 650000 },
    { month: 'Jun', revenue: 620000 }
  ];

  const userGrowthData = [
    { month: 'Jan', patients: 800, doctors: 60 },
    { month: 'Feb', patients: 850, doctors: 65 },
    { month: 'Mar', patients: 920, doctors: 68 },
    { month: 'Apr', patients: 980, doctors: 72 },
    { month: 'May', patients: 1050, doctors: 78 },
    { month: 'Jun', patients: 1250, doctors: 85 }
  ];

  const specializationsData = [
    { name: 'Cardiology', value: 15, color: '#EF4444' },
    { name: 'Neurology', value: 12, color: '#8B5CF6' },
    { name: 'Orthopedics', value: 10, color: '#F59E0B' },
    { name: 'Pediatrics', value: 8, color: '#10B981' },
    { name: 'Dermatology', value: 10, color: '#3B82F6' },
    { name: 'Others', value: 30, color: '#6B7280' }
  ];

  const quickStats = [
    { icon: FiUsers, label: 'Total Users', value: stats?.totalUsers, color: 'blue', change: '+12%' },
    { icon: FiUserCheck, label: 'Total Doctors', value: stats?.totalDoctors, color: 'green', change: '+8%' },
    { icon: FiCalendar, label: 'Appointments', value: stats?.totalAppointments, color: 'purple', change: '+25%' },
    { icon: FiDollarSign, label: 'Revenue', value: `₹${(stats?.totalRevenue / 100000).toFixed(1)}L`, color: 'orange', change: '+18%' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            Admin <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Platform overview and analytics
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary text-sm">Export Report</button>
          <button className="btn-primary text-sm">Refresh Data</button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <FiTrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">User Growth</h2>
            <FiActivity className="w-5 h-5 text-purple-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="doctors" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <span className="text-sm">Patients</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
              <span className="text-sm">Doctors</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Specializations Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Doctors by Specialization</h2>
          <FiPieChart className="w-5 h-5 text-blue-600" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={specializationsData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {specializationsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {specializationsData.map((spec) => (
              <div key={spec.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: spec.color }} />
                  <span className="text-sm">{spec.name}</span>
                </div>
                <span className="text-sm font-semibold">{spec.value} doctors</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Manage Doctors', link: '/admin/doctors', color: 'blue' },
          { label: 'Manage Users', link: '/admin/users', color: 'green' },
          { label: 'View Appointments', link: '/admin/appointments', color: 'purple' },
          { label: 'Platform Settings', link: '/admin/settings', color: 'orange' }
        ].map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`bg-${action.color}-50 dark:bg-${action.color}-900/20 hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30 border border-${action.color}-200 dark:border-${action.color}-800 p-4 rounded-xl transition-all`}
          >
            <p className={`font-semibold text-${action.color}-800 dark:text-${action.color}-300`}>
              {action.label}
            </p>
            <p className={`text-sm text-${action.color}-600 dark:text-${action.color}-400 mt-1`}>
              →
            </p>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;