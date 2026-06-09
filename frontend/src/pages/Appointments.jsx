import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiCalendar, FiFilter, FiDownload, FiVideo, FiX, FiCheck, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ListSkeleton } from '../components/UI/Skeleton';
import toast from 'react-hot-toast';

const Appointments = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '', frequency: '', instructions: '' }],
    tests: [],
    notes: ''
  });

  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const endpoint = isDoctor ? '/api/appointments/doctor' : '/api/appointments/patient';
      const params = {};
      
      if (activeTab === 'upcoming') params.status = 'confirmed';
      else if (activeTab === 'completed') params.status = 'completed';
      else if (activeTab === 'cancelled') params.status = 'cancelled';
      
      const response = await axios.get(endpoint, { params });
      setAppointments(response.data.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, { status });
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddPrescription = async () => {
    try {
      await axios.post(`/api/appointments/${selectedAppointment._id}/prescription`, prescriptionData);
      toast.success('Prescription added successfully');
      setShowPrescriptionModal(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to add prescription');
    }
  };

  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', dosage: '', duration: '', frequency: '', instructions: '' }]
    });
  };

  const updateMedicine = (index, field, value) => {
    const updatedMedicines = [...prescriptionData.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medicines: updatedMedicines });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'no-show': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    };
    return colors[status] || colors.pending;
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', icon: FiCalendar },
    { id: 'completed', label: 'Completed', icon: FiCheck },
    { id: 'cancelled', label: 'Cancelled', icon: FiX },
    { id: 'all', label: 'All', icon: FiFilter }
  ];

  if (isLoading) {
    return <ListSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          {isDoctor ? 'My Appointments' : 'My Appointments'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track all your appointments
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Appointments List */}
      <AnimatePresence>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="card"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      {appointment.type === 'video' ? (
                        <FiVideo className="w-6 h-6 text-blue-600" />
                      ) : (
                        <FiCalendar className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {isDoctor ? appointment.patient?.name : `Dr. ${appointment.doctor?.user?.name}`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isDoctor ? appointment.patient?.email : appointment.doctor?.specialization}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          <FiCalendar className="inline mr-1 w-3 h-3" />
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          <FiClock className="inline mr-1 w-3 h-3" />
                          {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    
                    {appointment.type === 'video' && appointment.status === 'confirmed' && (
                      <Link
                        to={appointment.meetingLink || '#'}
                        className="btn-primary text-sm flex items-center"
                      >
                        <FiVideo className="mr-1" />
                        Join
                      </Link>
                    )}

                    {/* Doctor Actions */}
                    {isDoctor && appointment.status === 'confirmed' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'in-progress')}
                          className="btn-secondary text-sm"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowPrescriptionModal(true);
                          }}
                          className="btn-primary text-sm"
                        >
                          Prescription
                        </button>
                      </div>
                    )}

                    {/* Patient Actions */}
                    {isPatient && appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Prescription Download */}
                    {appointment.prescription?.issuedAt && (
                      <button
                        onClick={() => {/* Download logic */}}
                        className="btn-secondary text-sm flex items-center"
                      >
                        <FiDownload className="mr-1" />
                        Rx
                      </button>
                    )}
                  </div>
                </div>

                {/* Prescription Details (if exists) */}
                {appointment.prescription?.issuedAt && (
                  <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <h4 className="font-semibold mb-2">Prescription</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Diagnosis:</strong> {appointment.prescription.diagnosis}
                    </p>
                    {appointment.prescription.medicines?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Medicines:</p>
                        <div className="space-y-1">
                          {appointment.prescription.medicines.map((med, idx) => (
                            <p key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                              • {med.name} - {med.dosage}, {med.frequency} for {med.duration}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No appointments found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming appointments" 
                : `No ${activeTab} appointments`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prescription Modal */}
      <AnimatePresence>
        {showPrescriptionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Write Prescription</h2>
                  <button
                    onClick={() => setShowPrescriptionModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Diagnosis</label>
                    <input
                      type="text"
                      value={prescriptionData.diagnosis}
                      onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
                      className="input-field"
                      placeholder="Enter diagnosis"
                    />
                  </div>

                  {/* Medicines */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Medicines</label>
                    {prescriptionData.medicines.map((medicine, index) => (
                      <div key={index} className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <input
                          type="text"
                          placeholder="Name"
                          value={medicine.name}
                          onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                          className="input-field text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Dosage"
                          value={medicine.dosage}
                          onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                          className="input-field text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Duration"
                          value={medicine.duration}
                          onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                          className="input-field text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Frequency"
                          value={medicine.frequency}
                          onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                          className="input-field text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Instructions"
                          value={medicine.instructions}
                          onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                          className="input-field text-sm"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addMedicine}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      + Add Medicine
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea
                      value={prescriptionData.notes}
                      onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
                      className="input-field"
                      rows="3"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowPrescriptionModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPrescription}
                    className="btn-primary"
                  >
                    Save Prescription
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appointments;