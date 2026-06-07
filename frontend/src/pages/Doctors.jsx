import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '../store/slices/doctorSlice';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiStar, FiMapPin, FiDollarSign, FiX } from 'react-icons/fi';
import { CardSkeleton } from '../components/UI/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';

const specializations = [
  'All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
  'Dermatology', 'ENT', 'Ophthalmology', 'Dental', 'Gynecology',
  'Psychiatry', 'General Medicine'
];

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, isLoading, pagination } = useSelector((state) => state.doctors);
  
  const [filters, setFilters] = useState({
    specialization: '',
    search: '',
    minRating: '',
    minFee: '',
    maxFee: '',
    sort: 'rating',
    page: 1,
    limit: 9
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchDoctors = useCallback(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    dispatch(getDoctors(params));
  }, [filters, dispatch]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSearch = debounce((value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  }, 500);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      specialization: '',
      search: '',
      minRating: '',
      minFee: '',
      maxFee: '',
      sort: 'rating',
      page: 1,
      limit: 9
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          Find Your <span className="text-gradient">Doctor</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search from our network of verified medical professionals
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name or specialization..."
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center justify-center space-x-2 lg:hidden"
          >
            <FiFilter />
            <span>Filters</span>
          </button>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="input-field lg:w-48"
          >
            <option value="rating">Top Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="fee_low">Fee: Low to High</option>
            <option value="fee_high">Fee: High to Low</option>
          </select>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Specialization</label>
                    <select
                      value={filters.specialization}
                      onChange={(e) => handleFilterChange('specialization', e.target.value)}
                      className="input-field"
                    >
                      <option value="">All Specializations</option>
                      {specializations.slice(1).map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Rating</label>
                    <select
                      value={filters.minRating}
                      onChange={(e) => handleFilterChange('minRating', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ ⭐</option>
                      <option value="4">4.0+ ⭐</option>
                      <option value="3.5">3.5+ ⭐</option>
                      <option value="3">3.0+ ⭐</option>
                    </select>
                  </div>

                  {/* Fee Range */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Fee (₹)</label>
                    <input
                      type="number"
                      value={filters.minFee}
                      onChange={(e) => handleFilterChange('minFee', e.target.value)}
                      className="input-field"
                      placeholder="Min fee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Fee (₹)</label>
                    <input
                      type="number"
                      value={filters.maxFee}
                      onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                      className="input-field"
                      placeholder="Max fee"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button onClick={clearFilters} className="text-sm text-red-600 hover:underline">
                    Clear all filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters */}
      {Object.entries(filters).some(([key, value]) => value && key !== 'limit' && key !== 'page' && key !== 'sort') && (
        <div className="flex flex-wrap gap-2">
          {filters.specialization && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full text-sm">
              {filters.specialization}
              <button
                onClick={() => handleFilterChange('specialization', '')}
                className="ml-2"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.minRating && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full text-sm">
              {filters.minRating}+ ⭐
              <button
                onClick={() => handleFilterChange('minRating', '')}
                className="ml-2"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          {(filters.minFee || filters.maxFee) && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-full text-sm">
              ₹{filters.minFee || '0'} - ₹{filters.maxFee || '∞'}
              <button
                onClick={() => {
                  handleFilterChange('minFee', '');
                  handleFilterChange('maxFee', '');
                }}
                className="ml-2"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {pagination && `${pagination.total} doctors found`}
      </div>

      {/* Doctor Cards Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : doctors?.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/doctors/${doctor._id}`}>
                <div className="card group cursor-pointer h-full">
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={doctor.user?.avatar?.url || `https://ui-avatars.com/api/?name=${doctor.user?.name}&size=80&background=random`}
                      alt={doctor.user?.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                        {doctor.user?.name}
                      </h3>
                      <p className="text-blue-600 text-sm font-medium">
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center mt-1">
                        <FiStar className="text-yellow-400 fill-current w-4 h-4" />
                        <span className="text-sm font-semibold ml-1">
                          {doctor.averageRating?.toFixed(1)}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">
                          ({doctor.totalReviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  {doctor.user?.address?.city && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {doctor.user.address.city}
                    </div>
                  )}

                  <div className="border-t dark:border-gray-700 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gradient">
                          ₹{doctor.consultationFee}
                        </span>
                        <span className="text-sm text-gray-500">/visit</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {doctor.experience}+ yrs exp.
                      </span>
                    </div>
                    {doctor.nextAvailableSlot && (
                      <p className="text-xs text-green-600 mt-2">
                        Next available: {new Date(doctor.nextAvailableSlot.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button onClick={clearFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange('page', filters.page - 1)}
              disabled={filters.page === 1}
              className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handleFilterChange('page', i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  filters.page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handleFilterChange('page', filters.page + 1)}
              disabled={filters.page === pagination.pages}
              className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;