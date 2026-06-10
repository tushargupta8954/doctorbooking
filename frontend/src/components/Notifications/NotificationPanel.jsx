import React, { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiX, FiCalendar, FiFileText, FiDollarSign } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'appointment_reminder':
      case 'appointment_confirmed':
        return FiCalendar;
      case 'prescription_ready':
        return FiFileText;
      case 'payment_received':
        return FiDollarSign;
      default:
        return FiBell;
    }
  };

  const getColor = (type) => {
    if (type.includes('appointment')) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    if (type.includes('prescription')) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (type.includes('payment')) return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Notifications</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3 overflow-y-auto h-[calc(100vh-12rem)]">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        notification.isRead
                          ? 'bg-gray-50 dark:bg-gray-700/50'
                          : 'bg-blue-50 dark:bg-blue-900/10'
                      }`}
                      onClick={() => markAsRead(notification._id)}
                    >
                      <div className="flex space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColor(notification.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <FiBell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;