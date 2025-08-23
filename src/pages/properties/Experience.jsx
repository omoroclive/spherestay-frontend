import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaStar, FaHeart, FaSearch, FaSlidersH, FaTh, FaList, 
  FaChevronDown, FaCheckCircle, FaEye, FaShieldAlt, FaCompass, FaClock,
  FaCamera, FaHiking, FaSwimmer, FaTree, FaMountain
} from 'react-icons/fa';
import { GiKenya } from 'react-icons/gi';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';

const Experience = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    tag: searchParams.get('tag') || 'all',
    category: searchParams.get('category') || 'all',
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

  const sites = response?.data?.properties || response?.properties || response?.data || [];

  // Extract unique tags and categories for filtering
  const availableTags = useMemo(() => {
    const allTags = new Set();
    sites.forEach(site => {
      if (Array.isArray(site.tags)) {
        site.tags.forEach(tag => allTags.add(tag));
      }
    });
    return Array.from(allTags).sort();
  }, [sites]);

  const availableCategories = useMemo(() => {
    const categories = new Set();
    sites.forEach(site => {
      if (site.category) {
        categories.add(site.category);
      }
    });
    return Array.from(categories).sort();
  }, [sites]);

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.location) params.set('location', filters.location);
    if (filters.tag !== 'all') params.set('tag', filters.tag);
    if (filters.category !== 'all') params.set('category', filters.category);
    setSearchParams(params);
  }, [filters.search, filters.location, filters.tag, filters.category, setSearchParams]);

  // Filter and sort sites
  const filteredAndSortedSites = useMemo(() => {
    if (!Array.isArray(sites)) return [];

    let filtered = sites.filter(site => {
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

      // Tag filter
      if (filters.tag !== 'all' && 
          (!Array.isArray(site.tags) || !site.tags.includes(filters.tag))) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && site.category !== filters.category) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && (site.rating?.overall || 0) < filters.rating) {
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
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return filtered;
  }, [sites, filters, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedSites.length / itemsPerPage);
  const paginatedSites = filteredAndSortedSites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

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

  const formatPrice = (price, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      tag: 'all',
      category: 'all',
      rating: 0
    });
    setSearchParams(new URLSearchParams());
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'cultural_site':
        return <GiKenya />;
      case 'archaeological_site':
        return <FaCompass />;
      case 'museum':
        return <FaCamera />;
      case 'lake':
        return <FaSwimmer />;
      case 'beach':
        return <FaSwimmer />;
      case 'mountain':
        return <FaMountain />;
      case 'national_park':
        return <FaTree />;
      default:
        return <FaMapMarkerAlt />;
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
          <p className="text-gray-600 mb-6">Unable to load experiences. Please try again.</p>
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
        <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-[#E83A17] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Discover Unique Experiences
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                Explore Kenya's rich culture, history, and natural wonders
              </p>

              {/* Search Bar */}
              <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search experiences..."
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
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                  >
                    <option value="all">All Categories</option>
                    {availableCategories.map(category => (
                      <option key={category} value={category}>
                        {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.tag}
                    onChange={(e) => handleFilterChange('tag', e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-gray-900"
                  >
                    <option value="all">All Tags</option>
                    {availableTags.map(tag => (
                      <option key={tag} value={tag}>
                        {tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {filteredAndSortedSites.length} experiences found
              </h2>
              <p className="text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedSites.length)} of {filteredAndSortedSites.length} results
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
          {(filters.search || filters.location || filters.tag !== 'all' || filters.category !== 'all' || filters.rating > 0) && (
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
                {filters.category !== 'all' && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Category: {filters.category.replace(/_/g, ' ')}
                    <button onClick={() => handleFilterChange('category', 'all')}>×</button>
                  </span>
                )}
                {filters.tag !== 'all' && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Tag: {filters.tag.replace(/_/g, ' ')}
                    <button onClick={() => handleFilterChange('tag', 'all')}>×</button>
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
          {paginatedSites.length > 0 ? (
            <motion.div
              layout
              className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                : 'space-y-6'
              }
            >
              <AnimatePresence>
                {paginatedSites.map((site, index) => (
                  <ExperienceCard
                    key={site._id}
                    site={site}
                    viewMode={viewMode}
                    isWishlisted={wishlistedItems.has(site._id)}
                    toggleWishlist={handleWishlistToggle}
                    formatPrice={formatPrice}
                    getCategoryIcon={getCategoryIcon}
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
                <FaCompass className="text-6xl text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No experiences found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria to discover more experiences.
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

// Experience Card Component
const ExperienceCard = ({ site, viewMode, isWishlisted, toggleWishlist, formatPrice, getCategoryIcon, index }) => {
  const navigate = useNavigate();
  const mainImage = site.images?.[0]?.url || '/images/site-placeholder.jpg';

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
          <div className="relative md:w-1/3">
            <img
              src={mainImage}
              alt={site.name}
              className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <button
              onClick={(e) => toggleWishlist(site._id, e)}
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">{site.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <span className="text-[#E83A17]">{getCategoryIcon(site.category)}</span>
                  <span className="capitalize">{site.category?.replace(/_/g, ' ')}</span>
                  <span>•</span>
                  <FaMapMarkerAlt className="text-[#E83A17]" />
                  <span>{site.location?.county}</span>
                </div>
              </div>
              {site.rating?.overall > 0 && (
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span className="font-medium text-sm">{site.rating.overall.toFixed(1)}</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{site.description}</p>

            {/* Tags */}
            {site.tags && site.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {site.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tag.replace(/_/g, ' ')}
                  </span>
                ))}
                {site.tags.length > 3 && (
                  <span className="text-gray-500 text-xs">+{site.tags.length - 3} more</span>
                )}
              </div>
            )}

            {/* Entry Fees */}
            {site.entryFees && !site.entryFees.freeEntry && (
              <div className="text-[#E83A17] font-semibold">
                From {formatPrice(site.entryFees.citizens?.adult || site.entryFees.residents?.adult, site.entryFees.currency)}
              </div>
            )}
            {site.entryFees?.freeEntry && (
              <div className="text-green-600 font-semibold">Free Entry</div>
            )}
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
          alt={site.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <button
          onClick={(e) => toggleWishlist(site._id, e)}
          className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
          }`}
        >
          <FaHeart size={16} />
        </button>
        
        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span className="text-[#E83A17]">{getCategoryIcon(site.category)}</span>
          {site.category?.replace(/_/g, ' ')}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 flex-1">{site.name}</h3>
          {site.rating?.overall > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <FaStar className="text-yellow-400" />
              <span className="font-medium text-sm">{site.rating.overall.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <FaMapMarkerAlt className="text-[#E83A17] text-sm" />
          <span className="text-sm">{site.location?.county}</span>
          {site.metrics?.views > 0 && (
            <>
              <span>•</span>
              <FaEye className="text-gray-400 text-sm" />
              <span className="text-sm">{site.metrics.views} views</span>
            </>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{site.description}</p>

        {/* Tags */}
        {site.tags && site.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {site.tags.slice(0, 2).map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                {tag.replace(/_/g, ' ')}
              </span>
            ))}
            {site.tags.length > 2 && (
              <span className="text-gray-500 text-xs">+{site.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Entry Fees */}
        <div className="flex items-center justify-between">
          {site.entryFees && !site.entryFees.freeEntry && (
            <div className="text-[#E83A17] font-semibold text-sm">
              From {formatPrice(site.entryFees.citizens?.adult || site.entryFees.residents?.adult, site.entryFees.currency)}
            </div>
          )}
          {site.entryFees?.freeEntry && (
            <div className="text-green-600 font-semibold text-sm">Free Entry</div>
          )}
          
          {/* Safety level */}
          {site.safety?.level && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FaShieldAlt className={`${
                site.safety.level === 'very_safe' ? 'text-green-500' : 
                site.safety.level === 'safe' ? 'text-blue-500' : 'text-yellow-500'
              }`} />
              <span className="capitalize">{site.safety.level.replace(/_/g, ' ')}</span>
            </div>
          )}
        </div>

        {/* Operating Hours */}
        {site.operatingHours && !site.operatingHours.isAlwaysOpen && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <FaClock />
            <span>
              {site.operatingHours.schedule?.weekdays?.open || 'Check hours'} - {site.operatingHours.schedule?.weekdays?.close || ''}
            </span>
          </div>
        )}
        {site.operatingHours?.isAlwaysOpen && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-green-600">
            <FaClock />
            <span>Always Open</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(Experience);