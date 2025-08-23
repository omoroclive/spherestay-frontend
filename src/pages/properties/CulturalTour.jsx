import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaHeart, FaSearch, FaSlidersH, FaTh, FaList, FaChevronDown, FaCheckCircle, FaEye, FaShieldAlt, FaMapMarkedAlt } from 'react-icons/fa';
import { GiKenya } from 'react-icons/gi';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';

const CulturalTour = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    activity: searchParams.get('activity') || 'all',
    rating: 0
  });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistedItems, setWishlistedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch public properties data
  const { data: response, isLoading, error, refetch } = useApi('/api/publicproperties');

  // ✅ Fix: Extract the array from the response properly
  const sites = response?.data?.properties || response?.properties || response?.data || [];
  
  console.log("API Response:", response);
  console.log("Extracted Sites Array:", sites);
  console.log("Is sites an array?", Array.isArray(sites));

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.location) params.set('location', filters.location);
    if (filters.activity !== 'all') params.set('activity', filters.activity);
    setSearchParams(params);
  }, [filters.search, filters.location, filters.activity, setSearchParams]);

  // Filter and sort sites
  const filteredAndSortedSites = useMemo(() => {
    // ✅ Safety check: Ensure sites is an array before filtering
    if (!Array.isArray(sites)) {
      console.warn("Sites is not an array:", sites);
      return [];
    }

    let filtered = sites.filter(site => {
      // Category filter - assume we filter for cultural sites
      if (site.category !== 'cultural_site') return false;

      // Search filter
      if (filters.search && 
          !site.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !site.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Location filter
      if (filters.location && 
          !site.location?.county?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Activity filter
      if (filters.activity !== 'all' && 
          !site.features?.activities?.includes(filters.activity)) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && (site.rating?.overall || 0) < filters.rating) {
        return false;
      }

      return true;
    });

    // Sort sites
    filtered.sort((a, b) => {
      switch (sortBy) {
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
  }, [sites, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSites.length / itemsPerPage);
  const paginatedSites = filteredAndSortedSites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (siteId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(siteId)) {
        newSet.delete(siteId);
        toast.success('Removed from wishlist');
      } else {
        newSet.add(siteId);
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

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      activity: 'all',
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
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">Unable to load cultural tours. Please try again.</p>
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

  // ✅ Add debug information when sites is not an array
  if (!Array.isArray(sites)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Data Format Issue</h2>
            <p className="text-gray-600 mb-4">The API returned data in an unexpected format.</p>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm mb-4">
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
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
                Discover Cultural Tours
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                Explore rich cultural sites and experiences
              </p>

              {/* Search Bar */}
              <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search cultural tours..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="County..."
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                    />
                  </div>

                  <select
                    value={filters.activity}
                    onChange={(e) => handleFilterChange('activity', e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                  >
                    <option value="all">All Activities</option>
                    <option value="photography">Photography</option>
                    <option value="cultural_tours">Cultural Tours</option>
                    <option value="hiking">Hiking</option>
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
                {filteredAndSortedSites.length} cultural tours found
              </h2>
              <p className="text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedSites.length)} of {filteredAndSortedSites.length} results
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
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Site Grid/List */}
          {paginatedSites.length > 0 ? (
            <motion.div
              layout
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                  : 'space-y-6'
              }
            >
              <AnimatePresence>
                {paginatedSites.map((site, index) => (
                  <SiteCard
                    key={site._id}
                    site={site}
                    viewMode={viewMode}
                    isWishlisted={wishlistedItems.has(site._id)}
                    toggleWishlist={handleWishlistToggle}
                    formatPrice={formatPrice}
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No cultural tours found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria to find more tours.
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

// Site Card Component
const SiteCard = ({ site, viewMode, isWishlisted, toggleWishlist, formatPrice, index }) => {
  const navigate = useNavigate();

  const mainImage = site.images?.find(img => img.isMain)?.url || 
                   site.images?.[0]?.url || 
                   '/images/site-placeholder.jpg';

  const handleCardClick = () => {
    navigate(`/publicPropertiesDetails/${site._id}`);
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
                alt={site.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {site.featured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Featured
                </span>
              )}
              {site.status === 'published' && (
                <span className="bg-[#006644] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <FaShieldAlt size={10} />
                  Published
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={(e) => toggleWishlist(site._id, e)}
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
                  Cultural Site
                </span>
                {site.rating?.overall > 0 && (
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium">{site.rating.overall.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({site.rating.totalReviews})</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E83A17] transition-colors duration-300">
                {site.name}
              </h3>

              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <FaMapMarkerAlt className="text-[#E83A17] flex-shrink-0" />
                <span className="line-clamp-1">{site.location?.county}</span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{site.description}</p>

              {/* Activities */}
              {site.features?.activities?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {site.features.activities.slice(0, 3).map((activity, index) => (
                    <span key={index} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                      <FaCheckCircle size={10} />
                      {activity}
                    </span>
                  ))}
                  {site.features.activities.length > 3 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{site.features.activities.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(site.entryFees?.citizens?.adult || 0, site.entryFees?.currency)}
                </span>
                <span className="text-gray-600 ml-1">
                  /entry (Citizen)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaEye />
                <span>{site.metrics?.views || 0} views</span>
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
            alt={site.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {site.featured && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ⭐ Featured
            </span>
          )}
          {site.status === 'published' && (
            <span className="bg-[#006644] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <FaShieldAlt size={10} />
              Published
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => toggleWishlist(site._id, e)}
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
            {formatPrice(site.entryFees?.citizens?.adult || 0, site.entryFees?.currency)}
          </div>
          <div className="text-sm text-gray-600 text-center">
            /entry
          </div>
        </div>

        {/* Image Counter */}
        {site.images && site.images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            1/{site.images.length}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            Cultural Site
          </span>
          {site.rating?.overall > 0 && (
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="font-medium text-sm">{site.rating.overall.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({site.rating.totalReviews})</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E83A17] transition-colors duration-300">
          {site.name}
        </h3>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <FaMapMarkerAlt className="text-[#E83A17] flex-shrink-0" />
          <span className="line-clamp-1 text-sm">{site.location?.county}</span>
        </div>

        {/* Activities */}
        {site.features?.activities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {site.features.activities.slice(0, 2).map((activity, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                <FaCheckCircle size={8} />
                {activity}
              </span>
            ))}
            {site.features.activities.length > 2 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{site.features.activities.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Facilities */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaCheckCircle className={site.features?.facilities?.guidedTours ? "text-[#006644]" : "text-gray-400"} />
            <span>Guided Tours</span>
          </div>
          {site.features?.facilities?.parking && (
            <span className="text-xs text-gray-500 ml-6">Parking Available</span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FaEye />
            <span>{site.metrics?.views || 0} views</span>
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

export default React.memo(CulturalTour);