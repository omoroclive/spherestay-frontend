import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaCheckCircle, 
  FaShieldAlt, 
  FaChevronLeft, 
  FaWifi,
  FaCar,
  FaSwimmingPool,
  FaUtensils,
  FaCreditCard,
  FaLock,
  FaCalendarAlt,
  FaUsers,
  FaHeart,
  FaShare
} from 'react-icons/fa';
import api from '../../services/api';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import { fetchUser } from '../../store/slices/authSlice';
import mpesalogo from '@/assets/images/mpesalogo.jpg';
import visaLogo from '@/assets/images/visaLogo.jpg';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);
  
  const [bookingStatus, setBookingStatus] = useState({ 
    loading: false, 
    success: false, 
    error: null 
  });
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');

  const { propertyId, bookingDetails, property } = location.state || {};
  
  // Calculate nights if not provided
  const calculateNights = () => {
    if (!bookingDetails?.checkInDate || !bookingDetails?.checkOutDate) return 0;
    
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Calculate pricing details
  const calculatePricing = () => {
    const nights = calculateNights();
    const basePrice = property?.pricing?.basePrice || 0;
    const subtotal = basePrice * nights;
    const serviceFee = subtotal * 0.1; // 10% service fee
    const taxRate = 0.16; // 16% tax
    const taxes = (subtotal + serviceFee) * taxRate;
    const total = subtotal + serviceFee + taxes;
    
    return {
      nights,
      subtotal,
      serviceFee,
      taxes,
      total
    };
  };

  const pricingDetails = calculatePricing();

  // Enhanced price formatting
  const formatPrice = (price) => new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: property?.pricing?.currency || 'KES',
    maximumFractionDigits: 0,
  }).format(price || 0);

  // Auth check and navigation
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue with the booking.');
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  // Fetch user from Redux if needed
  useEffect(() => {
    if (isAuthenticated && !user && !loading && !error) {
      dispatch(fetchUser());
    }
  }, [isAuthenticated, user, loading, error, dispatch]);

  // Fetch detailed user info
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    
    setUserLoading(true);
    api.get(`/api/users/${user.id}`)
      .then(response => {
        setUserDetails(response.data);
      })
      .catch(err => {
        console.error('Failed to fetch user details:', err);
        // Fallback to Redux user data
        setUserDetails(user);
      })
      .finally(() => {
        setUserLoading(false);
      });
  }, [isAuthenticated, user]);

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
        paymentMethod: selectedPaymentMethod,
        userDetails: userDetails,
        totalPrice: pricingDetails.total
      });
      
      setBookingStatus({ loading: false, success: true, error: null });
      toast.success('🎉 Booking confirmed successfully!');
      setTimeout(() => navigate('/bookings'), 2500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      setBookingStatus({ loading: false, success: false, error: errorMessage });
      toast.error(errorMessage);
    }
  };

  // Enhanced amenity icons
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'wifi': FaWifi,
      'parking': FaCar,
      'pool': FaSwimmingPool,
      'kitchen': FaUtensils
    };
    const IconComponent = iconMap[amenity.toLowerCase()] || FaCheckCircle;
    return <IconComponent className="w-4 h-4" />;
  };

  // Payment methods - using the imported images
  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: mpesalogo, // Use the imported image directly
      description: 'Pay with M-Pesa mobile money'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: visaLogo, // Use the imported image directly
      description: 'Visa, Mastercard accepted'
    }
  ];

  if (!propertyId || !bookingDetails || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md border border-gray-100"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCalendarAlt className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-8">Please select a property and booking details to continue.</p>
          <Link 
            to="/properties" 
            className="bg-gradient-to-r from-[#E83A17] to-[#ff4d26] text-white px-8 py-3 rounded-xl hover:from-[#c53214] hover:to-[#e03419] transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            Browse Properties
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading || userLoading) return <LoadingSkeleton height="80vh" />;
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md border border-gray-100"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaShieldAlt className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Occurred</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link 
          to="/properties" 
          className="bg-gradient-to-r from-[#E83A17] to-[#ff4d26] text-white px-8 py-3 rounded-xl hover:from-[#c53214] hover:to-[#e03419] transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
        >
          Back to Properties
        </Link>
      </motion.div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-6 lg:py-12 max-w-7xl">
          {/* Header Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Link
              to={`/properties/${propertyId}`}
              className="inline-flex items-center gap-3 text-gray-700 hover:text-[#E83A17] font-medium transition-all duration-300 group"
            >
              <div className="p-2 rounded-full bg-white shadow-md group-hover:shadow-lg transition-shadow">
                <FaChevronLeft className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">Back to Property</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
                <FaShare className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
                <FaHeart className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Booking Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Main Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Request to book
                </h1>
                <p className="text-gray-600 text-lg">
                  Your trip is protected by our <span className="text-[#006644] font-medium">Book with Confidence</span> guarantee
                </p>
              </motion.div>

              {/* Property Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative">
                    <img
                      src={property.image || '/assets/images/default-property.jpg'}
                      alt={property.title}
                      className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-gray-700">
                      Featured
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                        {property.title}
                      </h2>
                      <p className="text-gray-600 flex items-center gap-2 mb-2">
                        <FaMapMarkerAlt className="text-[#E83A17] flex-shrink-0" />
                        <span className="truncate">{property.location?.city}, {property.location?.county}</span>
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 w-4 h-4" />
                          <span className="font-semibold text-gray-900">
                            {property.rating?.overall?.toFixed(1) || 'New'}
                          </span>
                          <span className="text-gray-500">
                            ({property.rating?.totalReviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.slice(0, 4).map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            {getAmenityIcon(amenity)}
                            <span className="text-gray-700 capitalize">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Trip Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaCalendarAlt className="text-[#E83A17]" />
                  Your trip details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Check-in</h4>
                    <p className="text-gray-600 text-lg">
                      {new Date(bookingDetails.checkInDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">After 3:00 PM</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Check-out</h4>
                    <p className="text-gray-600 text-lg">
                      {new Date(bookingDetails.checkOutDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">Before 11:00 AM</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-[#E83A17]" />
                    <h4 className="font-semibold text-gray-900">Guests</h4>
                  </div>
                  <p className="text-gray-600 text-lg mt-2">
                    {bookingDetails.guests} guest{bookingDetails.guests > 1 ? 's' : ''}
                  </p>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaCreditCard className="text-[#E83A17]" />
                  Choose payment method
                </h3>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                        selectedPaymentMethod === method.id
                          ? 'border-[#E83A17] bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={method.icon} // Now using the imported image directly
                          alt={method.name}
                          className="w-12 h-12 object-contain rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{method.name}</h4>
                          <p className="text-gray-600 text-sm">{method.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method.id
                            ? 'border-[#E83A17] bg-[#E83A17]'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <FaCheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* User Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Booking for
                </h3>
                
                {userDetails ? (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#E83A17] to-[#ff4d26] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {userDetails.firstName?.charAt(0)}{userDetails.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {userDetails.firstName} {userDetails.lastName}
                      </h4>
                      <p className="text-gray-600">{userDetails.email}</p>
                      {userDetails.phone && (
                        <p className="text-gray-600 text-sm">{userDetails.phone}</p>
                      )}
                    </div>
                    <FaCheckCircle className="text-green-500 w-6 h-6" />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-pulse">Loading user details...</div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column: Price Summary & Booking */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="sticky top-6"
              >
                <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100">
                  {/* Price Summary Header */}
                  <div className="border-b border-gray-200 pb-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(property.pricing?.basePrice)}
                      </span>
                      <span className="text-gray-600">per night</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-400 w-4 h-4" />
                      <span className="font-semibold text-gray-900">
                        {property.rating?.overall?.toFixed(1) || 'New'}
                      </span>
                      <span className="text-gray-500">
                        · {property.rating?.totalReviews || 0} reviews
                      </span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        {formatPrice(property.pricing?.basePrice)} × {pricingDetails.nights} nights
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(pricingDetails.subtotal)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Service fee</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(pricingDetails.serviceFee)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Taxes</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(pricingDetails.taxes)}
                      </span>
                    </div>
                  </div>

                  <hr className="border-gray-200 mb-6" />

                  {/* Total */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xl font-bold text-gray-900">
                      Total ({property.pricing?.currency || 'KES'})
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(pricingDetails.total)}
                    </span>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-3 mb-8 p-4 bg-green-50 rounded-2xl border border-green-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaLock className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Secure Booking</p>
                      <p className="text-green-600 text-sm">Your payment is protected</p>
                    </div>
                  </div>

                  {/* Booking Button */}
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingStatus.loading}
                    className="w-full bg-gradient-to-r from-[#E83A17] to-[#ff4d26] text-white font-bold py-4 px-6 rounded-2xl hover:from-[#c53214] hover:to-[#e03419] transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                  >
                    <AnimatePresence mode="wait">
                      {bookingStatus.loading ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-3"
                        >
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing your booking...</span>
                        </motion.div>
                      ) : bookingStatus.success ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center justify-center gap-3"
                        >
                          <FaCheckCircle className="w-6 h-6" />
                          <span>Booking Confirmed!</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Request to book
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* Error Message */}
                  <AnimatePresence>
                    {bookingStatus.error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mt-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 font-bold">!</span>
                          </div>
                          <p className="font-medium">{bookingStatus.error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Terms */}
                  <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 text-center">
                    <p>
                      By confirming, you agree to our{' '}
                      <Link to="/terms" className="text-[#006644] hover:underline font-medium">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/policy" className="text-[#006644] hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Checkout;