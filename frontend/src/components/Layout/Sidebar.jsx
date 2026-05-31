import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiGrid, FiCalendar, FiUsers, FiUser, FiSettings,
  FiActivity, FiDollarSign, FiMessageSquare, FiFileText,
  FiTrendingUp, FiClipboard, FiStar
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const patientLinks = [
    { to: '/patient/dashboard', icon: FiGrid, label: 'Dashboard' },
    { to: '/patient/appointments', icon: FiCalendar, label: 'Appointments' },
    { to: '/doctors', icon: FiUsers, label: 'Find Doctors' },
    { to: '/symptom-checker', icon: FiActivity, label: 'AI Checker' },
    { to: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: FiGrid, label: 'Dashboard' },
    { to: '/doctor/appointments', icon: FiCalendar, label: 'Appointments' },
    { to: '/doctor/patients', icon: FiUsers, label: 'Patients' },
    { to: '/doctor/earnings', icon: FiDollarSign, label: 'Earnings' },
    { to: '/profile', icon: FiSettings, label: 'Settings' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: FiTrendingUp, label: 'Dashboard' },
    { to: '/admin/doctors', icon: FiUsers, label: 'Doctors' },
    { to: '/admin/users', icon: FiUser, label: 'Users' },
    { to: '/admin/appointments', icon: FiCalendar, label: 'Appointments' },
    { to: '/admin/analytics', icon: FiActivity, label: 'Analytics' },
    { to: '/profile', icon: FiSettings, label: 'Settings' },
  ];

  const links = user?.role === 'patient' ? patientLinks :
                user?.role === 'doctor' ? doctorLinks : adminLinks;

  if (!user) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 
        shadow-xl z-40 transition-all duration-300 overflow-y-auto
        ${sidebarOpen ? 'w-64' : 'w-0 lg:w-64'}
        ${!sidebarOpen && 'lg:translate-x-0 -translate-x-full'}`}>
        
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center mb-3">
              <span className="text-white text-2xl font-bold">
                {user.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {user.role}
            </p>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;