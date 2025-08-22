import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaBed, FaBath, FaStar, FaHeart, FaCheckCircle,
  FaUser, FaClock, FaDog, FaSmokingBan, FaCalendarCheck, FaWifi,
  FaSnowflake, FaConciergeBell, FaShare, FaExpand, FaPlay, FaChevronLeft,
  FaChevronRight, FaUsers, FaHome, FaEye, FaShieldAlt, FaPhone, FaEnvelope
} from 'react-icons/fa';
import { GiKenya } from 'react-icons/gi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';

// Configure Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component for the image gallery
const ImageGallery = ({ images, currentIndex, setCurrentIndex, setShowModal, handleShare, handleWishlist, isWishlisted }) => {
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="h-[70vh] relative overflow-hidden">
      <motion.img
        key={currentIndex}
        src={images[currentIndex]?.url || '/images/property-placeholder.jpg'}
        alt="Property"
        className="w-full h-full object-cover"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {images.length > 1 && (
        <>
          <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300">
            <FaChevronLeft size={20} />
          </button>
          <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300">
            <FaChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}

      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={handleShare} className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300">
          <FaShare size={16} />
        </button>
        <button onClick={() => setShowModal(true)} className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300">
          <FaExpand size={16} />
        </button>
        <button
          onClick={handleWishlist}
          className={`backdrop-blur-md p-3 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          <FaHeart size={16} />
        </button>
      </div>
    </div>
  );
};

// Component for property header
const PropertyHeader = ({ property }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="absolute bottom-0 left-0 right-0 p-8 text-white"
  >
    <div className="container mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <span className="bg-[#006644] px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
          <FaShieldAlt size={12} />
          {property.verificationStatus === 'verified' ? 'Verified Property' : 'Property'}
        </span>
        <span className="bg-[#E83A17] px-4 py-2 rounded-full text-sm font-medium">
          {property.type === 'villa' ? 'Luxury Villa' : property.type.charAt(0).toUpperCase() + property.type.slice(1)}
        </span>
        {property.featured && (
          <span className="bg-yellow-500 px-4 py-2 rounded-full text-sm font-medium">⭐ Featured</span>
        )}
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{property.title}</h1>
      <div className="flex items-center gap-6 text-lg">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-[#E83A17]" />
          <span>{property.location?.city}, {property.location?.county}</span>
        </div>
        {property.rating?.overall > 0 && (
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span>{property.rating.overall.toFixed(1)} ({property.rating.totalReviews} reviews)</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <FaEye className="text-white/80" />
          <span>{property.metrics?.views || 0} views</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Component for booking form
const BookingForm = ({ bookingForm, setBookingForm, property }) => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateBookingDetails = () => {
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) return null;
    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;

    const basePrice = property.pricing?.basePrice || 0;
    const subtotal = basePrice * nights;
    const serviceFee = Math.round(subtotal * 0.14);
    return { nights, subtotal, serviceFee, total: subtotal + serviceFee };
  };

  const handleReserve = () => {
    const bookingDetails = calculateBookingDetails();
    if (!bookingDetails) {
      toast.error('Please select valid dates.');
      return;
    }
    navigate('/checkout', {
      state: {
        propertyId: property._id,
        bookingDetails: {
          checkInDate: bookingForm.checkInDate,
          checkOutDate: bookingForm.checkOutDate,
          guests: bookingForm.guests,
          ...bookingDetails,
        },
        property: {
          title: property.title,
          image: property.images?.[0]?.url || '/images/property-placeholder.jpg',
          pricing: property.pricing,
          location: property.location,
        },
      },
    });
  };

  const bookingDetails = calculateBookingDetails();
  const formatPrice = (price) => new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: property?.pricing?.currency || 'KES',
    maximumFractionDigits: 0
  }).format(price || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
          <input
            type="date"
            name="checkInDate"
            value={bookingForm.checkInDate}
            onChange={handleChange}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent transition-all duration-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
          <input
            type="date"
            name="checkOutDate"
            value={bookingForm.checkOutDate}
            onChange={handleChange}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
        <select
          name="guests"
          value={bookingForm.guests}
          onChange={handleChange}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent transition-all duration-300"
        >
          {Array.from({ length: property.capacity?.maxGuests || 8 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>
      {bookingDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 rounded-xl p-4 space-y-2"
        >
          <div className="flex justify-between">
            <span>{formatPrice(property.pricing?.basePrice)} × {bookingDetails.nights} nights</span>
            <span>{formatPrice(bookingDetails.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>{formatPrice(bookingDetails.serviceFee)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(bookingDetails.total)}</span>
          </div>
        </motion.div>
      )}
      <button
        onClick={handleReserve}
        className="w-full bg-gradient-to-r from-[#E83A17] to-[#ff4d26] text-white font-bold py-4 px-6 rounded-xl hover:from-[#c53214] hover:to-[#e03419] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Reserve Now
      </button>
    </div>
  );
};

// Component for amenities
const Amenities = ({ amenities }) => {
  const getAmenityIcon = (amenityName) => {
    const iconMap = {
      'wifi': FaWifi,
      'air conditioning': FaSnowflake,
      'private chef': FaConciergeBell,
    };
    return iconMap[amenityName.toLowerCase()] || FaCheckCircle;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-2xl p-8 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => {
          const IconComponent = getAmenityIcon(amenity.name);
          return (
            <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300">
              <IconComponent className="text-[#006644] text-xl" />
              <span className="text-gray-800 font-medium">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Main component
const PremiumPropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingForm, setBookingForm] = useState({ checkInDate: '', checkOutDate: '', guests: 1 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: response, isLoading, error } = useApi(`/api/properties/${id}`);
  const property = response?.data;

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property?.title || 'Amazing Property',
        text: property?.description || '',
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) return <LoadingSkeleton height="80vh" />;
  if (error || !property) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="bg-[#E83A17] text-white px-6 py-3 rounded-lg hover:bg-[#c53214] transition-all duration-300 transform hover:scale-105">
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="relative">
          <ImageGallery
            images={property.images || []}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
            setShowModal={setShowImageModal}
            handleShare={handleShare}
            handleWishlist={handleWishlistToggle}
            isWishlisted={isWishlisted}
          />
          <PropertyHeader property={property} />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {[
                  { icon: FaBed, value: property.capacity?.bedrooms || 0, label: 'Bedrooms' },
                  { icon: FaBath, value: property.capacity?.bathrooms || 0, label: 'Bathrooms' },
                  { icon: FaUsers, value: property.capacity?.maxGuests || 0, label: 'Max Guests' },
                  { icon: FaHome, value: property.capacity?.beds || 0, label: 'Beds' },
                ].map(({ icon: Icon, value, label }, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                    <Icon className="text-[#006644] text-2xl mb-3 mx-auto" />
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="text-gray-600">{label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Your Host</h2>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#006644] to-[#E83A17] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {property.owner?.firstName?.[0]}{property.owner?.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.owner?.firstName} {property.owner?.lastName}</h3>
                    <p className="text-gray-600 mb-4">{property.businessName}</p>
                    <div className="flex gap-4">
                      <a href={`tel:${property.owner?.phone}`} className="flex items-center gap-2 text-[#006644] hover:text-[#004d33] transition-colors">
                        <FaPhone size={14} /> Contact Host
                      </a>
                      <a href={`mailto:${property.owner?.email}`} className="flex items-center gap-2 text-[#006644] hover:text-[#004d33] transition-colors">
                        <FaEnvelope size={14} /> Send Message
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About this property</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{property.description}</p>
              </motion.div>

              {property.features?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                        <FaCheckCircle className="text-[#006644] text-xl" />
                        <span className="text-gray-800 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {property.amenities?.length > 0 && <Amenities amenities={property.amenities} />}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">House Rules & Policies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaClock className="text-[#006644] text-xl" />
                      <div>
                        <div className="font-semibold">Check-in</div>
                        <div className="text-gray-600">{property.policies?.checkIn?.from} - {property.policies?.checkIn?.to}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaClock className="text-[#006644] text-xl" />
                      <div>
                        <div className="font-semibold">Check-out</div>
                        <div className="text-gray-600">Before {property.policies?.checkOut}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaDog className={`text-xl ${property.policies?.petPolicy?.allowed ? 'text-green-500' : 'text-red-500'}`} />
                      <div>
                        <div className="font-semibold">Pets</div>
                        <div className="text-gray-600">{property.policies?.petPolicy?.allowed ? 'Allowed' : 'Not Allowed'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaSmokingBan className="text-red-500 text-xl" />
                      <div>
                        <div className="font-semibold">Smoking</div>
                        <div className="text-gray-600">{property.policies?.smokingPolicy === 'not_allowed' ? 'Not Allowed' : 'Allowed'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
                <p className="text-gray-600 mb-6">{property.location?.address}</p>
                {property.location?.coordinates?.latitude && property.location?.coordinates?.longitude && (
                  <div className="h-96 rounded-xl overflow-hidden">
                    <MapContainer
                      center={[property.location.coordinates.latitude, property.location.coordinates.longitude]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[property.location.coordinates.latitude, property.location.coordinates.longitude]}>
                        <Popup>{property.title}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-4 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {new Intl.NumberFormat('en-KE', {
                        style: 'currency',
                        currency: property.pricing?.currency || 'KES',
                        maximumFractionDigits: 0
                      }).format(property.pricing?.basePrice || 0)}
                    </span>
                    <span className="text-gray-600 text-lg">
                      {property.pricing?.priceUnit === 'night' ? '/night' : 
                       property.pricing?.priceUnit === 'day' ? '/day' : 
                       property.pricing?.priceUnit === 'week' ? '/week' : 
                       property.pricing?.priceUnit === 'month' ? '/month' : '/night'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium">{property.rating?.overall?.toFixed(1) || 'New'}</span>
                    {property.rating?.totalReviews > 0 && <span>({property.rating.totalReviews} reviews)</span>}
                  </div>
                </div>
                <BookingForm
                  bookingForm={bookingForm}
                  setBookingForm={setBookingForm}
                  property={property}
                />
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      isWishlisted ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100' : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <FaHeart className={isWishlisted ? 'text-red-500' : ''} />
                    <span>{isWishlisted ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 text-gray-700 border fixer-upper-2 border-gray-200 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300"
                  >
                    <FaShare />
                    <span>Share</span>
                  </button>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><FaShieldAlt className="text-[#006644]" /><span>Verified</span></div>
                    <div className="flex items-center gap-2"><GiKenya className="text-[#006644]" /><span>Local Host</span></div>
                    <div className="flex items-center gap-2"><FaCheckCircle className="text-[#006644]" /><span>Instant Book</span></div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendarCheck className="text-[#006644]" />
                    <span className="font-medium text-[#006644]">Great availability</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    This property is available for {property.availability?.maximumStay} days maximum stay. 
                    Book up to {property.availability?.advanceBooking} days in advance.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-[#E83A17] hover:text-[#c53214] font-medium transition-colors duration-300"
            >
              <FaChevronLeft />
              <span>Back to All Properties</span>
            </Link>
          </motion.div>
        </div>

        <AnimatePresence>
          {showImageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setShowImageModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-6xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={property.images[currentImageIndex]?.url || '/images/property-placeholder.jpg'}
                  alt={property.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
                >
                  ✕
                </button>
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
                    >
                      <FaChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % property.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
                    >
                      <FaChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-KE', {
                    style: 'currency',
                    currency: property.pricing?.currency || 'KES',
                    maximumFractionDigits: 0
                  }).format(property.pricing?.basePrice || 0)}/{property.pricing?.priceUnit || 'night'}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <FaStar className="text-yellow-400" />
                  <span>{property.rating?.overall?.toFixed(1) || 'New'}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const bookingDetails = calculateBookingDetails();
                  if (!bookingDetails) {
                    toast.error('Please select valid dates.');
                    return;
                  }
                  navigate('/checkout', {
                    state: {
                      propertyId: property._id,
                      bookingDetails: {
                        checkInDate: bookingForm.checkInDate,
                        checkOutDate: bookingForm.checkOutDate,
                        guests: bookingForm.guests,
                        ...bookingDetails,
                      },
                      property: {
                        title: property.title,
                        image: property.images?.[0]?.url || '/images/property-placeholder.jpg',
                        pricing: property.pricing,
                        location: property.location,
                      },
                    },
                  });
                }}
                className="bg-gradient-to-r from-[#E83A17] to-[#ff4d26] text-white font-bold py-3 px-8 rounded-xl hover:from-[#c53214] hover:to-[#e03419] transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );

  function calculateBookingDetails() {
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) return null;
    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;

    const basePrice = property.pricing?.basePrice || 0;
    const subtotal = basePrice * nights;
    const serviceFee = Math.round(subtotal * 0.14);
    return { nights, subtotal, serviceFee, total: subtotal + serviceFee };
  }
};

export default React.memo(PremiumPropertyDetail);