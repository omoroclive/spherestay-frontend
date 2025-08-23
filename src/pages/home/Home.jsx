import React, { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSafari,
  FaUmbrellaBeach,
  FaLandmark,
  FaHotel,
  FaCarAlt,
} from 'react-icons/fa';
import MpesaIcon from '@/assets/icons/custom/MpesaIcon';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import useLocalStorage from '../../hooks/useLocalStorage';
import PopularPublicProperties from '@/pages/publicProperties/PopularPublicProperties';
import FeaturedProperties from '../../components/sections/FeaturedProperties/FeaturedProperties';
import SearchBox from '../../components/sections/hero/SearchBox';

// Lazy loaded components
const HeroSection = lazy(() => import('../../components/sections/hero/HeroSlider'));
const AdvertisementSwiper = lazy(() => import('../../components/sections/Advertisement'));
const Testimonials = lazy(() => import('../../components/sections/testimonials/Testimonials'));
const Newsletter = lazy(() => import('../../components/sections/newsletter/Newsletter'));

const Home = () => {
  const [userLocation, setUserLocation] = useLocalStorage('userLocation', null);
  const [recentViews] = useLocalStorage('recentlyViewed', []);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.warn('Location access denied:', err)
      );
    }
  }, [userLocation, setUserLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredExperiences = [
    {
      label: 'Safari Adventures',
      icon: <FaSafari className="text-2xl text-[#E83A17]" />,
      href: '/experience',
      description: 'Witness the Big Five in Maasai Mara',
      ariaLabel: 'Explore Safari Adventures',
    },
    {
      label: 'Beach Getaways',
      icon: <FaUmbrellaBeach className="text-2xl text-[#FFC72C]" />,
      href: '/beach',
      description: 'Relax on Diani\'s white sandy beaches',
      ariaLabel: 'Explore Beach Getaways',
    },
    {
      label: 'Cultural Tours',
      icon: <FaLandmark className="text-2xl text-[#006644]" />,
      href: '/culture',
      description: 'Experience Maasai traditions',
      ariaLabel: 'Explore Cultural Tours',
    },
    {
      label: 'Luxury Stays',
      icon: <FaHotel className="text-2xl text-[#E83A17]" />,
      href: '/accommodation',
      description: '5-star lodges with stunning views',
      ariaLabel: 'Explore Luxury Accommodations',
    },
    {
      label: 'Transport',
      icon: <FaCarAlt className="text-2xl text-[#FFC72C]" />,
      href: '/transport',
      description: 'Hassle-free travel arrangements',
      ariaLabel: 'Explore Transport Options',
    },
  ];

  return (
    <div className="bg-gray-50 max-w-[100vw] overflow-x-hidden ">
      <style>
        {`
          @media (max-width: 640px) {
            .search-bar-container {
              margin-top: -1.5rem;
              margin-left: 0.5rem;
              margin-right: 0.5rem;
            }
            
            .featured-experiences {
              grid-template-columns: repeat(2, 1fr);
              gap: 0.75rem;
            }
            
            .experience-card {
              padding: 0.75rem;
            }
            
            .experience-icon {
              font-size: 1.5rem;
            }
            
            .section-padding {
              padding-left: 1rem;
              padding-right: 1rem;
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <ErrorBoundary fallback={<LoadingSkeleton height="50vh" />}>
        <Suspense fallback={<LoadingSkeleton height="50vh" />}>
          <HeroSection />
        </Suspense>
      </ErrorBoundary>

      {/* Quick Search Bar */}
      <section className="bg-white shadow-md search-bar-container mx-2 sm:mx-4 rounded-lg relative z-10">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6">
          <SearchBox setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 section-padding" aria-labelledby="featured-experiences-heading">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 sm:mb-6"
        >
          <h2 id="featured-experiences-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Kujipanga Safari Yako <span className="text-[#E83A17]">🇰🇪</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">
            Plan your perfect Kenyan adventure with our curated experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 featured-experiences">
          {featuredExperiences.map((experience, index) => (
            <motion.div
              key={experience.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="experience-card"
            >
              <Link
                to={experience.href}
                className="block bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full text-center focus:ring-2 focus:ring-[#E83A17] focus:outline-none"
                aria-label={experience.ariaLabel}
              >
                <div className="flex justify-center mb-2" aria-hidden="true">
                  <span className="experience-icon">{experience.icon}</span>
                </div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                  {experience.label}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {experience.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <ErrorBoundary fallback={<div className="text-center py-6">Error loading featured properties</div>}>
        <Suspense fallback={<LoadingSkeleton height="250px" />}>
          <FeaturedProperties />
        </Suspense>
      </ErrorBoundary>

      {/* Popular Public Properties */}
      <ErrorBoundary fallback={<div className="text-center py-6">Error loading public properties</div>}>
        <Suspense fallback={<LoadingSkeleton height="250px" />}>
          <PopularPublicProperties />
        </Suspense>
      </ErrorBoundary>

      {/* Advertisement Swiper */}
     <ErrorBoundary fallback={<LoadingSkeleton height="400px" /> }>
        <Suspense fallback={<LoadingSkeleton height="400px" />}>
          <AdvertisementSwiper />
        </Suspense>
      </ErrorBoundary>

      {/* M-Pesa CTA 
      <section className="bg-[#00A651] text-white py-6 md:py-12" aria-labelledby="mpesa-cta-heading">
        <div className="container mx-auto px-4 text-center section-padding">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="inline-block mb-3 md:mb-6"
          >
            <div className="bg-white/20 p-2 sm:p-3 rounded-full">
              <div className="bg-white text-[#00A651] p-2 rounded-full text-sm md:text-base font-bold flex items-center justify-center gap-2">
                <MpesaIcon className="w-4 h-4 md:w-5 md:h-5" /> LIPA NA M-PESA
              </div>
            </div>
          </motion.div>
          <h2 id="mpesa-cta-heading" className="text-lg md:text-xl font-bold mb-2 md:mb-4">
            Book Now, Pay with M-Pesa
          </h2>
          <p className="text-sm md:text-base max-w-md mx-auto mb-3 md:mb-6">
            Enjoy seamless mobile payments with Kenya's most trusted payment system
          </p>
          <Link
            to="/how-to-pay"
            className="inline-block bg-white text-[#00A651] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-white focus:outline-none text-sm md:text-base"
            aria-label="Learn how to pay with M-Pesa"
          >
            Learn How to Pay
          </Link>
        </div>
      </section>
      */}

      {/* Cultural Highlight */}
      <section className="container mx-auto px-4 py-6 md:py-16 section-padding" aria-labelledby="cultural-highlight-heading">
        <div className="bg-[#FFC72C]/10 rounded-xl md:rounded-2xl p-4 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="w-full md:w-1/2">
            <h2 id="cultural-highlight-heading" className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4">
              Ukumbusho wa Utamaduni
            </h2>
            <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-6">
              Experience authentic Kenyan culture through traditional dances, crafts, and storytelling sessions with local communities.
            </p>
            <Link
              to="/cultural-experiences"
              className="inline-block bg-[#E83A17] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#c53214] transition-colors focus:ring-2 focus:ring-[#E83A17] focus:outline-none text-sm md:text-base"
              aria-label="Explore cultural experiences"
            >
              Explore Culture
            </Link>
          </div>
          <div className="w-full md:w-1/2 bg-white p-2 md:p-4 rounded-lg shadow-md mt-4 md:mt-0">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full min-h-[150px] md:min-h-[250px] bg-gradient-to-r from-[#006644] to-[#FFC72C] flex items-center justify-center text-white relative">
                <div className="absolute inset-0 bg-[url('/images/maasai-pattern.png')] opacity-10" />
                <div className="relative z-10 text-center p-3 md:p-4">
                  <FaLandmark className="text-3xl md:text-4xl mx-auto mb-2 md:mb-4" />
                  <span className="text-base md:text-lg font-bold">Maasai Cultural Experience</span>
                  <p className="mt-1 md:mt-2 text-xs md:text-sm">Journey into the heart of Maasai traditions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentViews.length > 0 && (
        <section className="container mx-auto px-4 py-6 md:py-12 section-padding" aria-labelledby="recently-viewed-heading">
          <h2 id="recently-viewed-heading" className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-8">
            Continue Exploring
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {recentViews.slice(0, 3).map((property) => (
              <ErrorBoundary key={property._id} fallback={null}>
                <Suspense fallback={<LoadingSkeleton height="200px" />}>
                  <PropertyCard
                    property={{
                      ...property,
                      images: property.images || [{ url: '/images/property-placeholder.jpg', isMain: true }],
                      pricing: property.pricing || { basePrice: 0, currency: 'KES', priceUnit: 'night' },
                      rating: property.rating || { overall: 0, totalReviews: 0 },
                      location: property.location || { city: 'Unknown', county: 'Unknown' },
                      businessName: property.businessName || 'Unknown',
                      category: property.category || '',
                      amenities: property.amenities || [],
                      capacity: property.capacity || { bedrooms: 0, bathrooms: 0 },
                    }}
                    lazyLoadImages
                  />
                </Suspense>
              </ErrorBoundary>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <ErrorBoundary fallback={null}>
        <Suspense fallback={<LoadingSkeleton height="250px" />}>
          <Testimonials />
        </Suspense>
      </ErrorBoundary>

      {/* Newsletter 
      <ErrorBoundary fallback={null}>
        <Suspense fallback={<LoadingSkeleton height="200px" />}>
          <Newsletter />
        </Suspense>
      </ErrorBoundary>
      */}
    </div>
  );
};

export default React.memo(Home);