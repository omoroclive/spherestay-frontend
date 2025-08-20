import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaFilter, 
  FaTimes,
  FaStar
} from 'react-icons/fa';
import { MpesaIcon } from '@/assets/icons';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import api from '../../../services/api';

const SearchBox = ({ setSearchQuery, handleSearch }) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);

  // Fetch properties using useApi
  const { data: propertiesResponse = {}, isLoading: loadingProperties, error: propertiesError } = useApi('/api/properties', {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Normalize API response to extract the nested data array
  const normalizeArrayResponse = (response) => {
    console.log('Raw API response:', response); // Debug response
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.results)) return response.results;
    console.warn('API response is not an array:', response);
    return [];
  };

  // Extract properties from response
  const properties = normalizeArrayResponse(propertiesResponse);
  console.log('Normalized properties:', properties); // Debug normalized data

  // Extract unique property types and locations with guards
  const propertyTypes = Array.isArray(properties) 
    ? [...new Set(properties.map(prop => prop.type).filter(type => type))]
    : [];
  const locationOptions = Array.isArray(properties)
    ? [
        ...new Set(
          properties.flatMap(prop => [
            prop.location?.city,
            prop.location?.county
          ]).filter(loc => loc)
        )
      ].map(loc => ({
        name: loc,
        county: properties.find(p => p.location?.city === loc || p.location?.county === loc)?.location?.county || ''
      }))
    : [];

  // Log properties error if it occurs
  if (propertiesError) {
    console.error('Properties fetch error:', {
      status: propertiesError.response?.status,
      url: `${api.defaults.baseURL}/api/properties`,
      message: propertiesError.message,
      suggestion: propertiesError.response?.status === 404 
        ? 'The /api/properties endpoint may not be registered on the backend. Verify the server is running at https://spherestay.onrender.com and the route is configured in Express.js.'
        : 'Check network connectivity or server status.'
    });
  }

  // Form handling with React Hook Form
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      query: '',
      city: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      type: '',
      priceRange: [5000, 50000],
      amenities: [],
      minRating: null,
      mpesaEnabled: false
    }
  });

  const formValues = watch();

  // Handle location input changes with client-side filtering
  const handleLocationChange = (value) => {
    setValue('city', value);
    setSearchQuery(value); // Update search query for Home component
    setIsFetchingLocations(true);
    
    if (value.length < 3) {
      setLocationSuggestions([]);
      setIsFetchingLocations(false);
      return;
    }

    // Filter locationOptions client-side
    const filteredSuggestions = locationOptions.filter(loc => 
      loc.name.toLowerCase().includes(value.toLowerCase())
    );
    setLocationSuggestions(filteredSuggestions);
    setIsFetchingLocations(false);
  };

  // Handle property type selection
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setValue('type', type);
  };

  // Submit handler with query parameter construction
  const onSubmit = async (data) => {
    const params = new URLSearchParams();

    // Basic search parameters
    if (data.query) params.append('search', data.query);
    if (data.city) params.append('city', data.city);

    // Date filters
    if (data.checkIn) params.append('checkIn', data.checkIn);
    if (data.checkOut) params.append('checkOut', data.checkOut);
    if (data.guests) params.append('guests', data.guests);

    // Property type filter
    if (data.type) params.append('type', data.type);

    // Price range
    params.append('minPrice', data.priceRange[0]);
    params.append('maxPrice', data.priceRange[1]);

    // Additional filters
    if (data.amenities?.length > 0) {
      params.append('amenities', data.amenities.join(','));
    }
    if (data.minRating) {
      params.append('minRating', data.minRating);
    }
    if (data.mpesaEnabled) {
      params.append('mpesaEnabled', 'true');
    }

    navigate(`/search?${params.toString()}`);
    handleSearch({ preventDefault: () => {} }); // Trigger Home's handleSearch
  };

  // Toggle filters panel
  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-6xl mx-auto box-border">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              {...register('query')}
              type="text"
              placeholder="Search safaris, beaches, hotels..."
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006644] focus:border-[#006644] outline-none"
              aria-label="Search for properties or experiences"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Location Input with Suggestions */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="text-gray-400" />
            </div>
            <input
              {...register('city')}
              type="text"
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="Where in Kenya?"
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006644] focus:border-[#006644] outline-none"
              aria-label="Search by city or county"
            />
            
            {/* Location Suggestions Dropdown */}
            <AnimatePresence>
              {(isFetchingLocations || locationSuggestions.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
                >
                  {isFetchingLocations ? (
                    <div className="px-4 py-2 text-gray-500">Searching locations...</div>
                  ) : locationSuggestions.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500">No locations found</div>
                  ) : (
                    locationSuggestions.map((location) => (
                      <div
                        key={location.name}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setValue('city', location.name);
                          setSearchQuery(location.name);
                          setLocationSuggestions([]);
                        }}
                      >
                        <div className="font-medium">{location.name}</div>
                        {location.county && location.county !== location.name && (
                          <div className="text-xs text-gray-500">{location.county} County</div>
                        )}
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Search Button */}
          <button
            type="submit"
            disabled={isSubmitting || propertiesError}
            className="bg-[#E83A17] hover:bg-[#c53214] text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-75"
            aria-label="Submit search"
          >
            <FaSearch />
            <span className="hidden md:inline">
              {isSubmitting ? 'Searching...' : 'Search'}
            </span>
          </button>
        </div>

        {/* Error Message */}
        {propertiesError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            Failed to load properties. Please try again later or check your network connection.
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={toggleFilters}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            aria-label={showFilters ? "Hide filters" : "Show more filters"}
          >
            {showFilters ? (
              <>
                <FaTimes /> Hide Filters
              </>
            ) : (
              <>
                <FaFilter /> More Filters
              </>
            )}
          </button>

          {/* Popular Property Types */}
          {propertyTypes.slice(0, 5).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeSelect(type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedType === type 
                  ? 'bg-[#006644] text-white' 
                  : 'bg-[#006644]/10 hover:bg-[#006644]/20 text-[#006644]'
              }`}
              aria-label={`Filter by ${type}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Expanded Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                {/* Property Type Selection */}
                <div>
                  <h3 className="font-medium mb-2">Property Type</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {loadingProperties ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        ))}
                      </div>
                    ) : propertyTypes.length === 0 ? (
                      <div className="text-gray-500">No property types available</div>
                    ) : (
                      propertyTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleTypeSelect(type)}
                          className={`w-full text-left p-2 rounded-lg flex items-center gap-2 ${
                            selectedType === type 
                              ? 'bg-[#006644] text-white' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          aria-label={`Select ${type} property type`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Date & Guests */}
                <div>
                  <h3 className="font-medium mb-2">Dates & Guests</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-500 mb-1">Check-in</label>
                        <input
                          {...register('checkIn')}
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006644] focus:border-[#006644] outline-none"
                          aria-label="Check-in date"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-500 mb-1">Check-out</label>
                        <input
                          {...register('checkOut')}
                          type="date"
                          min={formValues.checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006644] focus:border-[#006644] outline-none"
                          aria-label="Check-out date"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-500 mb-1">Guests</label>
                        <select
                          {...register('guests')}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006644] focus:border-[#006644] outline-none"
                          aria-label="Number of guests"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Rating */}
                <div>
                  <h3 className="font-medium mb-2">Price Range (KES)</h3>
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Min: {formValues.priceRange[0].toLocaleString()}</span>
                      <span>Max: {formValues.priceRange[1].toLocaleString()}</span>
                    </div>
                    <div className="px-2 space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        {...register('priceRange[0]')}
                        className="w-full accent-[#006644]"
                        aria-label="Minimum price"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        {...register('priceRange[1]')}
                        className="w-full accent-[#006644]"
                        aria-label="Maximum price"
                      />
                    </div>
                  </div>

                  <h3 className="font-medium mb-2">Minimum Rating</h3>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setValue('minRating', formValues.minRating === rating ? null : rating)}
                        className={`p-2 rounded-lg flex items-center gap-1 ${
                          formValues.minRating === rating 
                            ? 'bg-[#FFC72C] text-gray-900' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        aria-label={`${rating} stars and up`}
                      >
                        <FaStar className="text-yellow-500" />
                        <span>{rating}+</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* M-Pesa Filter */}
              <div className="mt-6 flex items-center gap-2 p-3 bg-[#00A651]/10 rounded-lg">
                <MpesaIcon className="w-6 h-6 text-[#00A651]" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('mpesaEnabled')}
                    className="rounded border-gray-300 text-[#00A651] focus:ring-[#00A651]"
                    aria-label="Filter by M-Pesa payment option"
                  />
                  <span className="text-sm">Lipa kwa M-Pesa (M-Pesa payments only)</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default SearchBox;