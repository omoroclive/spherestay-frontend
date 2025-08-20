import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { fetchWishlist, clearWishlistError } from '@/store/slices/wishlistSlice';
import PropertyCard from '@/components/ui/card/PropertyCard';
import { FaHeart, FaExclamationTriangle, FaSignInAlt, FaHome } from 'react-icons/fa';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const wishlist = useSelector((state) => state.wishlist.items);
  const wishlistStatus = useSelector((state) => state.wishlist.status);
  const wishlistError = useSelector((state) => state.wishlist.error);

  // Fetch wishlist on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
    return () => {
      dispatch(clearWishlistError());
    };
  }, [dispatch, isAuthenticated]);

  // Fetch full property details for wishlisted items
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['wishlistProperties', wishlist],
    queryFn: async () => {
      if (!wishlist || wishlist.length === 0) return [];
      const promises = wishlist.map((id) =>
        api.get(`/api/properties/${id}`).then((res) => res.data)
      );
      return Promise.all(promises);
    },
    enabled: isAuthenticated && wishlist.length > 0,
  });

  // Handle unauthenticated user
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to log in to view your wishlist.</p>
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignInAlt /> Log In
            </motion.button>
            <motion.button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

  // Handle loading state
  if (wishlistStatus === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Wishlist</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="animate-spin h-5 w-5 text-[#E83A17]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Loading your wishlist...
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (wishlistError || error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Wishlist</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Error Loading Wishlist</h3>
            <p className="text-gray-600 mb-6">
              {wishlistError || error?.message || 'Failed to load your wishlist. Please try again later.'}
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={() => dispatch(fetchWishlist())}
                className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retry
              </motion.button>
              <motion.button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHome /> Back to Home
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty wishlist
  if (!properties || properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Wishlist</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaHeart className="text-gray-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Wishlist is Empty</h3>
            <p className="text-gray-600 mb-6">Add properties to your wishlist by clicking the heart icon on property cards!</p>
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={() => navigate('/properties')}
                className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Properties
              </motion.button>
              <motion.button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHome /> Back to Home
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Wishlist</h2>
          <motion.button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome /> Back to Home
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={{
                  ...property,
                  title: property.title || property.businessName || 'Unnamed Property',
                  images: property.images || [{ url: '/images/property-placeholder.jpg', caption: 'Property image', isMain: true }],
                  pricing: property.pricing || { basePrice: 0, currency: 'KES', priceUnit: 'night' },
                  rating: property.rating || { overall: 0, totalReviews: 0, breakdown: { cleanliness: 0, accuracy: 0, communication: 0, location: 0, checkIn: 0, value: 0 } },
                  location: property.location || { city: 'Unknown', county: 'Unknown', coordinates: { latitude: 0, longitude: 0 } },
                  businessName: property.businessName || 'Unknown',
                  category: property.category || property.type || 'property',
                  amenities: property.amenities || [],
                  capacity: property.capacity || { bedrooms: 0, bathrooms: 0, guests: 0 },
                }}
                lazyLoadImages
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;