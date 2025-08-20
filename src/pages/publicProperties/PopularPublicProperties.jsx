import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
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
  FaShieldAlt
} from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { MdOutlineFreeBreakfast } from 'react-icons/md';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import { useApi } from '../../hooks/useApi';

const PopularPublicProperties = () => {
  const [publicProperties, setPublicProperties] = useState([]);
  const navigate = useNavigate();

  // Use useApi hook to fetch public properties
  const { data, isLoading, error } = useApi('/api/publicproperties', {
    params: { 
      limit: 6, 
      sort: '-metrics.views,-rating.overall', 
      status: 'published'
    }
  });

  useEffect(() => {
    // Log for debugging
    console.log('useApi Response:', { data, isLoading, error });

    // Update publicProperties when data.data.properties is available
    if (data && data.data && data.data.properties) {
      console.log('Setting publicProperties:', data.data.properties);
      setPublicProperties(data.data.properties);
    } else if (!isLoading && !error) {
      // If data is null/undefined and not loading, set to empty array
      console.log('No properties available, setting empty array');
      setPublicProperties([]);
    }

    // Handle errors
    if (error) {
      console.error('Error from useApi:', error.message);
      if (error.message.includes('Unexpected token')) {
        console.error('Non-JSON response detected. Check server configuration for /api/publicproperties');
      }
      setPublicProperties([]); // Ensure no stale data on error
    }
  }, [data, isLoading, error]);

  const handlePropertyClick = (property) => {
    navigate(`/publicPropertiesDetails/${property._id}`, {
      state: { property }
    });
  };

  const handleViewAll = () => {
    navigate('/public-properties');
  };

  const getCategoryIcon = (category, subCategory) => {
    const iconClass = "text-2xl";
    
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
    const iconClass = "text-sm";
    
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
      default:
        return null;
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
    if (!bestVisitTime || !bestVisitTime.months) return null;
    
    const months = bestVisitTime.months;
    if (months.length <= 2) return months.join(' - ');
    return `${months[0]} - ${months[months.length - 1]}`;
  };

  if (error) {
    const errorMessage = error.message.includes('404')
      ? 'The public properties service is currently unavailable. Try exploring our popular destinations.'
      : error.message.includes('Unexpected token') || error.message.includes('non-JSON')
      ? 'The server returned an invalid response. Please try again or contact support.'
      : 'Unable to connect to the server. Please try again later or contact support.';

    return (
      <section className="container mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl shadow-sm text-center">
          <h3 className="text-lg font-semibold mb-2">Unable to Load Public Properties</h3>
          <p className="text-gray-700 mb-4">{errorMessage}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#E83A17] text-white px-6 py-2 rounded-lg hover:bg-[#c53214] transition-colors"
              aria-label="Retry loading public properties"
            >
              Try Again
            </button>
            <Link
              to="/contact"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              aria-label="Contact support for assistance"
            >
              Contact Support
            </Link>
            <Link
              to="/search?category=public"
              className="bg-[#006644] text-white px-6 py-2 rounded-lg hover:bg-[#005533] transition-colors"
              aria-label="Explore other public destinations"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12" aria-labelledby="popular-public-properties-heading">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 id="popular-public-properties-heading" className="text-2xl font-bold text-gray-900 mb-2">
            Popular Public Destinations
          </h2>
          <p className="text-gray-600">
            Discover Kenya's most visited public attractions and natural wonders
          </p>
        </div>
        <button
          onClick={handleViewAll}
          className="text-[#E83A17] hover:underline font-medium"
          aria-label="View all public properties"
        >
          View All
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} height="400px" />
          ))}
        </div>
      ) : publicProperties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BiCategory className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Public Properties Available</h3>
          <p className="text-gray-500">Check back later for exciting public destinations!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicProperties.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
              onClick={() => handlePropertyClick(property)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${property.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePropertyClick(property);
                }
              }}
            >
              <div className="relative h-48 overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images.find(img => img.isPrimary)?.url || property.images[0]?.url}
                    alt={property.images.find(img => img.isPrimary)?.caption || property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    {getCategoryIcon(property.category, property.subCategory)}
                  </div>
                )}
                
                <div className="absolute top-3 left-3">
                  {property.entryFees?.freeEntry ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <MdOutlineFreeBreakfast className="text-sm" />
                      Free Entry
                    </span>
                  ) : (
                    <span className="bg-[#E83A17] text-white px-2 py-1 rounded-full text-xs font-medium">
                      Entry Fee Required
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {property.metrics?.views > 0 && (
                    <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <FaEye className="text-xs" />
                      {property.metrics.views > 1000 ? `${(property.metrics.views/1000).toFixed(1)}k` : property.metrics.views}
                    </span>
                  )}
                  {property.metrics?.favorites > 0 && (
                    <span className="bg-red-500/80 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <FaHeart className="text-xs" />
                      {property.metrics.favorites}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {property.category?.replace('_', ' ') || 'Attraction'}
                  </span>
                </div>

                {property.safety?.level && (
                  <div className="absolute bottom-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${
                      property.safety.level === 'safe' 
                        ? 'bg-green-500/90 text-white' 
                        : property.safety.level === 'moderate'
                        ? 'bg-yellow-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}>
                      <FaShieldAlt className="text-xs" />
                      {property.safety.level}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1">
                    {property.name}
                  </h3>
                  {property.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <FaMapMarkerAlt className="text-[#E83A17] text-sm mr-1 flex-shrink-0" />
                  <span className="text-sm truncate">{formatLocation(property.location)}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {property.shortDescription || property.description}
                </p>

                {property.features?.activities && property.features.activities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.activities.slice(0, 3).map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700">
                        {getActivityIcon(activity)}
                        <span className="capitalize">{activity.replace('_', ' ')}</span>
                      </div>
                    ))}
                    {property.features.activities.length > 3 && (
                      <span className="bg-gray-200 px-2 py-1 rounded-full text-xs text-gray-600">
                        +{property.features.activities.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {property.rating?.overall > 0 && (
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-500 text-sm" />
                      <span className="text-sm font-medium">{property.rating.overall.toFixed(1)}</span>
                      {property.rating.totalReviews > 0 && (
                        <span className="text-xs text-gray-500">
                          ({property.rating.totalReviews} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {getBestVisitTime(property.bestVisitTime) && (
                  <div className="text-xs text-gray-500 mb-2">
                    <span className="font-medium">Best time:</span> {getBestVisitTime(property.bestVisitTime)}
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  {property.operatingHours?.isAlwaysOpen ? (
                    <span className="text-green-600 font-medium">Open 24/7</span>
                  ) : (
                    <span>Check operating hours</span>
                  )}
                </div>

                {property.accessibility && (
                  <div className="mt-2 flex gap-2 text-xs">
                    {property.accessibility.publicTransport && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Public Transport
                      </span>
                    )}
                    {property.accessibility.walkingDistance === 'easy' && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Easy Walk
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {publicProperties.length > 0 && (
        <motion.div 
          className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FaCoffee className="text-[#E83A17]" />
            Planning Your Visit?
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            Most public destinations in Kenya offer the best experience during the dry season (October to March). 
            Many locations offer free entry, making them perfect for budget-friendly adventures.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <FaShieldAlt className="text-green-500" />
              Safe destinations verified
            </span>
            <span className="flex items-center gap-1">
              <MdOutlineFreeBreakfast className="text-green-500" />
              Many free entry locations
            </span>
            <span className="flex items-center gap-1">
              <FaCamera className="text-purple-500" />
              Photography friendly
            </span>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default PopularPublicProperties;