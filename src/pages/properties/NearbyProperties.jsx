import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NearbyProperties = ({ property }) => {
  const navigate = useNavigate();

  // Fetch nearby properties
  const { data: nearbyProperties, isLoading, error } = useQuery({
    queryKey: ['nearbyProperties', property._id],
    queryFn: async () => {
      const response = await api.get('/api/properties/nearby', {
        params: {
          lat: property.location.coordinates.latitude,
          lng: property.location.coordinates.longitude,
          maxDistance: 10000, // 10km in meters
          limit: 6,
        },
      });
      // Filter out the current property from nearby results
      return response.data.filter((prop) => prop._id !== property._id);
    },
    enabled: !!property?.location?.coordinates?.latitude && !!property?.location?.coordinates?.longitude,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Properties</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="animate-spin h-5 w-5 text-[#E83A17]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Loading nearby properties...
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Properties</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Error Loading Nearby Properties</h3>
            <p className="text-gray-600 mb-6">{error.response?.data?.message || 'Failed to load nearby properties. Please try again later.'}</p>
            <motion.button
              onClick={() => navigate(0)} // Refresh the page to retry
              className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Handle no nearby properties
  if (!nearbyProperties || nearbyProperties.length === 0) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Properties</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaHome className="text-gray-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Nearby Properties Found</h3>
            <p className="text-gray-600 mb-6">There are no other properties within 10km of this location.</p>
            <motion.button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome /> Back to Home
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {nearbyProperties.map((prop) => (
              <motion.div
                key={prop._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/properties/${prop._id}`)}
                whileHover={{ scale: 1.02 }}
              >
                {prop.images && prop.images[prop.isMainImage] ? (
                  <img src={prop.images[prop.isMainImage]} alt={prop.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <FaHome className="text-4xl text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{prop.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{prop.description}</p>
                  <p className="text-sm text-gray-500">
                    {prop.location.city}, {prop.location.county}
                  </p>
                  <p className="text-lg font-medium text-[#E83A17] mt-2">
                    {prop.pricing.basePrice} {prop.pricing.currency}/{prop.pricing.priceUnit}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NearbyProperties;