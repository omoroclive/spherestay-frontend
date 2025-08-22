import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaStar, FaCheckCircle, FaShieldAlt, FaChevronLeft } from 'react-icons/fa';
import api from '../../services/api';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import { fetchUser } from '../../store/slices/authSlice';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: false, error: null });

  const { propertyId, bookingDetails, property } = location.state || {};
  const formatPrice = (price) => new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: property?.pricing?.currency || 'KES',
    maximumFractionDigits: 0,
  }).format(price || 0);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue with the booking.');
      navigate('/login', { state: { from: location } });
    } else {
      dispatch(fetchUser());
    }
  }, [isAuthenticated, dispatch, navigate, location]);

  const handleConfirmBooking = async () => {
    if (!propertyId || !bookingDetails) {
      toast.error('Invalid booking details.');
      return;
    }

    setBookingStatus({ loading: true, success: false, error: null });
    try {
      await api.post('/api/bookings', {
        propertyId,
        checkInDate: bookingDetails.checkInDate,
        checkOutDate: bookingDetails.checkOutDate,
        guests: bookingDetails.guests,
      });
      setBookingStatus({ loading: false, success: true, error: null });
      toast.success('Booking confirmed!');
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      setBookingStatus({ loading: false, success: false, error: errorMessage });
      toast.error(errorMessage);
    }
  };

  if (!propertyId || !bookingDetails || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Booking</h2>
          <p className="text-gray-600 mb-6">Please select a property and booking details to continue.</p>
          <Link to="/properties" className="bg-[#E83A17] text-white px-6 py-3 rounded-lg hover:bg-[#c53214] transition-all duration-300 transform hover:scale-105">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSkeleton height="80vh" />;
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/properties" className="bg-[#E83A17] text-white px-6 py-3 rounded-lg hover:bg-[#c53214] transition-all duration-300 transform hover:scale-105">
          Back to Properties
        </Link>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-12">
          <Link
            to={`/properties/${propertyId}`}
            className="inline-flex items-center gap-2 text-[#E83A17] hover:text-[#c53214] font-medium mb-8 transition-colors duration-300"
          >
            <FaChevronLeft />
            <span>Back to Property</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Booking Details */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Confirm and Pay</h1>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#E83A17]" />
                      {property.location?.city}, {property.location?.county}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaStar className="text-yellow-400" />
                      {property.rating?.overall?.toFixed(1) || 'New'} ({property.rating?.totalReviews || 0} reviews)
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Trip</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Dates</span>
                      <span>
                        {new Date(bookingDetails.checkInDate).toLocaleDateString()} -{' '}
                        {new Date(bookingDetails.checkOutDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Guests</span>
                      <span>{bookingDetails.guests} guest{bookingDetails.guests > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Name</span>
                      <span>{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email</span>
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{formatPrice(property.pricing?.basePrice)} × {bookingDetails.nights} nights</span>
                    <span>{formatPrice(bookingDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>{formatPrice(bookingDetails.serviceFee)}</span>
                  </div>
                  <hr className="my-4 border-gray-200" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total ({property.pricing?.currency || 'KES'})</span>
                    <span>{formatPrice(bookingDetails.total)}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Confirmation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-4 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <FaShieldAlt className="text-[#006644]" />
                  <span className="font-medium text-[#006644]">Secure Booking</span>
                </div>
                <button
                  onClick={handleConfirmBooking}
                  disabled={bookingStatus.loading}
                  className="w-full bg-gradient-to-r from-[#E83A17] to-[#ff4d26] text-white font-bold py-4 px-6 rounded-xl hover:from-[#c53214] hover:to-[#e03419] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {bookingStatus.loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : bookingStatus.success ? (
                    <div className="flex items-center justify-center gap-2">
                      <FaCheckCircle />
                      <span>Booking Confirmed!</span>
                    </div>
                  ) : (
                    <span>Confirm and Pay</span>
                  )}
                </button>
                {bookingStatus.error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mt-4"
                  >
                    {bookingStatus.error}
                  </motion.div>
                )}
                <div className="mt-6 text-sm text-gray-600">
                  <p>By confirming, you agree to our <Link to="/terms" className="text-[#006644] hover:underline">Terms of Service</Link> and <Link to="/policy" className="text-[#006644] hover:underline">Privacy Policy</Link>.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Checkout;