import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiCalendar, FiDollarSign, FiStar, FiClock, 
  FiTrendingUp, FiActivity, FiAlertCircle, FiCheckCircle,
  FiArrowUp, FiArrowDown
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ListSkeleton } from '../components/UI/Skeleton';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [prioritizedAppointments, setPrioritizedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchPrioritizedAppointments();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/doctors/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrioritizedAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/doctor/prioritized');
      setPrioritizedAppointments(response.data.data);
    } catch (error) {
      console.error('Failed to load prioritized appointments');
    }
  };

  const earningsData = [
    { month: 'Jan', earnings: 25000 },
    { month: 'Feb', earnings: 32000 },
    { month: 'Mar', earnings: 28000 },
    { month: 'Apr', earnings: 35000 },
    { month: 'May', earnings: 42000 },
    { month: 'Jun', earnings: 38000 }
  ];

  const appointmentStatusData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'Pending', value: 20, color: '#F59E0B' },
    { name: 'Cancelled', value: 10, color: '#EF4444' },
    { name: 'In Progress', value: 15, color: '#3B82F6' }
  ];

  const stats = [
    {
      icon: FiUsers,
      label: 'Total Patients',
      value: dashboardData?.totalPatients || 0,
      change: '+12%',
      trend: 'up',
      color: 'blue'
    },
    {
      icon: FiCalendar,
      label: "Today's Appointments",
      value: dashboardData?.todayAppointments?.length || 0,
      change: '+5%',
      trend: 'up',
      color: 'green'
    },
    {
      icon: FiDollarSign,
      label: 'Monthly Earnings',
      value: `₹${(dashboardData?.monthlyEarnings || 0).toLocaleString()}`,
      change: '+18%',
      trend: 'up',
      color: 'purple'
    },
    {
      icon: FiStar,
      label: 'Average Rating',
      value: dashboardData?.averageRating?.toFixed(1) || '0.0',
      change: '+0.2',
      trend: 'up',
      color: 'yellow'
    }
  ];

  if (isLoading) {
    return <ListSkeleton rows={5} />;
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
            Welcome, Dr. <span className="text-gradient">{user?.name}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your practice overview for today
          </p>
        </div>
        <Link to="/doctor/appointments" className="btn-primary hidden sm:flex items-center">
          <FiCalendar className="mr-2" />
          Manage Appointments
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
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
                <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <span className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-6">Earnings Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="earnings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Appointment Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-6">Appointment Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={appointmentStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {appointmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {appointmentStatusData.map((status, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{status.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Prioritized Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">AI Prioritized Appointments</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Appointments sorted by urgency and priority
            </p>
          </div>
          <FiActivity className="w-6 h-6 text-purple-600" />
        </div>

        {prioritizedAppointments.length > 0 ? (
          <div className="space-y-3">
            {prioritizedAppointments.slice(0, 5).map((appointment, index) => (
              <div
                key={appointment._id}
                className={`flex items-center space-x-4 p-4 rounded-lg ${
                  appointment.priority === 'emergency'
                    ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                    : appointment.priority === 'urgent'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{appointment.patient?.name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.priority === 'emergency'
                        ? 'bg-red-100 text-red-800'
                        : appointment.priority === 'urgent'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(appointment.appointmentDate).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                    {appointment.symptoms?.length > 0 && ` • ${appointment.symptoms.join(', ')}`}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(appointment.priorityScore / 100) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      Priority Score: {appointment.priorityScore}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/doctor/appointments/${appointment._id}`}
                  className="btn-secondary text-sm"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FiCalendar className="w-12 h-12 mx-auto mb-2" />
            <p>No appointments for today</p>
          </div>
        )}
      </motion.div>

      {/* Today's Schedule */}
      {dashboardData?.todayAppointments?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-6">Today's Schedule</h2>
          <div className="space-y-4">
            {dashboardData.todayAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <p className="text-lg font-bold">{appointment.timeSlot?.startTime}</p>
                    <p className="text-xs text-gray-500">{appointment.timeSlot?.endTime}</p>
                  </div>
                  <div className="w-px h-10 bg-gray-300 dark:bg-gray-600" />
                  <div>
                    <p className="font-semibold">{appointment.patient?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                  {appointment.type === 'video' && (
                    <Link
                      to={appointment.meetingLink || '#'}
                      className="btn-primary text-sm"
                    >
                      Join Call
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorDashboard;