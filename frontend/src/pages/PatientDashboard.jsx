import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiCalendar, FiClock, FiActivity, FiFileText, FiStar, FiTrendingUp, FiPlus, FiVideo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ListSkeleton } from '../components/UI/Skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, prescriptionsRes] = await Promise.all([
        axios.get('/api/appointments/patient', { params: { status: 'confirmed', limit: 5 } }),
        axios.get('/api/appointments/patient', { params: { status: 'completed', limit: 5 } })
      ]);

      setUpcomingAppointments(appointmentsRes.data.data);
      setRecentPrescriptions(prescriptionsRes.data.data);

      // Calculate stats
      const allAppointments = appointmentsRes.data.data;
      setStats({
        totalAppointments: allAppointments.length,
        upcomingAppointments: allAppointments.filter(a => a.status === 'confirmed').length,
        completedAppointments: allAppointments.filter(a => a.status === 'completed').length,
        totalSpent: allAppointments.reduce((sum, a) => sum + (a.payment?.amount || 0), 0)
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const healthMetrics = [
    { month: 'Jan', appointments: 2 },
    { month: 'Feb', appointments: 3 },
    { month: 'Mar', appointments: 1 },
    { month: 'Apr', appointments: 4 },
    { month: 'May', appointments: 2 },
    { month: 'Jun', appointments: 5 }
  ];

  const quickActions = [
    { icon: FiPlus, label: 'Book Appointment', link: '/doctors', color: 'bg-blue-500' },
    { icon: FiActivity, label: 'AI Checker', link: '/symptom-checker', color: 'bg-purple-500' },
    { icon: FiVideo, label: 'Video Consult', link: '/doctors?type=video', color: 'bg-green-500' },
    { icon: FiFileText, label: 'Prescriptions', link: '/patient/appointments?status=completed', color: 'bg-orange-500' }
  ];

  if (isLoading) {
    return <ListSkeleton rows={5} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold">
          Welcome back, <span className="text-gradient">{user?.name}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's your health overview
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FiCalendar, label: 'Upcoming Appointments', value: stats?.upcomingAppointments || 0, color: 'blue' },
          { icon: FiClock, label: 'Completed Visits', value: stats?.completedAppointments || 0, color: 'green' },
          { icon: FiActivity, label: 'Health Score', value: '85%', color: 'purple' },
          { icon: FiTrendingUp, label: 'Total Spent', value: `₹${stats?.totalSpent || 0}`, color: 'orange' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.link}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`${action.color} text-white p-4 rounded-xl cursor-pointer`}
                >
                  <Icon className="w-8 h-8 mb-2" />
                  <p className="font-medium">{action.label}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Health Metrics Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-6">Health Visit Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={healthMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <Link to="/patient/appointments" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      Dr. {appointment.doctor?.user?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.doctor?.specialization}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {' '}•{' '}
                      {appointment.timeSlot?.startTime}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiCalendar className="w-12 h-12 mx-auto mb-2" />
              <p>No upcoming appointments</p>
              <Link to="/doctors" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Book an appointment
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Prescriptions */}
      {recentPrescriptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Prescriptions</h2>
            <Link to="/patient/appointments?status=completed" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentPrescriptions.slice(0, 3).map((prescription) => (
              <div
                key={prescription._id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div>
                  <p className="font-semibold">Dr. {prescription.doctor?.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(prescription.appointmentDate).toLocaleDateString()}
                  </p>
                  {prescription.prescription?.diagnosis && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Diagnosis: {prescription.prescription.diagnosis}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => window.open(`/api/appointments/${prescription._id}/prescription/download`, '_blank')}
                  className="btn-secondary flex items-center text-sm"
                >
                  <FiFileText className="mr-2" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PatientDashboard;