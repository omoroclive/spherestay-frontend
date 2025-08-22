
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaSwimmingPool, 
  FaCamera, 
  FaUmbrellaBeach,
  FaShip,
  FaLandmark,
  FaMountain,
  FaTree,
  FaWater,
  FaEye,
  FaHeart,
  FaCoffee,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheck,
  FaShare,
  FaArrowLeft,
  FaInfoCircle,
  FaWifi,
  FaParking,
  FaRestroom,
  FaWheelchair,
  FaFirstAid,
  FaShoppingCart,
  FaBus,
  FaCar,
  FaWalking,
  FaMoneyBillWave,
  FaUsers,
  FaChild,
  FaGraduationCap
} from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { MdOutlineFreeBreakfast, MdLocationCity, MdRestaurant } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import { useApi } from '../../hooks/useApi';
import  NearbyProperties  from '../properties/NearbyProperties';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PublicPropertiesDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [property, setProperty] = useState(location.state?.property || null);
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data, isLoading, error } = useApi(
    property ? null : `/api/publicproperties/${id}`,
    { enabled: !property }
  );

  useEffect(() => {
    if (data?.data?.property) {
      setProperty(data.data.property);
    }
  }, [data]);

  useEffect(() => {
    if (property && !property._viewIncremented) {
      property._viewIncremented = true;
    }
  }, [property]);

  const getCategoryIcon = (category) => {
    const iconClass = "text-3xl";
    
    switch (category?.toLowerCase()) {
      case 'beach':
        return <FaUmbrellaBeach className={`${iconClass} text-blue-500`} />;
      case 'mountain':
        return <FaMountain className={`${iconClass} text-green-600`} />;
      case 'forest':
        return <FaTree className={`${iconClass} text-green-700`} />;
      case 'lake':
      case 'water':
        return <FaWater className={`${iconClass} text-blue-600`} />;
      case 'cultural':
      case 'cultural_site':
      case 'archaeological_site':
      case 'museum':
        return <FaLandmark className={`${iconClass} text-purple-600`} />;
      default:
        return <BiCategory className={`${iconClass} text-gray-500`} />;
    }
  };

  const getActivityIcon = (activity) => {
    const iconClass = "text-lg";
    
    switch (activity?.toLowerCase()) {
      case 'swimming':
        return <FaSwimmingPool className={`${iconClass} text-blue-500`} />;
      case 'photography':
        return <FaCamera className={`${iconClass} text-purple-500`} />;
      case 'boating':
      case 'dhow_sailing':
        return <FaShip className={`${iconClass} text-blue-600`} />;
      case 'cultural_tours':
        return <FaLandmark className={`${iconClass} text-orange-500`} />;
      case 'bird_watching':
        return <FaEye className={`${iconClass} text-green-500`} />;
      case 'fishing':
        return <FaWater className={`${iconClass} text-blue-700`} />;
      default:
        return <FaCamera className={`${iconClass} text-gray-500`} />;
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'Unknown Location';
    
    const { county, region } = location;
    const parts = [];
    
    if (county) parts.push(county);
    if (region && region !== county) parts.push(region);
    
    return parts.join(', ') || 'Kenya';
  };

  const getBestVisitTime = (bestVisitTime) => {
    if (!bestVisitTime?.months || bestVisitTime.months.length === 0) return null;
    
    const months = bestVisitTime.months;
    if (months.length <= 2) return months.join(' - ');
    return `${months[0]} - ${months[months.length - 1]}`;
  };

  const formatOperatingHours = (operatingHours) => {
    if (!operatingHours) return 'Operating hours not specified';
    
    if (operatingHours.isAlwaysOpen) {
      return 'Open 24/7';
    }
    
    const schedule = operatingHours.schedule;
    if (!schedule) return 'Check locally for hours';
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentDayIndex = new Date().getDay();
    const currentDay = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1];
    
    const todayHours = schedule[currentDay];
    if (!todayHours) {
      return 'Check locally for hours';
    }
    
    if (todayHours.isClosed) {
      return 'Closed today';
    }
    
    if (todayHours.open && todayHours.close) {
      return `Today: ${todayHours.open} - ${todayHours.close}`;
    }
    
    return 'Check locally for hours';
  };

  const PropertyMap = ({ coordinates, name, location }) => {
    if (!coordinates?.latitude || !coordinates?.longitude) {
      return (
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded-xl">
          <p className="text-gray-500">Map unavailable: Coordinates not provided</p>
        </div>
      );
    }

    return (
      <MapContainer
        center={[coordinates.latitude, coordinates.longitude]}
        zoom={13}
        style={{ height: '300px', width: '100%' }}
        className="rounded-xl shadow-sm"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[coordinates.latitude, coordinates.longitude]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-gray-600">{formatLocation(location)}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    );
  };

  const ImageGallery = ({ images }) => {
    if (!images || images.length === 0) {
      return (
        <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-2xl">
          <div className="text-center text-gray-500">
            <FaCamera className="text-4xl mx-auto mb-2" />
            <p>No images available</p>
          </div>
        </div>
      );
    }

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
      <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-xl">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]?.url}
          alt={images[currentImageIndex]?.caption || property?.name}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 hover:scale-105"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-lg" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 hover:scale-105"
              aria-label="Next image"
            >
              <FaChevronRight className="text-lg" />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-xs overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex 
                      ? 'border-white shadow-lg scale-105' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedImageModal({ 
                images, 
                currentIndex: currentImageIndex, 
                propertyName: property.name 
              })}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 hover:scale-105"
              aria-label="Expand images"
            >
              <FaExpand className="text-lg" />
            </button>

            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}

        {images[currentImageIndex]?.caption && (
          <div className="absolute bottom-16 left-4 right-4 bg-black/70 backdrop-blur-sm text-white p-3 rounded-lg">
            <p className="text-sm">{images[currentImageIndex].caption}</p>
            {images[currentImageIndex]?.photographer && (
              <p className="text-xs opacity-75 mt-1">
                Photo by {images[currentImageIndex].photographer}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const ImageModal = ({ modalData, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(modalData.currentIndex);

    const nextImage = () => {
      setCurrentIndex((prev) => (prev + 1) % modalData.images.length);
    };

    const prevImage = () => {
      setCurrentIndex((prev) => (prev - 1 + modalData.images.length) % modalData.images.length);
    };

    useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      };

      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }, [onClose]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="relative w-full max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
          <motion.img
            key={currentIndex}
            src={modalData.images[currentIndex]?.url}
            alt={modalData.images[currentIndex]?.caption || modalData.propertyName}
            className="w-full h-full object-contain max-h-[90vh] rounded-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            loading="lazy"
          />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all hover:scale-105"
            aria-label="Close image modal"
          >
            <FaTimes className="text-xl" />
          </button>

          {modalData.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all hover:scale-105"
                aria-label="Previous image"
              >
                <FaChevronLeft className="text-xl" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all hover:scale-105"
                aria-label="Next image"
              >
                <FaChevronRight className="text-xl" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {modalData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>

              <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                {currentIndex + 1} / {modalData.images.length}
              </div>
            </>
          )}

          {modalData.images[currentIndex]?.caption && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg text-center max-w-2xl">
              <p className="text-sm">{modalData.images[currentIndex].caption}</p>
              {modalData.images[currentIndex]?.photographer && (
                <p className="text-xs opacity-75 mt-1">
                  Photo by {modalData.images[currentIndex].photographer}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const ShareModal = ({ onClose }) => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${property?.name} - ${formatLocation(property?.location)}`;

    const shareOptions = [
      {
        name: 'Copy Link',
        action: () => {
          navigator.clipboard.writeText(shareUrl);
          onClose();
        },
        icon: FaShare,
        color: 'bg-gray-500'
      },
      {
        name: 'WhatsApp',
        action: () => {
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
          onClose();
        },
        icon: FaShare,
        color: 'bg-green-500'
      },
      {
        name: 'Twitter',
        action: () => {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
          onClose();
        },
        icon: FaShare,
        color: 'bg-blue-400'
      },
      {
        name: 'Facebook',
        action: () => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
          onClose();
        },
        icon: FaShare,
        color: 'bg-blue-600'
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Share This Place</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className={`${option.color} text-white p-4 rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center gap-2`}
              >
                <option.icon className="text-2xl" />
                <span className="text-sm font-medium">{option.name}</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    );
  };

  if (isLoading && !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton height="500px" className="mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <LoadingSkeleton height="200px" />
              <LoadingSkeleton height="150px" />
              <LoadingSkeleton height="100px" />
            </div>
            <div className="space-y-6">
              <LoadingSkeleton height="300px" />
              <LoadingSkeleton height="200px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/public-properties')}
            className="bg-[#E83A17] text-white px-6 py-3 rounded-lg hover:bg-[#c53214] transition-colors font-medium"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#E83A17] transition-colors font-medium"
              aria-label="Go back"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-[#E83A17] transition-colors"
                aria-label="Share"
              >
                <FaShare />
              </button>
              
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-600'
                }`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <FaHeart className={isFavorite ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ImageGallery images={property.images} />

            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getCategoryIcon(property.category)}
                    <div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {property.category?.replace('_', ' ')}
                      </span>
                      {property.subCategory && (
                        <span className="ml-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm capitalize">
                          {property.subCategory.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {property.name}
                  </h1>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="text-[#E83A17] text-lg mr-2" />
                    <span className="text-lg">{formatLocation(property.location)}</span>
                  </div>
                </div>

                <div className="text-right">
                  {property.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block">
                      Featured
                    </span>
                  )}
                  
                  {property.rating?.overall > 0 && (
                    <div className="flex items-center justify-end gap-1 mb-2">
                      <FaStar className="text-yellow-500" />
                      <span className="font-semibold text-lg">{property.rating.overall.toFixed(1)}</span>
                      {property.rating.totalReviews > 0 && (
                        <span className="text-gray-500 text-sm">
                          ({property.rating.totalReviews} reviews)
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {property.metrics?.views > 0 && (
                      <div className="flex items-center gap-1">
                        <FaEye />
                        <span>{property.metrics.views.toLocaleString()} views</span>
                      </div>
                    )}
                    {property.metrics?.favorites > 0 && (
                      <div className="flex items-center gap-1">
                        <FaHeart className="text-red-500" />
                        <span>{property.metrics.favorites}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {property.entryFees?.freeEntry ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <MdOutlineFreeBreakfast />
                    Free Entry
                  </span>
                ) : (
                  <span className="bg-[#E83A17] bg-opacity-10 text-[#E83A17] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <FaMoneyBillWave />
                    Entry Fee Required
                  </span>
                )}

                {property.safety?.level && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1 ${
                    property.safety.level === 'safe' || property.safety.level === 'very_safe'
                      ? 'bg-green-100 text-green-800' 
                      : property.safety.level === 'moderate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <FaShieldAlt />
                    {property.safety.level.replace('_', ' ')}
                  </span>
                )}

                {property.operatingHours?.isAlwaysOpen && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <FaClock />
                    Open 24/7
                  </span>
                )}

                {getBestVisitTime(property.bestVisitTime) && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <FaCalendarAlt />
                    Best: {getBestVisitTime(property.bestVisitTime)}
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                {property.shortDescription || property.description}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {[
                    { id: 'overview', name: 'Overview', icon: FaInfoCircle },
                    { id: 'activities', name: 'Activities', icon: FaCamera },
                    { id: 'facilities', name: 'Facilities', icon: FaWifi },
                    { id: 'safety', name: 'Safety', icon: FaShieldAlt },
                    { id: 'accessibility', name: 'Getting There', icon: FaCar }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'text-[#E83A17] border-b-2 border-[#E83A17] bg-red-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      aria-label={`View ${tab.name} tab`}
                    >
                      <tab.icon className="text-lg" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Place</h3>
                          <p className="text-gray-700 leading-relaxed">
                            {property.description}
                          </p>
                        </div>

                        {property.tags && property.tags.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {property.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize"
                                >
                                  #{tag.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {property.bestVisitTime && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FaCalendarAlt className="text-[#E83A17]" />
                              Best Time to Visit
                            </h4>
                            <div className="bg-blue-50 p-4 rounded-xl">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {property.bestVisitTime.months && (
                                  <div>
                                    <span className="font-medium text-gray-900">Best Months:</span>
                                    <p className="text-gray-700">{property.bestVisitTime.months.join(', ')}</p>
                                  </div>
                                )}
                                {property.bestVisitTime.seasons && (
                                  <div>
                                    <span className="font-medium text-gray-900">Seasons:</span>
                                    <p className="text-gray-700 capitalize">
                                      {property.bestVisitTime.seasons.join(', ').replace('_', ' ')}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {property.bestVisitTime.weatherNotes && (
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                  <span className="font-medium text-gray-900">Weather Notes:</span>
                                  <p className="text-gray-700 text-sm mt-1">{property.bestVisitTime.weatherNotes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {property.features?.wildlife && property.features.wildlife.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FaTree className="text-green-600" />
                              Wildlife
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {property.features.wildlife.map((animal, index) => (
                                <span
                                  key={index}
                                  className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm text-center capitalize"
                                >
                                  {animal.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'activities' && (
                      <div className="space-y-6">
                        {property.features?.activities && property.features.activities.length > 0 ? (
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Activities</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {property.features.activities.map((activity, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                                >
                                  {getActivityIcon(activity)}
                                  <span className="font-medium text-gray-900 capitalize">
                                    {activity.replace('_', ' ')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <FaCamera className="text-4xl mx-auto mb-3 opacity-50" />
                            <p>No specific activities listed for this location.</p>
                            <p className="text-sm mt-2">Contact the property for more information about available activities.</p>
                          </div>
                        )}

                        {property.features?.accommodation?.available && (
                          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <FaCoffee className="text-yellow-600" />
                              Accommodation Available
                            </h4>
                            {property.features.accommodation.types && property.features.accommodation.types.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {property.features.accommodation.types.map((type, index) => (
                                  <span
                                    key={index}
                                    className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-lg text-sm capitalize"
                                  >
                                    {type.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-700 text-sm">Various accommodation options available.</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'facilities' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Facilities</h3>
                        
                        {property.features?.facilities ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                              { key: 'parking', label: 'Parking', icon: FaParking, available: property.features.facilities.parking },
                              { key: 'restrooms', label: 'Restrooms', icon: FaRestroom, available: property.features.facilities.restrooms },
                              { key: 'wifi', label: 'WiFi', icon: FaWifi, available: property.features.facilities.wifi },
                              { key: 'restaurant', label: 'Restaurant', icon: MdRestaurant, available: property.features.facilities.restaurant },
                              { key: 'giftShop', label: 'Gift Shop', icon: FaShoppingCart, available: property.features.facilities.giftShop },
                              { key: 'guidedTours', label: 'Guided Tours', icon: FaUsers, available: property.features.facilities.guidedTours },
                              { key: 'informationCenter', label: 'Information Center', icon: FaInfoCircle, available: property.features.facilities.informationCenter },
                              { key: 'firstAid', label: 'First Aid', icon: FaFirstAid, available: property.features.facilities.firstAid },
                              { key: 'wheelchairAccessible', label: 'Wheelchair Accessible', icon: FaWheelchair, available: property.features.facilities.wheelchairAccessible },
                              { key: 'camping', label: 'Camping', icon: FaMountain, available: property.features.facilities.camping }
                            ].map((facility) => (
                              <div
                                key={facility.key}
                                className={`flex items-center gap-3 p-3 rounded-xl border ${
                                  facility.available
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-gray-50 border-gray-200 text-gray-500'
                                }`}
                              >
                                <facility.icon className="text-lg" />
                                <span className="font-medium">{facility.label}</span>
                                {facility.available ? (
                                  <FaCheck className="ml-auto text-green-600" />
                                ) : (
                                  <FaTimes className="ml-auto text-gray-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <FaInfoCircle className="text-4xl mx-auto mb-3 opacity-50" />
                            <p>Facility information not available.</p>
                            <p className="text-sm mt-2">Contact the property directly for details about available facilities.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'safety' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <FaShieldAlt className="text-2xl text-[#E83A17]" />
                          <h3 className="text-xl font-semibold text-gray-900">Safety Information</h3>
                        </div>

                        {property.safety?.level && (
                          <div className={`p-4 rounded-xl border-2 ${
                            property.safety.level === 'safe' || property.safety.level === 'very_safe'
                              ? 'bg-green-50 border-green-200'
                              : property.safety.level === 'moderate'
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <FaShieldAlt className={`text-lg ${
                                property.safety.level === 'safe' || property.safety.level === 'very_safe'
                                  ? 'text-green-600'
                                  : property.safety.level === 'moderate'
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`} />
                              <span className="font-semibold capitalize">
                                Safety Level: {property.safety.level.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        )}

                        {property.safety?.guidelines && property.safety.guidelines.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Safety Guidelines</h4>
                            <div className="space-y-2">
                              {property.safety.guidelines.map((guideline, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                  <FaCheck className="text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{guideline}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {property.safety?.warnings && property.safety.warnings.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Important Warnings</h4>
                            <div className="space-y-2">
                              {property.safety.warnings.map((warning, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                  <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{warning}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {property.safety?.emergencyContacts && property.safety.emergencyContacts.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Emergency Contacts</h4>
                            <div className="space-y-2">
                              {property.safety.emergencyContacts.map((contact, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <FaPhone className="text-gray-600" />
                                  <span className="text-gray-700">{contact}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'accessibility' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <FaCar className="text-2xl text-[#E83A17]" />
                          <h3 className="text-xl font-semibold text-gray-900">Getting There</h3>
                        </div>

                        {property.location?.accessibility && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl border ${
                              property.location.accessibility.roadAccess === 'excellent'
                                ? 'bg-green-50 border-green-200'
                                : property.location.accessibility.roadAccess === 'good'
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-yellow-50 border-yellow-200'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <FaCar className={`text-lg ${
                                  property.location.accessibility.roadAccess === 'excellent'
                                    ? 'text-green-600'
                                    : property.location.accessibility.roadAccess === 'good'
                                    ? 'text-blue-600'
                                    : 'text-yellow-600'
                                }`} />
                                <span className="font-medium">Road Access</span>
                              </div>
                              <p className="text-sm capitalize">
                                {property.location.accessibility.roadAccess || 'Not specified'}
                              </p>
                            </div>

                            <div className={`p-4 rounded-xl border ${
                              property.location.accessibility.publicTransport
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <FaBus className={`text-lg ${
                                  property.location.accessibility.publicTransport
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`} />
                                <span className="font-medium">Public Transport</span>
                              </div>
                              <p className="text-sm">
                                {property.location.accessibility.publicTransport ? 'Available' : 'Not available'}
                              </p>
                            </div>

                            <div className={`p-4 rounded-xl border ${
                              property.location.accessibility.walkingDistance === 'easy'
                                ? 'bg-green-50 border-green-200'
                                : property.location.accessibility.walkingDistance === 'moderate'
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-red-50 border-red-200'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <FaWalking className={`text-lg ${
                                  property.location.accessibility.walkingDistance === 'easy'
                                    ? 'text-green-600'
                                    : property.location.accessibility.walkingDistance === 'moderate'
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`} />
                                <span className="font-medium">Walking Distance</span>
                              </div>
                              <p className="text-sm capitalize">
                                {property.location.accessibility.walkingDistance || 'Not specified'}
                              </p>
                            </div>
                          </div>
                        )}

                        {property.location?.coordinates && (
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <HiOutlineLocationMarker className="text-[#E83A17]" />
                              GPS Coordinates
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Latitude:</span>
                                <p className="text-gray-700">{property.location.coordinates.latitude}</p>
                              </div>
                              <div>
                                <span className="font-medium">Longitude:</span>
                                <p className="text-gray-700">{property.location.coordinates.longitude}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {property.location?.nearbyLandmarks && property.location.nearbyLandmarks.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Nearby Landmarks</h4>
                            <div className="space-y-2">
                              {property.location.nearbyLandmarks.map((landmark, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <FaMapMarkerAlt className="text-gray-500" />
                                  <span className="text-gray-700">{landmark}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="space-y-4">
                {property.metrics?.views > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FaEye className="text-blue-600" />
                      <span className="font-medium text-gray-900">Views</span>
                    </div>
                    <span className="text-blue-800 font-bold">
                      {property.metrics.views.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {property.metrics?.favorites > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FaHeart className="text-red-600" />
                      <span className="font-medium text-gray-900">Favorites</span>
                    </div>
                    <span className="text-red-800 font-bold">
                      {property.metrics.favorites}
                    </span>
                  </div>
                )}

                {property.metrics?.visits > 0 && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-green-600" />
                      <span className="font-medium text-gray-900">Visits</span>
                    </div>
                    <span className="text-green-800 font-bold">
                      {property.metrics.visits.toLocaleString()}
                    </span>
                  </div>
                )}

                {property.rating?.totalReviews > 0 && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-600" />
                      <span className="font-medium text-gray-900">Reviews</span>
                    </div>
                    <span className="text-yellow-800 font-bold">
                      {property.rating.totalReviews}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <BiCategory className="text-purple-600" />
                    <span className="font-medium text-gray-900">Category</span>
                  </div>
                  <span className="text-purple-800 font-medium capitalize">
                    {property.category?.replace('_', ' ')}
                  </span>
                </div>

                {property.location?.county && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <MdLocationCity className="text-gray-600" />
                      <span className="font-medium text-gray-900">County</span>
                    </div>
                    <span className="text-gray-800 font-medium">
                      {property.location.county}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {property.rating && Object.values(property.rating.breakdown || {}).some(v => v > 0) && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Rating Breakdown
                </h3>
                
                <div className="space-y-3">
                  {[
                    { key: 'scenery', label: 'Scenery', icon: FaCamera },
                    { key: 'safety', label: 'Safety', icon: FaShieldAlt },
                    { key: 'facilities', label: 'Facilities', icon: FaWifi },
                    { key: 'accessibility', label: 'Accessibility', icon: FaCar },
                    { key: 'value', label: 'Value for Money', icon: FaMoneyBillWave },
                    { key: 'wildlife', label: 'Wildlife', icon: FaTree }
                  ].map((item) => {
                    const rating = property.rating.breakdown?.[item.key] || 0;
                    if (rating === 0) return null;
                    
                    return (
                      <div key={item.key} className="flex items-center gap-3">
                        <item.icon className="text-gray-500 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{item.label}</span>
                            <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(rating / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-[#E83A17]" />
                Entry Fees
              </h3>
              
              {property.entryFees?.freeEntry ? (
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <MdOutlineFreeBreakfast className="text-4xl text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-semibold text-lg">Free Entry</p>
                  <p className="text-green-700 text-sm mt-1">No admission fees required</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {property.entryFees?.citizens && (
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">Citizens</h4>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <FaUsers className="text-blue-600 mx-auto mb-1" />
                          <p className="font-medium">Adult</p>
                          <p className="text-blue-800">
                            {property.entryFees.currency} {property.entryFees.citizens.adult || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <FaChild className="text-blue-600 mx-auto mb-1" />
                          <p className="font-medium">Child</p>
                          <p className="text-blue-800">
                            {property.entryFees.currency} {property.entryFees.citizens.child || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <FaGraduationCap className="text-blue-600 mx-auto mb-1" />
                          <p className="font-medium">Student</p>
                          <p className="text-blue-800">
                            {property.entryFees.currency} {property.entryFees.citizens.student || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {property.entryFees?.residents && (
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-green-900 mb-2">East African Residents</h4>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <FaUsers className="text-green-600 mx-auto mb-1" />
                          <p className="font-medium">Adult</p>
                          <p className="text-green-800">
                            {property.entryFees.currency} {property.entryFees.residents.adult || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <FaChild className="text-green-600 mx-auto mb-1" />
                          <p className="font-medium">Child</p>
                          <p className="text-green-800">
                            {property.entryFees.currency} {property.entryFees.residents.child || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <FaGraduationCap className="text-green-600 mx-auto mb-1" />
                          <p className="font-medium">Student</p>
                          <p className="text-green-800">
                            {property.entryFees.currency} {property.entryFees.residents.student || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {property.entryFees?.nonResidents && (
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-orange-900 mb-2">Non-Residents</h4>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <FaUsers className="text-orange-600 mx-auto mb-1" />
                          <p className="font-medium">Adult</p>
                          <p className="text-orange-800">
                            {property.entryFees.currency} {property.entryFees.nonResidents.adult || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <FaChild className="text-orange-600 mx-auto mb-1" />
                          <p className="font-medium">Child</p>
                          <p className="text-orange-800">
                            {property.entryFees.currency} {property.entryFees.nonResidents.child || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <FaGraduationCap className="text-orange-600 mx-auto mb-1" />
                          <p className="font-medium">Student</p>
                          <p className="text-orange-800">
                            {property.entryFees.currency} {property.entryFees.nonResidents.student || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {property.entryFees?.specialRates && property.entryFees.specialRates.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-purple-900 mb-2">Special Rates</h4>
                      <div className="space-y-2">
                        {property.entryFees.specialRates.map((rate, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{rate.category}:</span>
                            <span className="ml-2 text-purple-800">
                              {property.entryFees.currency} {rate.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaClock className="text-[#E83A17]" />
                Operating Hours
              </h3>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-blue-900 font-medium text-center">
                  {formatOperatingHours(property.operatingHours)}
                </p>
                
                {property.operatingHours?.schedule && !property.operatingHours.isAlwaysOpen && (
                  <div className="mt-4 space-y-2 text-sm">
                    {Object.entries(property.operatingHours.schedule).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center">
                        <span className="capitalize font-medium text-gray-700">{day}:</span>
                        <span className="text-blue-800">
                          {hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {property.managedBy?.contactInfo && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaPhone className="text-[#E83A17]" />
                  Contact Information
                </h3>
                
                <div className="space-y-3">
                  {property.managedBy.contactInfo.phone && (
                    <a
                      href={`tel:${property.managedBy.contactInfo.phone}`}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <FaPhone className="text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-green-700 text-sm">{property.managedBy.contactInfo.phone}</p>
                      </div>
                    </a>
                  )}
                  
                  {property.managedBy.contactInfo.email && (
                    <a
                      href={`mailto:${property.managedBy.contactInfo.email}`}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <FaEnvelope className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-blue-700 text-sm">{property.managedBy.contactInfo.email}</p>
                      </div>
                    </a>
                  )}
                  
                  {property.managedBy.contactInfo.website && (
                    <a
                      href={property.managedBy.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                      <FaGlobe className="text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <p className="text-purple-700 text-sm">Visit Official Website</p>
                      </div>
                    </a>
                  )}
                </div>

                {property.managedBy.organization && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Managed by:</span>
                      <span className="ml-1 capitalize">
                        {property.managedBy.organization.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#E83A17]" />
                Location Map
              </h3>
              <PropertyMap
                coordinates={property.location?.coordinates}
                name={property.name}
                location={property.location}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedImageModal && (
          <ImageModal
            modalData={selectedImageModal}
            onClose={() => setSelectedImageModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareModal && (
          <ShareModal onClose={() => setShowShareModal(false)} />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        <motion.button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`w-14 h-14 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 flex items-center justify-center ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart className={`text-xl ${isFavorite ? 'fill-current' : ''}`} />
        </motion.button>

        <motion.button
          onClick={() => setShowShareModal(true)}
          className="w-14 h-14 rounded-full bg-[#E83A17] text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#c53214] flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share"
        >
          <FaShare className="text-xl" />
        </motion.button>

        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 rounded-full bg-gray-800 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-gray-700 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: typeof window !== 'undefined' && window.scrollY > 300 ? 1 : 0,
            scale: typeof window !== 'undefined' && window.scrollY > 300 ? 1 : 0
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
        >
          <FaChevronLeft className="text-xl rotate-90" />
        </motion.button>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-bold text-lg text-gray-900 truncate">{property.name}</p>
            <p className="text-sm text-gray-600 truncate">{formatLocation(property.location)}</p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {property.entryFees?.freeEntry ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Free
              </span>
            ) : (
              <span className="bg-[#E83A17] text-white px-3 py-1 rounded-full text-xs font-medium">
                Fee Required
              </span>
            )}
            
            {property.rating?.overall > 0 && (
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                <FaStar className="text-xs" />
                <span className="text-xs font-medium">{property.rating.overall.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden h-20"></div>
      {/*<NearbyProperties/>*/}
    </div>
  );
};

export default PublicPropertiesDetails;
