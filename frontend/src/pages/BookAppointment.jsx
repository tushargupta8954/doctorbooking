import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctor } from '../store/slices/doctorSlice';
import { FiCalendar, FiClock, FiVideo, FiUser, FiDollarSign, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctor, isLoading } = useSelector((state) => state.doctors);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [symptoms, setSymptoms] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    dispatch(getDoctor(doctorId));
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (doctor?.availableSlots) {
      setAvailableSlots(doctor.availableSlots);
    }
  }, [doctor]);

  const getUniqueDates = () => {
    const dates = [...new Set(availableSlots.map(slot => slot.date))];
    return dates.slice(0, 7); // Next 7 days
  };

  const getSlotsForDate = (date) => {
    return availableSlots.filter(slot => slot.date === date);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select date and time slot');
      return;
    }

    setIsBooking(true);
    try {
      const appointmentData = {
        doctorId,
        appointmentDate: selectedDate,
        timeSlot: {
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime
        },
        type: appointmentType,
        symptoms: symptoms.split(',').map(s => s.trim()).filter(Boolean)
      };

      const response = await axios.post('/api/appointments', appointmentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/patient/appointments');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading || !doctor) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Book Appointment</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select your preferred date and time
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Doctor Info Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card sticky top-24"
          >
            <div className="text-center mb-4">
              <img
                src={doctor.user?.avatar?.url || `https://ui-avatars.com/api/?name=${doctor.user?.name}&size=100&background=random`}
                alt={doctor.user?.name}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
              />
              <h2 className="text-lg font-semibold">{doctor.user?.name}</h2>
              <p className="text-blue-600 font-medium">{doctor.specialization}</p>
            </div>

            <div className="space-y-3 pt-4 border-t dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Experience</span>
                <span className="font-medium">{doctor.experience}+ years</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Rating</span>
                <span className="font-medium">⭐ {doctor.averageRating?.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Patients</span>
                <span className="font-medium">{doctor.totalPatients}+</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-gradient">
                  ₹{appointmentType === 'video' ? doctor.videoConsultationFee : doctor.consultationFee}
                </p>
                <p className="text-sm text-gray-500">per consultation</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold mb-4">Consultation Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setAppointmentType('in-person')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  appointmentType === 'in-person'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
              >
                <FiUser className={`w-8 h-8 mx-auto mb-2 ${
                  appointmentType === 'in-person' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className="font-medium">In-Person Visit</span>
                <p className="text-sm text-gray-500 mt-1">Visit the clinic</p>
              </button>

              <button
                onClick={() => setAppointmentType('video')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  appointmentType === 'video'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
              >
                <FiVideo className={`w-8 h-8 mx-auto mb-2 ${
                  appointmentType === 'video' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className="font-medium">Video Consultation</span>
                <p className="text-sm text-gray-500 mt-1">Connect online</p>
              </button>
            </div>
          </motion.div>

          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold mb-4">
              <FiCalendar className="inline mr-2" />
              Select Date
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {getUniqueDates().map((date) => {
                const dateObj = new Date(date);
                const today = new Date();
                const isToday = dateObj.toDateString() === today.toDateString();
                
                return (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      selectedDate === date
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    <p className="text-xs font-medium">
                      {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-bold">{dateObj.getDate()}</p>
                    <p className="text-xs">
                      {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    {isToday && <p className="text-xs font-semibold">Today</p>}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Time Slots */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold mb-4">
                <FiClock className="inline mr-2" />
                Available Time Slots
              </h3>
              {getSlotsForDate(selectedDate).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {getSlotsForDate(selectedDate).map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedSlot?.startTime === slot.startTime
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                      }`}
                    >
                      <p className="font-semibold">{slot.startTime} - {slot.endTime}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {slot.available} slots available
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiAlertCircle className="w-12 h-12 mx-auto mb-2" />
                  <p>No slots available for this date</p>
                  <p className="text-sm">Please select another date</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Symptoms */}
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold mb-4">Reason for Visit</h3>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="input-field"
                rows="3"
                placeholder="Describe your symptoms or reason for consultation (e.g., headache, fever, back pain)"
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate multiple symptoms with commas
              </p>
            </motion.div>
          )}

          {/* Booking Summary & Payment */}
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Doctor</span>
                  <span className="font-medium">{doctor.user?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize">{appointmentType}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t dark:border-gray-700">
                  <span>Total Amount</span>
                  <span className="text-gradient">
                    ₹{appointmentType === 'video' ? doctor.videoConsultationFee : doctor.consultationFee}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={isBooking}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isBooking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiDollarSign className="w-5 h-5" />
                    <span>Proceed to Pay</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center mt-4 space-x-2">
                <FiCheck className="w-4 h-4 text-green-500" />
                <p className="text-xs text-gray-500">Secure payment powered by Razorpay</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;