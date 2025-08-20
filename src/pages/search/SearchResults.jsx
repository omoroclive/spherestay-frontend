import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/ui/card/PropertyCard';
import LoadingSkeleton from '@/components/common/loading/SkeletonLoader';
import { useApi } from '../../hooks/useApi';

// Helper function to normalize API response
const normalizePropertiesResponse = (response) => {
  console.log('Raw search API response:', response); // Debug response
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.properties)) return response.properties;
  console.warn('Search API response is not an array:', response);
  return [];
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const county = searchParams.get('county');
  const guests = searchParams.get('guests');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const amenities = searchParams.get('amenities');
  const minRating = searchParams.get('minRating');
  const mpesaEnabled = searchParams.get('mpesaEnabled');

  // Construct query parameters for useApi
  const queryParams = {
    ...(type && { type }),
    ...(county && { county }),
    ...(guests && { guests }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(checkIn && { checkIn }),
    ...(checkOut && { checkOut }),
    ...(amenities && { amenities }),
    ...(minRating && { minRating }),
    ...(mpesaEnabled && { mpesaEnabled })
  };

  console.log('Search query params:', queryParams); // Debug params

  // Fetch properties using useApi
  const { data: propertiesResponse = {}, isLoading, error } = useApi('/api/properties', {
    params: queryParams,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  });

  // Normalize the response
  const properties = normalizePropertiesResponse(propertiesResponse);
  console.log('Normalized properties:', properties); // Debug normalized data

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} height="300px" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-3">Search Error</h2>
          <p className="text-gray-700 mb-4">
            {error.message.includes('404')
              ? 'No properties match your search criteria. Try adjusting your filters.'
              : `Failed to fetch search results: ${error.message}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No properties found</h2>
          <p className="text-gray-600">Try adjusting your search filters or broadening your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id || property.id}
              property={{
                ...property,
                images: property.images || [{ url: '/images/property-placeholder.jpg', isMain: true }],
                pricing: property.pricing || { basePrice: 0, currency: 'KES', priceUnit: 'night' },
                rating: property.rating || { overall: 0, totalReviews: 0 },
                location: property.location || { city: 'Unknown', county: 'Unknown' },
                businessName: property.businessName || 'Unknown',
                category: property.category || property.type || 'property',
                amenities: property.amenities || [],
                capacity: property.capacity || { bedrooms: 0, bathrooms: 0 }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;