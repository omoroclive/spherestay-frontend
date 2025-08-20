import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  FaFilter,
  FaSort,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaListUl,
  FaExpand,
  FaTimes
} from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { MdOutlineFreeBreakfast, MdLocationCity } from 'react-icons/md';
import { HiSquares2X2 } from 'react-icons/hi2';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import { useApi } from '../../hooks/useApi';

const PublicProperties = () => {
  const [publicProperties, setPublicProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const navigate = useNavigate();

  // Filter and search states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    county: searchParams.get('county') || '',
    freeEntry: searchParams.get('freeEntry') === 'true' || false,
    safetyLevel: searchParams.get('safetyLevel') || '',
    searchTerm: searchParams.get('search') || ''
  });

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const itemsPerPage = 12;

  // API call with dynamic parameters
  const apiParams = useMemo(() => ({
    limit: 100, // Fetch all for client-side filtering
    sort: '-priority,-rating.overall,-metrics.views',
    status: 'published',
    ...(filters.category && { category: filters.category }),
    ...(filters.county && { 'location.county': filters.county }),
    ...(filters.freeEntry && { 'entryFees.freeEntry': true }),
    ...(filters.safetyLevel && { 'safety.level': filters.safetyLevel }),
    ...(filters.searchTerm && { 
      $or: [
        { name: { $regex: filters.searchTerm, $options: 'i' } },
        { description: { $regex: filters.searchTerm, $options: 'i' } },
        { shortDescription: { $regex: filters.searchTerm, $options: 'i' } },
        { 'location.county': { $regex: filters.searchTerm, $options: 'i' } }
      ]
    })
  }), [filters]);

  const { data, isLoading, error } = useApi('/api/publicproperties', {
    params: apiParams
  });

  console.log('Public Properties Data:', data);

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newSearchParams.set(key, value);
    });
    if (sortBy !== 'name') newSearchParams.set('sort', sortBy);
    if (currentPage > 1) newSearchParams.set('page', currentPage.toString());
    
    setSearchParams(newSearchParams, { replace: true });
  }, [filters, sortBy, currentPage, setSearchParams]);

  useEffect(() => {
    if (data?.data?.properties) {
      setPublicProperties(data.data.properties);
    } else if (!isLoading && !error) {
      setPublicProperties([]);
    }
    if (error) {
      console.error('Error loading public properties:', error);
      setPublicProperties([]);
    }
  }, [data, isLoading, error]);

  // Client-side filtering and sorting
  useEffect(() => {
    let filtered = [...publicProperties];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.name?.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower) ||
        property.shortDescription?.toLowerCase().includes(searchLower) ||
        property.location?.county?.toLowerCase().includes(searchLower) ||
        property.location?.region?.toLowerCase().includes(searchLower) ||
        property.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(property => property.category === filters.category);
    }

    // Apply county filter
    if (filters.county) {
      filtered = filtered.filter(property => property.location?.county === filters.county);
    }

    // Apply free entry filter
    if (filters.freeEntry) {
      filtered = filtered.filter(property => property.entryFees?.freeEntry === true);
    }

    // Apply safety level filter
    if (filters.safetyLevel) {
      filtered = filtered.filter(property => property.safety?.level === filters.safetyLevel);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'rating':
          return (b.rating?.overall || 0) - (a.rating?.overall || 0);
        case 'views':
          return (b.metrics?.views || 0) - (a.metrics?.views || 0);
        case 'county':
          return (a.location?.county || '').localeCompare(b.location?.county || '');
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [publicProperties, filters, sortBy]);

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const categories = [...new Set(publicProperties.map(p => p.category).filter(Boolean))];
    const counties = [...new Set(publicProperties.map(p => p.location?.county).filter(Boolean))];
    const safetyLevels = [...new Set(publicProperties.map(p => p.safety?.level).filter(Boolean))];
    
    return { categories, counties, safetyLevels };
  }, [publicProperties]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePropertyClick = (property) => {
    navigate(`/publicPropertiesDetails/${property._id}`, {
      state: { property }
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      county: '',
      freeEntry: false,
      safetyLevel: '',
      searchTerm: ''
    });
    setSortBy('name');
  };

  const getCategoryIcon = (category) => {
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
    if (!bestVisitTime?.months || bestVisitTime.months.length === 0) return null;
    
    const months = bestVisitTime.months;
    if (months.length <= 2) return months.join(' - ');
    return `${months[0]} - ${months[months.length - 1]}`;
  };

  const ImageGallery = ({ images, propertyName }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[currentImageIndex]?.url}
          alt={images[currentImageIndex]?.caption || propertyName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <FaChevronRight className="text-sm" />
            </button>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageModal({ images, currentIndex: currentImageIndex, propertyName });
              }}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Expand images"
            >
              <FaExpand className="text-sm" />
            </button>

            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
              {currentImageIndex + 1}/{images.length}
            </div>
          </>
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
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="relative w-full max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
          <img
            src={modalData.images[currentIndex]?.url}
            alt={modalData.images[currentIndex]?.caption || modalData.propertyName}
            className="w-full h-full object-contain max-h-[80vh]"
          />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <FaTimes />
          </button>

          {modalData.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <FaChevronLeft />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <FaChevronRight />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {modalData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {modalData.images.length}
              </div>
            </>
          )}

          {modalData.images[currentIndex]?.caption && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm max-w-md text-center">
              {modalData.images[currentIndex].caption}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const PropertyCard = ({ property, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
        viewMode === 'list' ? 'flex flex-row' : ''
      }`}
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
      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3 min-h-full' : 'h-48'}`}>
        <ImageGallery images={property.images} propertyName={property.name} />
        
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
              property.safety.level === 'safe' || property.safety.level === 'very_safe'
                ? 'bg-green-500/90 text-white' 
                : property.safety.level === 'moderate'
                ? 'bg-yellow-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}>
              <FaShieldAlt className="text-xs" />
              {property.safety.level.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>

      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
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

        <div className="flex items-center justify-between mb-3">
          {property.rating?.overall > 0 && (
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500 text-sm" />
              <span className="text-sm font-medium">{property.rating.overall.toFixed(1)}</span>
              {property.rating.totalReviews > 0 && (
                <span className="text-xs text-gray-500">
                  ({property.rating.totalReviews} reviews)
                </span>
              )}
            </div>
          )}

          {getBestVisitTime(property.bestVisitTime) && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Best:</span> {getBestVisitTime(property.bestVisitTime)}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 mb-2">
          {property.operatingHours?.isAlwaysOpen ? (
            <span className="text-green-600 font-medium">Open 24/7</span>
          ) : (
            <span>Check operating hours</span>
          )}
        </div>

        {property.accessibility && (
          <div className="flex gap-2 text-xs flex-wrap">
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
            {property.accessibility.roadAccess === 'excellent' && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Road Access
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );

  if (error) {
    const errorMessage = error.message.includes('404')
      ? 'The public properties service is currently unavailable.'
      : error.message.includes('Unexpected token') || error.message.includes('non-JSON')
      ? 'The server returned an invalid response.'
      : 'Unable to connect to the server.';

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl shadow-sm text-center">
          <h3 className="text-lg font-semibold mb-2">Unable to Load Public Properties</h3>
          <p className="text-gray-700 mb-4">{errorMessage}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#E83A17] text-white px-6 py-2 rounded-lg hover:bg-[#c53214] transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/contact"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Public Properties
              </h1>
              <p className="text-gray-600">
                Discover {filteredProperties.length} amazing public destinations across Kenya
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#E83A17] text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                aria-label="Grid view"
              >
                <HiSquares2X2 />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#E83A17] text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                aria-label="List view"
              >
                <FaListUl />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E83A17] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E83A17] focus:border-transparent"
            >
              <option value="">All Categories</option>
              {filterOptions.categories.map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ')}
                </option>
              ))}
            </select>

            {/* County Filter */}
            <select
              value={filters.county}
              onChange={(e) => handleFilterChange('county', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E83A17] focus:border-transparent"
            >
              <option value="">All Counties</option>
              {filterOptions.counties.map(county => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E83A17] focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="views">Sort by Views</option>
              <option value="county">Sort by County</option>
              <option value="category">Sort by Category</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Additional Filters Row */}
          <div className="flex flex-wrap gap-2 mt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.freeEntry}
                onChange={(e) => handleFilterChange('freeEntry', e.target.checked)}
                className="rounded text-[#E83A17] focus:ring-[#E83A17]"
              />
              Free Entry Only
            </label>

            <select
              value={filters.safetyLevel}
              onChange={(e) => handleFilterChange('safetyLevel', e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E83A17] focus:border-transparent"
            >
              <option value="">All Safety Levels</option>
              {filterOptions.safetyLevels.map(level => (
                <option key={level} value={level}>
                  {level.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(12)].map((_, i) => (
              <LoadingSkeleton 
                key={i} 
                height={viewMode === 'grid' ? "400px" : "200px"} 
              />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <BiCategory className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search terms to find more destinations.
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#E83A17] text-white px-6 py-2 rounded-lg hover:bg-[#c53214] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Properties Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {paginatedProperties.map((property, index) => (
                <PropertyCard 
                  key={property._id} 
                  property={property} 
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="text-sm" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#E83A17] text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Statistics Section */}
        {filteredProperties.length > 0 && (
          <motion.div 
            className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaCoffee className="text-[#E83A17]" />
              Explore Kenya's Public Destinations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#E83A17] mb-1">
                  {filteredProperties.length}
                </div>
                <div className="text-sm text-gray-600">Total Destinations</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {filteredProperties.filter(p => p.entryFees?.freeEntry).length}
                </div>
                <div className="text-sm text-gray-600">Free Entry</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {filterOptions.counties.length}
                </div>
                <div className="text-sm text-gray-600">Counties Covered</div>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-4">
              Discover Kenya's incredible public destinations, from pristine beaches and cultural sites 
              to archaeological wonders and natural attractions. Many locations offer free entry, 
              making them perfect for budget-friendly adventures and family outings.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
                <FaShieldAlt className="text-green-500" />
                Safe & Verified
              </span>
              <span className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
                <MdOutlineFreeBreakfast className="text-green-500" />
                Many Free Locations
              </span>
              <span className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
                <FaCamera className="text-purple-500" />
                Photography Friendly
              </span>
              <span className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
                <MdLocationCity className="text-blue-500" />
                Nationwide Coverage
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImageModal && (
          <ImageModal
            modalData={selectedImageModal}
            onClose={() => setSelectedImageModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicProperties;