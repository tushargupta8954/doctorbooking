import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '../store/slices/doctorSlice';
import { FiSearch, FiCalendar, FiVideo, FiShield, FiStar, FiArrowRight, FiActivity, FiClock, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
  const dispatch = useDispatch();
  const { doctors, isLoading } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(getDoctors({ limit: 6, sort: 'rating' }));
  }, [dispatch]);

  const features = [
    {
      icon: FiSearch,
      title: 'Find Best Doctors',
      description: 'Search from thousands of verified doctors based on specialization, location, and ratings.',
      color: 'blue'
    },
    {
      icon: FiCalendar,
      title: 'Easy Booking',
      description: 'Book appointments instantly with real-time availability and instant confirmation.',
      color: 'green'
    },
    {
      icon: FiVideo,
      title: 'Video Consultations',
      description: 'Connect with doctors remotely through secure video consultations from anywhere.',
      color: 'purple'
    },
    {
      icon: FiShield,
      title: 'Secure & Private',
      description: 'Your medical data is encrypted and protected with industry-standard security.',
      color: 'red'
    }
  ];

  const stats = [
    { icon: FiUsers, value: '500+', label: 'Verified Doctors' },
    { icon: FiActivity, value: '50K+', label: 'Successful Treatments' },
    { icon: FiStar, value: '4.8', label: 'Average Rating' },
    { icon: FiClock, value: '24/7', label: 'Support Available' }
  ];

  const specializations = [
    { name: 'Cardiology', icon: '❤️', color: 'from-red-500 to-pink-500' },
    { name: 'Neurology', icon: '🧠', color: 'from-purple-500 to-indigo-500' },
    { name: 'Orthopedics', icon: '🦴', color: 'from-yellow-500 to-orange-500' },
    { name: 'Pediatrics', icon: '👶', color: 'from-green-500 to-teal-500' },
    { name: 'Dermatology', icon: '🔬', color: 'from-blue-500 to-cyan-500' },
    { name: 'Dental', icon: '🦷', color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Health,
                <span className="text-gradient"> Our Priority</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Book appointments with the best doctors, get AI-powered health insights, 
                and manage your medical records all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/doctors" className="btn-primary text-center">
                  Find Doctors
                  <FiArrowRight className="inline ml-2" />
                </Link>
                <Link to="/symptom-checker" className="btn-outline text-center">
                  AI Symptom Checker
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg"
                  alt="Healthcare"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute top-10 -left-10 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <FiVideo className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Video Consult</p>
                    <p className="text-xs text-gray-500">Available 24/7</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-10 -right-5 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-float animation-delay-2000">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className="text-yellow-400 fill-current w-4 h-4" />
                  ))}
                  <span className="text-sm font-semibold ml-2">4.8/5</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">From 10,000+ reviews</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Why Choose <span className="text-gradient">MediCare?</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We provide a comprehensive healthcare platform that connects patients with 
            the best doctors using cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card group cursor-pointer"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Specializations Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Find by <span className="text-gradient">Specialization</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose from a wide range of medical specialties
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {specializations.map((spec, index) => (
            <Link
              key={index}
              to={`/doctors?specialization=${spec.name}`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${spec.color} p-6 rounded-xl text-white text-center cursor-pointer shadow-lg hover:shadow-xl transition-all`}
              >
                <span className="text-3xl block mb-2">{spec.icon}</span>
                <span className="font-semibold text-sm">{spec.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
              Top <span className="text-gradient">Doctors</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Highly rated doctors ready to help you
            </p>
          </motion.div>
          <Link
            to="/doctors"
            className="btn-outline hidden sm:flex items-center"
          >
            View All <FiArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>
              </div>
            ))
          ) : (
            doctors?.slice(0, 6).map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card group"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={doctor.user?.avatar?.url || `https://ui-avatars.com/api/?name=${doctor.user?.name}&size=64&background=random`}
                    alt={doctor.user?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                      {doctor.user?.name}
                    </h3>
                    <p className="text-blue-600 text-sm font-medium">{doctor.specialization}</p>
                    <div className="flex items-center mt-2">
                      <FiStar className="text-yellow-400 fill-current w-4 h-4" />
                      <span className="text-sm ml-1">{doctor.averageRating?.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm ml-1">({doctor.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{doctor.consultationFee}
                      </span>
                      /consultation
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {doctor.experience}+ years exp.
                    </div>
                  </div>
                  <Link
                    to={`/doctors/${doctor._id}`}
                    className="btn-primary w-full mt-4 text-center block text-sm"
                  >
                    Book Appointment
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link to="/doctors" className="btn-primary">
            View All Doctors
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-gradient-primary rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust MediCare for their healthcare needs. 
              Get started today with a free health checkup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
              >
                Create Free Account
              </Link>
              <Link
                to="/symptom-checker"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Check Symptoms
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;