import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaStar, FaHeart, FaSearch, FaSlidersH, FaTh, FaList, 
  FaChevronDown, FaCheckCircle, FaEye, FaShieldAlt 
} from 'react-icons/fa';
import { GiKenya } from 'react-icons/gi';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';

const Beach = () => {
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

  const sites = response?.data?.properties || response?.properties || response?.data || [];

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
    if (!Array.isArray(sites)) return [];

    let filtered = sites.filter(site => {
      // ✅ Filter only beach category
      if (site.category !== 'beach') return false;

      if (filters.search && 
          !site.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !site.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.location && 
          !site.location?.county?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.activity !== 'all' && 
          !site.features?.activities?.includes(filters.activity)) {
        return false;
      }

      if (filters.rating > 0 && (site.rating?.overall || 0) < filters.rating) {
        return false;
      }

      return true;
    });

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
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">Unable to load beaches. Please try again.</p>
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
        <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-[#E83A17] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Discover Beautiful Beaches
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                Relax, explore, and enjoy Kenya’s coastal paradise
              </p>

              {/* Search Bar */}
              <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search beaches..."
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
                    <option value="swimming">Swimming</option>
                    <option value="snorkeling">Snorkeling</option>
                    <option value="surfing">Surfing</option>
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

        {/* Results Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {filteredAndSortedSites.length} beaches found
              </h2>
              <p className="text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedSites.length)} of {filteredAndSortedSites.length} results
              </p>
            </div>
          </div>

          {/* Grid/List */}
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No beaches found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria to find more beaches.
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
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Reuse SiteCard
const SiteCard = ({ site, viewMode, isWishlisted, toggleWishlist, formatPrice, index }) => {
  const navigate = useNavigate();
  const mainImage = site.images?.[0]?.url || '/images/site-placeholder.jpg';

  const handleCardClick = () => {
    navigate(`/publicproperties/${site._id}`);
  };

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
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{site.name}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <FaMapMarkerAlt className="text-[#E83A17]" />
          <span>{site.location?.county}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{site.description}</p>
        {site.rating?.overall > 0 && (
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="font-medium text-sm">{site.rating.overall.toFixed(1)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(Beach);
