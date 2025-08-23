import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaStar,
  FaHeart
} from 'react-icons/fa';
import { GiKenya } from 'react-icons/gi';

const PropertyCard = ({ property, lazyLoadImages = true, className = '' }) => {
  // Calculate price display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: property.pricing?.currency || 'KES',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // Determine price unit display
  const getPriceUnit = () => {
    switch (property.pricing?.priceUnit) {
      case 'night': return '/night';
      case 'day': return '/day';
      case 'week': return '/week';
      case 'month': return '/month';
      case 'person': return '/person';
      case 'group': return '/group';
      default: return '';
    }
  };

  // Cloudinary optimizer
  const optimizeImage = (url, width = 800) => {
    if (!url || !url.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  };

  // Get first image or placeholder
  const mainImage = property.images?.[0]?.url 
    ? optimizeImage(property.images[0].url, 800)
    : '/images/property-placeholder.jpg';

  // Handle wishlist toggle (placeholder for future implementation)
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    console.log(`Toggling wishlist for property: ${property._id}`);
    // Add actual wishlist logic here (e.g., API call or localStorage update)
  };

  return (
    <motion.div 
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        to={`/properties/${property._id}`} 
        className="block"
        aria-label={`View ${property.title || 'Property'} in ${property.location?.city || 'Unknown'}`}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {lazyLoadImages ? (
            <img
              src={mainImage}
              alt={`${property.title || 'Property'} in ${property.location?.city || 'Unknown'}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <img
              src={mainImage}
              alt={`${property.title || 'Property'} in ${property.location?.city || 'Unknown'}`}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-3 left-3 bg-[#E83A17] text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
          
          {/* Wishlist Button */}
          <button 
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            onClick={handleWishlistToggle}
            aria-label={`Add ${property.title || 'property'} to wishlist`}
          >
            <FaHeart className="text-gray-600 hover:text-[#E83A17]" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Price */}
          <div className="flex justify-between items-start mb-2">
            <div aria-label={`Price: ${formatPrice(property.pricing?.basePrice)} ${getPriceUnit()}`}>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(property.pricing?.basePrice)}
              </span>
              <span className="text-gray-500 ml-1">
                {getPriceUnit()}
              </span>
            </div>
            
            {/* Rating */}
            {property.rating?.overall > 0 && (
              <div 
                className="flex items-center bg-gray-100 px-2 py-1 rounded"
                aria-label={`Rating: ${property.rating.overall.toFixed(1)} out of 5`}
              >
                <FaStar className="text-[#FFC72C] mr-1" />
                <span className="text-sm font-medium">
                  {property.rating.overall.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {property.title || 'Unnamed Property'}
          </h3>

          {/* Business Name */}
          {property.businessName && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
              by {property.businessName}
            </p>
          )}

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <FaMapMarkerAlt className="mr-1 text-[#E83A17]" />
            <span className="line-clamp-1">
              {property.location?.city || 'Unknown'}, {property.location?.county || 'Unknown'}
            </span>
          </div>

          {/* Property Features */}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
            {property.capacity?.bedrooms > 0 && (
              <div className="flex items-center text-sm text-gray-600" aria-label={`${property.capacity.bedrooms} bedrooms`}>
                <FaBed className="mr-1 text-[#006644]" />
                <span>{property.capacity.bedrooms} {property.capacity.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
              </div>
            )}
            
            {property.capacity?.bathrooms > 0 && (
              <div className="flex items-center text-sm text-gray-600" aria-label={`${property.capacity.bathrooms} bathrooms`}>
                <FaBath className="mr-1 text-[#006644]" />
                <span>{property.capacity.bathrooms} {property.capacity.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
              </div>
            )}
          </div>

          {/* Property Type Badge */}
          <div className="mt-3">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {property.type
                ? property.type === 'villa' ? 'Beach Villa' : 
                  property.type === 'hotel' ? 'Hotel' : 
                  property.type.charAt(0).toUpperCase() + property.type.slice(1)
                : 'Unknown'}
            </span>
          </div>

          {/* Kenyan Flag for Local Properties */}
          {property.location?.county && (
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <GiKenya className="mr-1 text-[#006644]" />
              <span>Kenyan Property</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(PropertyCard);
