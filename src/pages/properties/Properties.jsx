import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaStar, 
  FaHeart, 
  FaUsers,
  FaSearch,
  FaFilter,
  FaSort,
  FaTh,
  FaList,
  FaChevronDown,
  FaWifi,
  FaSnowflake,
  FaConciergeBell,
  FaCheckCircle,
  FaEye,
  FaShieldAlt,
  FaTimes,
  FaMapMarkedAlt,
  FaSlidersH
} from 'react-icons/fa';
import { GiKenya } from 'react-icons/gi';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';

const PremiumProperties = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || 'all',
    priceRange: [0, 100000],
    minBedrooms: 0,
    minBathrooms: 0,
    amenities: [],
    availability: 'all',
    rating: 0
  });
  
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistedItems, setWishlistedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch properties data
  const { data: response, isLoading, error, refetch } = useApi('/api/properties');
  const properties = response?.data || [];
  console.log("Properties:", properties);

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.location) params.set('location', filters.location);
    if (filters.type !== 'all') params.set('type', filters.type);
    setSearchParams(params);
  }, [filters.search, filters.location, filters.type, setSearchParams]);

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Search filter
      if (filters.search && !property.title?.toLowerCase().includes(filters.search.toLowerCase()) && 
          !property.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Location filter
      if (filters.location && !property.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) &&
          !property.location?.county?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (filters.type !== 'all' && property.type !== filters.type) {
        return false;
      }
      
      // Price range filter
      const price = property.pricing?.basePrice || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }
      
      // Bedroom filter
      if (filters.minBedrooms > 0 && (property.capacity?.bedrooms || 0) < filters.minBedrooms) {
        return false;
      }
      
      // Bathroom filter
      if (filters.minBathrooms > 0 && (property.capacity?.bathrooms || 0) < filters.minBathrooms) {
        return false;
      }
      
      // Rating filter
      if (filters.rating > 0 && (property.rating?.overall || 0) < filters.rating) {
        return false;
      }
      
      // Amenities filter
      if (filters.amenities.length > 0) {
        const propertyAmenities = property.amenities?.map(a => a.name?.toLowerCase()) || [];
        const hasAllAmenities = filters.amenities.every(amenity => 
          propertyAmenities.includes(amenity.toLowerCase())
        );
        if (!hasAllAmenities) return false;
      }
      
      return true;
    });

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.pricing?.basePrice || 0) - (b.pricing?.basePrice || 0);
        case 'price-high':
          return (b.pricing?.basePrice || 0) - (a.pricing?.basePrice || 0);
        case 'rating':
          return (b.rating?.overall || 0) - (a.rating?.overall || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'popular':
          return (b.metrics?.views || 0) - (a.metrics?.views || 0);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return filtered;
  }, [properties, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProperties.length / itemsPerPage);
  const paginatedProperties = filteredAndSortedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
        toast.success('Removed from wishlist');
      } else {
        newSet.add(propertyId);
        toast.success('Added to wishlist');
      }
      return newSet;
    });
  };

  // Format price
  const formatPrice = (price, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // Get property type display name
  const getTypeDisplayName = (type) => {
    const typeMap = {
      villa: 'Villa',
      hotel: 'Hotel', 
      apartment: 'Apartment',
      house: 'House',
      resort: 'Resort'
    };
    return typeMap[type] || type?.charAt(0).toUpperCase() + type?.slice(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: 'all',
      priceRange: [0, 100000],
      minBedrooms: 0,
      minBathrooms: 0,
      amenities: [],
      availability: 'all',
      rating: 0
    });
    setSearchParams(new URLSearchParams());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <LoadingSkeleton height="200px" />
                <div className="p-4">
                  <LoadingSkeleton height="20px" className="mb-2" />
                  <LoadingSkeleton height="16px" className="mb-2" />
                  <LoadingSkeleton height="16px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Properties</h2>
            <p className="text-gray-600 mb-6">Unable to load properties. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="bg-[#E83A17] text-white px-6 py-3 rounded-lg hover:bg-[#c53214] transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#006644] via-[#007d52] to-[#E83A17] text-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Discover Kenya's Finest Properties
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                From luxury beachfront villas to mountain retreats, find your perfect Kenyan getaway
              </p>
              
              {/* Search Bar */}
              <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Location..."
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                    />
                  </div>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                  >
                    <option value="all">All Types</option>
                    <option value="villa">Villa</option>
                    <option value="hotel">Hotel</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                  </select>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-[#E83A17] text-white px-6 py-4 rounded-xl hover:bg-[#c53214] transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    <FaSlidersH />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-b border-gray-200 shadow-lg"
            >
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>KES 0</span>
                        <span>{formatPrice(filters.priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Min Bedrooms</label>
                    <select
                      value={filters.minBedrooms}
                      onChange={(e) => handleFilterChange('minBedrooms', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent"
                    >
                      <option value={0}>Any</option>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}+</option>
                      ))}
                    </select>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Min Bathrooms</label>
                    <select
                      value={filters.minBathrooms}
                      onChange={(e) => handleFilterChange('minBathrooms', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent"
                    >
                      <option value={0}>Any</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}+</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Min Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={3}>3+ Stars</option>
                      <option value={4}>4+ Stars</option>
                      <option value={4.5}>4.5+ Stars</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Clear all filters
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="bg-[#006644] text-white px-6 py-3 rounded-xl hover:bg-[#004d33] transition-all duration-300"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {filteredAndSortedProperties.length} properties found
              </h2>
              <p className="text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedProperties.length)} of {filteredAndSortedProperties.length} results
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-[#E83A17] shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white text-[#E83A17] shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaList />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#E83A17] focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Property Grid/List */}
          {paginatedProperties.length > 0 ? (
            <motion.div
              layout
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                  : 'space-y-6'
              }
            >
              <AnimatePresence>
                {paginatedProperties.map((property, index) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    viewMode={viewMode}
                    isWishlisted={wishlistedItems.has(property._id)}
                    onWishlistToggle={handleWishlistToggle}
                    formatPrice={formatPrice}
                    getTypeDisplayName={getTypeDisplayName}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <FaSearch className="text-6xl text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No properties found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria to find more properties.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#E83A17] text-white px-6 py-3 rounded-lg hover:bg-[#c53214] transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                    currentPage === i + 1
                      ? 'bg-[#E83A17] text-white border-[#E83A17]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Property Card Component
const PropertyCard = ({ 
  property, 
  viewMode, 
  isWishlisted, 
  onWishlistToggle, 
  formatPrice, 
  getTypeDisplayName,
  index 
}) => {
  const navigate = useNavigate();
  const mainImage = property.images?.find(img => img.isMain)?.url || 
                   property.images?.[0]?.url || 
                   '/images/property-placeholder.jpg';

  const handleCardClick = () => {
    navigate(`/properties/${property._id}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group"
        onClick={handleCardClick}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative">
            <div className="aspect-[4/3] md:h-64 overflow-hidden">
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {property.featured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Featured
                </span>
              )}
              {property.verificationStatus === 'verified' && (
                <span className="bg-[#006644] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <FaShieldAlt size={10} />
                  Verified
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={(e) => onWishlistToggle(property._id, e)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
              }`}
            >
              <FaHeart size={16} />
            </button>
          </div>

          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {getTypeDisplayName(property.type)}
                </span>
                {property.rating?.overall > 0 && (
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium">{property.rating.overall.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({property.rating.totalReviews})</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E83A17] transition-colors duration-300">
                {property.title}
              </h3>
              
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <FaMapMarkerAlt className="text-[#E83A17] flex-shrink-0" />
                <span className="line-clamp-1">{property.location?.city}, {property.location?.county}</span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaBed className="text-[#006644]" />
                  <span>{property.capacity?.bedrooms || 0} beds</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaBath className="text-[#006644]" />
                  <span>{property.capacity?.bathrooms || 0} baths</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="text-[#006644]" />
                  <span>{property.capacity?.maxGuests || 0} guests</span>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                      <FaCheckCircle size={10} />
                      {amenity.name}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{property.amenities.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(property.pricing?.basePrice, property.pricing?.currency)}
                </span>
                <span className="text-gray-600 ml-1">
                  /{property.pricing?.priceUnit || 'night'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaEye />
                <span>{property.metrics?.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {property.featured && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ⭐ Featured
            </span>
          )}
          {property.verificationStatus === 'verified' && (
            <span className="bg-[#006644] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <FaShieldAlt size={10} />
              Verified
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => onWishlistToggle(property._id, e)}
          className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <FaHeart size={16} />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(property.pricing?.basePrice, property.pricing?.currency)}
          </div>
          <div className="text-sm text-gray-600 text-center">
            /{property.pricing?.priceUnit || 'night'}
          </div>
        </div>

        {/* Image Counter */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            1/{property.images.length}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {getTypeDisplayName(property.type)}
          </span>
          {property.rating?.overall > 0 && (
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="font-medium text-sm">{property.rating.overall.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({property.rating.totalReviews})</span>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E83A17] transition-colors duration-300">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <FaMapMarkerAlt className="text-[#E83A17] flex-shrink-0" />
          <span className="line-clamp-1 text-sm">{property.location?.city}, {property.location?.county}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FaBed className="text-[#006644]" />
            <span>{property.capacity?.bedrooms || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FaBath className="text-[#006644]" />
            <span>{property.capacity?.bathrooms || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FaUsers className="text-[#006644]" />
            <span>{property.capacity?.maxGuests || 0}</span>
          </div>
        </div>

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 2).map((amenity, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                <FaCheckCircle size={8} />
                {amenity.name}
              </span>
            ))}
            {property.amenities.length > 2 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{property.amenities.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Features */}
        {property.features?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCheckCircle className="text-[#006644]" />
              <span className="line-clamp-1">{property.features[0]}</span>
            </div>
            {property.features.length > 1 && (
              <span className="text-xs text-gray-500 ml-6">+{property.features.length - 1} more features</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FaEye />
            <span>{property.metrics?.views || 0} views</span>
          </div>
          <div className="flex items-center gap-1">
            <GiKenya className="text-[#006644]" />
            <span>Kenya</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(PremiumProperties);