import React, { useState, useEffect } from 'react';
import { FiSearch, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/doctors/patients');
      setPatients(response.data.data);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">My Patients</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage your patient records
        </p>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : patients.length > 0 ? (
        <div className="space-y-4">
          {patients.map((patient, index) => (
            <motion.div
              key={patient._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={patient.avatar?.url || `https://ui-avatars.com/api/?name=${patient.name}&size=48`}
                  alt={patient.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                </div>
              </div>
              <button className="btn-secondary text-sm">View Records</button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No patients found</p>
        </div>
      )}
    </div>
  );
};

export default PatientList;