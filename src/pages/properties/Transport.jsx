import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaStar, FaHeart, FaSearch, FaSlidersH, FaTh, FaList, 
  FaChevronDown, FaCheckCircle, FaEye, FaShieldAlt, FaCompass, FaClock,
  FaCar, FaBus, FaMotorcycle, FaPlane, FaShip, FaUsers, FaGasPump, FaCogs
} from 'react-icons/fa';
import { GiSteeringWheel } from 'react-icons/gi';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';

const Transport = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    vehicleType: searchParams.get('vehicleType') || 'all',
    transmission: searchParams.get('transmission') || 'all',
    fuelType: searchParams.get('fuelType') || 'all',
    capacity: searchParams.get('capacity') || 'all',
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

  // Filter for transport-related properties only
  const transportProperties = useMemo(() => {
    if (!response?.data?.properties && !response?.properties && !response?.data) return [];
    const allProperties = response?.data?.properties || response?.properties || response?.data || [];
    
    // Filter for transport types: car, bus, motorcycle, plane, ship, etc.
    return allProperties.filter(property => 
      property.type === 'car' || 
      (property.category && ['transport', 'vehicle', 'rental', 'car_rental'].includes(property.category)) ||
      (property.features && property.features.some(feature => 
        ['transport', 'vehicle', 'car', 'bus', 'motorcycle'].includes(feature.toLowerCase())
      ))
    );
  }, [response]);

  // Extract unique values for filtering
  const availableTransmissions = useMemo(() => {
    const transmissions = new Set();
    transportProperties.forEach(vehicle => {
      if (vehicle.capacity?.transmission) {
        transmissions.add(vehicle.capacity.transmission);
      }
    });
    return Array.from(transmissions).sort();
  }, [transportProperties]);

  const availableFuelTypes = useMemo(() => {
    const fuelTypes = new Set();
    transportProperties.forEach(vehicle => {
      if (vehicle.capacity?.fuelType) {
        fuelTypes.add(vehicle.capacity.fuelType);
      }
    });
    return Array.from(fuelTypes).sort();
  }, [transportProperties]);

  const availableCapacities = useMemo(() => {
    const capacities = new Set();
    transportProperties.forEach(vehicle => {
      if (vehicle.capacity?.seats) {
        if (vehicle.capacity.seats <= 4) capacities.add('small');
        else if (vehicle.capacity.seats <= 7) capacities.add('medium');
        else capacities.add('large');
      }
    });
    return Array.from(capacities).sort();
  }, [transportProperties]);

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.location) params.set('location', filters.location);
    if (filters.vehicleType !== 'all') params.set('vehicleType', filters.vehicleType);
    if (filters.transmission !== 'all') params.set('transmission', filters.transmission);
    if (filters.fuelType !== 'all') params.set('fuelType', filters.fuelType);
    if (filters.capacity !== 'all') params.set('capacity', filters.capacity);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Filter and sort vehicles
  const filteredAndSortedVehicles = useMemo(() => {
    if (!Array.isArray(transportProperties)) return [];

    let filtered = transportProperties.filter(vehicle => {
      // Only show approved properties
      if (vehicle.status !== 'approved') return false;

      // Search filter
      if (filters.search && 
          !vehicle.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !vehicle.description?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !vehicle.businessName?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Location filter
      if (filters.location && 
          !vehicle.location?.county?.toLowerCase().includes(filters.location.toLowerCase()) &&
          !vehicle.location?.city?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Transmission filter
      if (filters.transmission !== 'all' && vehicle.capacity?.transmission !== filters.transmission) {
        return false;
      }

      // Fuel type filter
      if (filters.fuelType !== 'all' && vehicle.capacity?.fuelType !== filters.fuelType) {
        return false;
      }

      // Capacity filter
      if (filters.capacity !== 'all') {
        const seats = vehicle.capacity?.seats || 0;
        if (filters.capacity === 'small' && seats > 4) return false;
        if (filters.capacity === 'medium' && (seats <= 4 || seats > 7)) return false;
        if (filters.capacity === 'large' && seats <= 7) return false;
      }

      // Rating filter
      if (filters.rating > 0 && (vehicle.rating?.overall || 0) < filters.rating) {
        return false;
      }

      return true;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating?.overall || 0) - (a.rating?.overall || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'popular':
          return (b.metrics?.views || 0) - (a.metrics?.views || 0);
        case 'price_low':
          return (a.pricing?.basePrice || 0) - (b.pricing?.basePrice || 0);
        case 'price_high':
          return (b.pricing?.basePrice || 0) - (a.pricing?.basePrice || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return filtered;
  }, [transportProperties, filters, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredAndSortedVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleWishlistToggle = (vehicleId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vehicleId)) {
        newSet.delete(vehicleId);
        toast.success('Removed from wishlist');
      } else {
        newSet.add(vehicleId);
        toast.success('Added to wishlist');
      }
      return newSet;
    });
  };

  const formatPrice = (price, currency = 'KES', unit = 'day') => {
    const formattedPrice = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(price || 0);
    return `${formattedPrice}/${unit}`;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      vehicleType: 'all',
      transmission: 'all',
      fuelType: 'all',
      capacity: 'all',
      rating: 0
    });
    setSearchParams(new URLSearchParams());
  };

  const getVehicleIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'car':
        return <FaCar />;
      case 'bus':
        return <FaBus />;
      case 'motorcycle':
        return <FaMotorcycle />;
      case 'plane':
        return <FaPlane />;
      case 'ship':
        return <FaShip />;
      default:
        return <FaCar />;
    }
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
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">Unable to load transport options. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="bg-[#E83A17] text-white px-6 py-3 rounded-lg hover:bg-[#c53214] transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-[#E83A17] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Perfect Ride
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                Explore Kenya with reliable, comfortable transport options
              </p>

              {/* Search Bar */}
              <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search vehicles..."
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
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                  >
                    <option value="all">All Transmissions</option>
                    {availableTransmissions.map(transmission => (
                      <option key={transmission} value={transmission}>
                        {transmission.charAt(0).toUpperCase() + transmission.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                  >
                    <option value="all">All Fuel Types</option>
                    {availableFuelTypes.map(fuelType => (
                      <option key={fuelType} value={fuelType}>
                        {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-[#E83A17] text-white px-6 py-4 rounded-xl hover:bg-[#c53214] transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    <FaSlidersH />
                    <span>More Filters</span>
                  </button>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Capacity
                          </label>
                          <select
                            value={filters.capacity}
                            onChange={(e) => handleFilterChange('capacity', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                          >
                            <option value="all">Any Size</option>
                            <option value="small">Small (1-4 seats)</option>
                            <option value="medium">Medium (5-7 seats)</option>
                            <option value="large">Large (8+ seats)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Rating
                          </label>
                          <select
                            value={filters.rating}
                            onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                          >
                            <option value={0}>Any Rating</option>
                            <option value={1}>1+ Stars</option>
                            <option value={2}>2+ Stars</option>
                            <option value={3}>3+ Stars</option>
                            <option value={4}>4+ Stars</option>
                            <option value={5}>5 Stars</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                          >
                            <option value="featured">Featured</option>
                            <option value="rating">Highest Rated</option>
                            <option value="popular">Most Popular</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="newest">Newest</option>
                            <option value="alphabetical">A-Z</option>
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={clearFilters}
                            className="w-full bg-gray-500 text-white px-4 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Results Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {filteredAndSortedVehicles.length} vehicles available
              </h2>
              <p className="text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedVehicles.length)} of {filteredAndSortedVehicles.length} results
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-white rounded-lg shadow-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-l-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-[#E83A17] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-r-lg transition-colors ${
                    viewMode === 'list' ? 'bg-[#E83A17] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.search || filters.location || filters.transmission !== 'all' || filters.fuelType !== 'all' || filters.capacity !== 'all' || filters.rating > 0) && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Search: "{filters.search}"
                    <button onClick={() => handleFilterChange('search', '')}>×</button>
                  </span>
                )}
                {filters.location && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Location: {filters.location}
                    <button onClick={() => handleFilterChange('location', '')}>×</button>
                  </span>
                )}
                {filters.transmission !== 'all' && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {filters.transmission}
                    <button onClick={() => handleFilterChange('transmission', 'all')}>×</button>
                  </span>
                )}
                {filters.fuelType !== 'all' && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {filters.fuelType}
                    <button onClick={() => handleFilterChange('fuelType', 'all')}>×</button>
                  </span>
                )}
                {filters.capacity !== 'all' && (
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {filters.capacity}
                    <button onClick={() => handleFilterChange('capacity', 'all')}>×</button>
                  </span>
                )}
                {filters.rating > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {filters.rating}+ Stars
                    <button onClick={() => handleFilterChange('rating', 0)}>×</button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Results Grid/List */}
          {paginatedVehicles.length > 0 ? (
            <motion.div
              layout
              className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                : 'space-y-6'
              }
            >
              <AnimatePresence>
                {paginatedVehicles.map((vehicle, index) => (
                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    viewMode={viewMode}
                    isWishlisted={wishlistedItems.has(vehicle._id)}
                    toggleWishlist={handleWishlistToggle}
                    formatPrice={formatPrice}
                    getVehicleIcon={getVehicleIcon}
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
                <FaCar className="text-6xl text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No vehicles found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria to find more transport options.
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
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#E83A17] text-white'
                          : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Vehicle Card Component
const VehicleCard = ({ vehicle, viewMode, isWishlisted, toggleWishlist, formatPrice, getVehicleIcon, index }) => {
  const navigate = useNavigate();
  const mainImage = vehicle.images?.[0]?.url || '/images/vehicle-placeholder.jpg';

  const handleCardClick = () => {
    navigate(`/properties/${vehicle._id}`);
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
          <div className="relative md:w-1/3">
            <img
              src={mainImage}
              alt={vehicle.title}
              className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <button
              onClick={(e) => toggleWishlist(vehicle._id, e)}
              className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
                isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <FaHeart size={16} />
            </button>
          </div>

          <div className="p-6 md:w-2/3">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <span className="text-[#E83A17]">{getVehicleIcon(vehicle.type)}</span>
                  <span className="capitalize">{vehicle.type}</span>
                  <span>•</span>
                  <FaMapMarkerAlt className="text-[#E83A17]" />
                  <span>{vehicle.location?.county}</span>
                </div>
              </div>
              {vehicle.rating?.overall > 0 && (
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span className="font-medium text-sm">{vehicle.rating.overall.toFixed(1)}</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{vehicle.description}</p>

            {/* Vehicle Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {vehicle.capacity?.seats && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="text-[#E83A17]" />
                  <span>{vehicle.capacity.seats} seats</span>
                </div>
              )}
              {vehicle.capacity?.transmission && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCogs className="text-[#E83A17]" />
                  <span className="capitalize">{vehicle.capacity.transmission}</span>
                </div>
              )}
              {vehicle.capacity?.fuelType && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaGasPump className="text-[#E83A17]" />
                  <span className="capitalize">{vehicle.capacity.fuelType}</span>
                </div>
              )}
              {vehicle.businessName && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GiSteeringWheel className="text-[#E83A17]" />
                  <span>{vehicle.businessName}</span>
                </div>
              )}
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {vehicle.features.slice(0, 3).map(feature => (
                  <span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {feature.replace(/_/g, ' ')}
                  </span>
                ))}
                {vehicle.features.length > 3 && (
                  <span className="text-gray-500 text-xs">+{vehicle.features.length - 3} more</span>
                )}
              </div>
            )}

            {/* Pricing */}
            <div className="text-[#E83A17] font-semibold">
              {formatPrice(vehicle.pricing?.basePrice, vehicle.pricing?.currency, vehicle.pricing?.priceUnit)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={mainImage}
          alt={vehicle.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <button
          onClick={(e) => toggleWishlist(vehicle._id, e)}
          className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
          }`}
        >
          <FaHeart size={16} />
        </button>
        
        {/* Vehicle type badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span className="text-[#E83A17]">{getVehicleIcon(vehicle.type)}</span>
          {vehicle.type?.replace(/_/g, ' ')}
        </div>

        {/* Featured badge */}
        {vehicle.featured && (
          <div className="absolute bottom-4 left-4 bg-[#E83A17] text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 flex-1">{vehicle.title}</h3>
          {vehicle.rating?.overall > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <FaStar className="text-yellow-400" />
              <span className="font-medium text-sm">{vehicle.rating.overall.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <FaMapMarkerAlt className="text-[#E83A17] text-sm" />
          <span className="text-sm">{vehicle.location?.county}</span>
          {vehicle.metrics?.views > 0 && (
            <>
              <span>•</span>
              <FaEye className="text-gray-400 text-sm" />
              <span className="text-sm">{vehicle.metrics.views} views</span>
            </>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vehicle.description}</p>

        {/* Vehicle Specs - Compact */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
          {vehicle.capacity?.seats && (
            <div className="flex items-center gap-1">
              <FaUsers className="text-[#E83A17]" />
              <span>{vehicle.capacity.seats} seats</span>
            </div>
          )}
          {vehicle.capacity?.transmission && (
            <div className="flex items-center gap-1">
              <FaCogs className="text-[#E83A17]" />
              <span className="capitalize">{vehicle.capacity.transmission}</span>
            </div>
          )}
          {vehicle.capacity?.fuelType && (
            <div className="flex items-center gap-1">
              <FaGasPump className="text-[#E83A17]" />
              <span className="capitalize">{vehicle.capacity.fuelType}</span>
            </div>
          )}
          {vehicle.businessName && (
            <div className="flex items-center gap-1">
              <GiSteeringWheel className="text-[#E83A17]" />
              <span className="truncate">{vehicle.businessName}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {vehicle.features.slice(0, 2).map(feature => (
              <span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                {feature.replace(/_/g, ' ')}
              </span>
            ))}
            {vehicle.features.length > 2 && (
              <span className="text-gray-500 text-xs">+{vehicle.features.length - 2}</span>
            )}
          </div>
        )}

        {/* Pricing and Availability */}
        <div className="flex items-center justify-between">
          <div className="text-[#E83A17] font-semibold text-sm">
            {formatPrice(vehicle.pricing?.basePrice, vehicle.pricing?.currency, vehicle.pricing?.priceUnit)}
          </div>
          
          {/* Availability status */}
          {vehicle.availability?.isAvailable && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <FaCheckCircle />
              <span>Available</span>
            </div>
          )}
        </div>

        {/* Business info */}
        {vehicle.businessName && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <span>by {vehicle.businessName}</span>
            {vehicle.verificationStatus === 'verified' && (
              <FaShieldAlt className="text-green-500" title="Verified business" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(Transport);