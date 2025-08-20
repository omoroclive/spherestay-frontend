import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import LoadingSkeleton from '../../common/loading/SkeletonLoader';
import ErrorBoundary from '../../common/errorBoundary/ErrorBoundary';
import { Suspense } from 'react';
import { lazy } from 'react';

const PropertyCard = lazy(() => import('../../ui/card/PropertyCard'));

const FeaturedProperties = () => {
  const [retryCount, setRetryCount] = useState(0);
  const { data, isLoading, error } = useApi('/api/properties', {
    params: { limit: 6, sort: '-metrics.views,-rating.overall', /*status: 'published'*/ }
  });

  // Retry on non-JSON error
  useEffect(() => {
    if (error && error.message.includes('non-JSON') && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(retryCount + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // Extract properties from API response
  const featuredProperties = data?.data || [];
  console.log('Featured Properties:', featuredProperties);

  if (error) {
    const errorMessage = error.message.includes('404')
      ? 'The properties endpoint is currently unavailable. Try exploring our public destinations.'
      : error.message.includes('Unexpected token') || error.message.includes('non-JSON')
      ? 'The server returned an invalid response. Retrying... If this persists, please contact support.'
      : 'Unable to connect to the server. Please try again later or contact support.';

    return (
      <section className="bg-gray-100 py-12" aria-labelledby="featured-properties-heading">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 text-red-700 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-3">Unable to Load Properties</h2>
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setRetryCount(retryCount + 1)}
                className="bg-[#E83A17] text-white px-6 py-2 rounded-lg hover:bg-[#c53214] transition-colors"
                aria-label="Retry loading properties"
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
                to="/public-properties"
                className="bg-[#006644] text-white px-6 py-2 rounded-lg hover:bg-[#005533] transition-colors"
                aria-label="Explore public destinations"
              >
                Explore Public Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-12" aria-labelledby="featured-properties-heading">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 id="featured-properties-heading" className="text-2xl font-bold text-gray-900">
            Featured Properties
          </h2>
          <Link
            to="/properties"
            className="text-[#E83A17] hover:underline"
            aria-label="View all properties"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} height="300px" />
            ))}
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No featured properties available at the moment. Explore public destinations!
          </div>
        ) : (
          <ErrorBoundary fallback={<div className="text-center py-8">Error loading properties</div>}>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <LoadingSkeleton key={i} height="300px" />
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={{
                      ...property,
                      title: property.title || property.businessName || 'Unnamed Property',
                      images: property.images || [{ 
                        url: '/images/property-placeholder.jpg', 
                        caption: 'Property image', 
                        isMain: true 
                      }],
                      pricing: property.pricing || { 
                        basePrice: 0, 
                        currency: 'KES', 
                        priceUnit: 'night' 
                      },
                      rating: property.rating || { 
                        overall: 0, 
                        totalReviews: 0,
                        breakdown: {
                          cleanliness: 0,
                          accuracy: 0,
                          communication: 0,
                          location: 0,
                          checkIn: 0,
                          value: 0
                        }
                      },
                      location: property.location || { 
                        city: 'Unknown', 
                        county: 'Unknown',
                        coordinates: {
                          latitude: 0,
                          longitude: 0
                        }
                      },
                      businessName: property.businessName || 'Unknown',
                      category: property.category || property.type || 'property',
                      amenities: property.amenities || [],
                      capacity: property.capacity || { 
                        bedrooms: 0, 
                        bathrooms: 0,
                        guests: 0
                      },
                    }}
                    lazyLoadImages
                  />
                ))}
              </div>
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;