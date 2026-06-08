import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctor } from '../store/slices/doctorSlice';
import { FiStar, FiMapPin, FiDollarSign, FiCalendar, FiAward, FiBookOpen, FiUsers, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ProfileSkeleton } from '../components/UI/Skeleton';

const DoctorDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { doctor, isLoading } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(getDoctor(id));
  }, [dispatch, id]);

  if (isLoading || !doctor) {
    return <ProfileSkeleton />;
  }

  const doctorData = doctor.doctor || doctor;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Doctor Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <img
            src={doctorData.user?.avatar?.url || `https://ui-avatars.com/api/?name=${doctorData.user?.name}&size=150&background=random`}
            alt={doctorData.user?.name}
            className="w-32 h-32 rounded-2xl object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold">{doctorData.user?.name}</h1>
            <p className="text-blue-600 text-lg font-medium">{doctorData.specialization}</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center">
                <FiStar className="text-yellow-400 fill-current w-5 h-5" />
                <span className="font-semibold ml-1">{doctorData.averageRating?.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">({doctorData.totalReviews} reviews)</span>
              </div>
              {doctorData.user?.address?.city && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {doctorData.user.address.city}
                </div>
              )}
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FiUsers className="w-4 h-4 mr-1" />
                {doctorData.totalPatients}+ patients
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div>
                <span className="text-2xl font-bold text-gradient">₹{doctorData.consultationFee}</span>
                <span className="text-gray-500 text-sm">/consultation</span>
              </div>
              <Link
                to={`/book-appointment/${doctorData._id}`}
                className="btn-primary flex items-center"
              >
                <FiCalendar className="mr-2" />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {doctorData.bio || `${doctorData.user?.name} is an experienced ${doctorData.specialization} with ${doctorData.experience}+ years of practice. Dedicated to providing quality healthcare services.`}
            </p>
          </motion.div>

          {/* Education */}
          {doctorData.education?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4">
                <FiBookOpen className="inline mr-2" />
                Education
              </h2>
              <div className="space-y-4">
                {doctorData.education.map((edu, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    <div>
                      <p className="font-semibold">{edu.degree}</p>
                      <p className="text-sm text-gray-500">{edu.institution} - {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Awards */}
          {doctorData.awards?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4">
                <FiAward className="inline mr-2" />
                Awards & Recognition
              </h2>
              <div className="space-y-2">
                {doctorData.awards.map((award, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-yellow-500">🏆</span>
                    <span>{award}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reviews */}
          {doctor.reviews?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4">
                <FiMessageSquare className="inline mr-2" />
                Patient Reviews ({doctor.reviews.length})
              </h2>
              <div className="space-y-4">
                {doctor.reviews.map((review, index) => (
                  <div key={index} className="border-b dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <img
                        src={review.patient?.avatar?.url || `https://ui-avatars.com/api/?name=${review.patient?.name}&size=40`}
                        alt={review.patient?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{review.patient?.name}</h4>
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        {review.title && (
                          <p className="font-medium mt-1">{review.title}</p>
                        )}
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold mb-4">Practice Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Experience</span>
                <span className="font-medium">{doctorData.experience}+ years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Languages</span>
                <span className="font-medium">
                  {doctorData.languages?.join(', ') || 'English, Hindi'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">License</span>
                <span className="font-medium">{doctorData.licenseNumber}</span>
              </div>
              {doctorData.user?.address && (
                <div>
                  <span className="text-gray-500 block mb-1">Address</span>
                  <p className="text-sm">
                    {doctorData.user.address.street}, {doctorData.user.address.city}, 
                    {doctorData.user.address.state} - {doctorData.user.address.zipCode}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Working Hours */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold mb-4">Available Days</h3>
            <div className="space-y-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div
                  key={day}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    doctorData.availableDays?.includes(day)
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-gray-50 dark:bg-gray-700/50 opacity-50'
                  }`}
                >
                  <span className="capitalize">{day}</span>
                  <span className={`text-sm font-medium ${
                    doctorData.availableDays?.includes(day)
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}>
                    {doctorData.availableDays?.includes(day) ? 'Available' : 'Not Available'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to={`/book-appointment/${doctorData._id}`}
              className="btn-primary w-full flex items-center justify-center"
            >
              <FiCalendar className="mr-2" />
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;