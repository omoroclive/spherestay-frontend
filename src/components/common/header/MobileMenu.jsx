import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SafariTour from '@/assets/images/mountKenya.svg';
import BeachHoliday from '@/assets/images/dianiBeach2.svg';
import CulturalTour from '@/assets/images/maasaiMara.svg';
import Adventure from '@/assets/images/apartment.svg';
import Hotels from '@/assets/images/hotel1.svg';
import Villa from '@/assets/images/lodge2.svg';
import Safari from '@/assets/images/maasaiMara3.svg';
import Spa from '@/assets/images/spa.svg';
import Cultural from '@/assets/images/maasaiCulture2.svg';
import AdventureTour from '@/assets/images/adventures.svg';
import BoatRiding from '@/assets/images/boatRiding.svg';
import CarRental from '@/assets/images/transport.svg';
import BeachTour from '@/assets/images/dianiBeach.svg';
import SpherestayLogo from '@/assets/images/spherestay_kenya_logo.svg';
import SearchBox from '../../sections/hero/SearchBox';
import { 
  CalendarDaysIcon,
  HeartIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  XMarkIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Static default categories
const defaultCategories = [
  {
    name: 'Car Rental',
    type: 'transport',
    subCategory: 'car_rental',
    description: 'Rent vehicles for your journey',
    image: { url: CarRental }
  },
  {
    name: 'Airport Transfer',
    type: 'transport',
    subCategory: 'transfer',
    description: 'Seamless airport shuttles',
    image: { url: SafariTour }
  },
  {
    name: 'Safari',
    type: 'experience',
    subCategory: 'safari',
    description: 'Wildlife adventures in Kenya',
    image: { url: Safari }
  },
  {
    name: 'Cultural Tour',
    type: 'culture',
    subCategory: 'cultural_tour',
    description: 'Explore local traditions',
    image: { url: Cultural }
  },
  {
    name: 'Adventure',
    type: 'experience',
    subCategory: 'adventure',
    description: 'Thrilling outdoor activities',
    image: { url: AdventureTour }
  },
  {
    name: 'Beach',
    type: 'experience',
    subCategory: 'beach',
    description: 'Relax on Kenyas coastlines',
    image: { url: BeachTour }
  },
  {
    name: 'Boat Riding',
    type: 'experience',
    subCategory: 'boat',
    description: 'Enjoy water-based adventures',
    image: { url: BoatRiding }
  },
  {
    name: 'Hotels',
    type: 'accommodation',
    subCategory: 'hotels',
    description: 'Luxury hotel stays',
    image: { url: Hotels }
  },
  {
    name: 'Villas',
    type: 'accommodation',
    subCategory: 'villas',
    description: 'Private villa retreats',
    image: { url: Villa }
  },
  {
    name: 'Lodges',
    type: 'accommodation',
    subCategory: 'lodges',
    description: 'Safari lodge experiences',
    image: { url: Safari }
  },
  {
    name: 'Spa',
    type: 'service',
    subCategory: 'spa',
    description: 'Relax with spa services',
    image: { url: Spa }
  },
  {
    name: 'Cultural Experience',
    type: 'service',
    subCategory: 'cultural',
    description: 'Immerse in Kenyan culture',
    image: { url: CulturalTour }
  }
];

const MobileMenu = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch categories from the backend
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories', {
        params: { status: 'active' }
      });
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Use fetched categories if available, otherwise use defaultCategories
  const categories = Array.isArray(data) && data.length > 0 ? data : defaultCategories;

  // Image mapping for subcategories
  const imageMap = {
    'car_rental': CarRental,
    'transfer': SafariTour,
    'safari': Safari,
    'cultural_tour': Cultural,
    'adventure': AdventureTour,
    'beach': BeachTour,
    'boat': BoatRiding,
    'hotels': Hotels,
    'villas': Villa,
    'lodges': Safari,
    'spa': Spa,
    'cultural': CulturalTour
  };

  // Main navigation links
  const mainNavigation = [
    { label: 'Home', href: '/', icon: null, description: 'Back to home page' },
    { label: 'About', href: '/about', icon: null, description: 'Learn about us' },
    { label: 'Destinations', href: '/public-properties', icon: null, description: 'Explore our destinations' },
    { label: 'Contact', href: '/contact', icon: null, description: 'Get in touch' }
  ];

  // Quick actions
  const quickActions = [
    { label: 'My Bookings', icon: CalendarDaysIcon, href: '/bookings', description: 'View your bookings' },
    { label: 'Wishlist', icon: HeartIcon, href: '/wishlist', description: 'Your saved items' },
    { label: 'Help Center', icon: BuildingOfficeIcon, href: '/help', description: 'Get support' },
    { label: 'Profile', icon: UserCircleIcon, href: '/account', description: 'Manage your account' }
  ];

  // Transform categories into navigationItems structure
  const navigationItems = categories.reduce((acc, category) => {
    const existingCategory = acc.find(item => item.category === category.type);
    const subcategory = {
      label: category.name,
      image: imageMap[category.subCategory] || category.image?.url || PlaceholderImage,
      subCategory: category.subCategory,
      description: category.description?.substring(0, 50) || 'Explore this category'
    };

    if (existingCategory) {
      existingCategory.subcategories.push(subcategory);
    } else {
      acc.push({
        label: category.type.charAt(0).toUpperCase() + category.type.slice(1),
        icon: imageMap[category.subCategory] || category.image?.url || PlaceholderImage,
        category: category.type,
        href: `/${category.type}`,
        description: category.description?.substring(0, 50) || 'Discover more',
        subcategories: [subcategory]
      });
    }
    return acc;
  }, []);

  const toggleCategory = (categoryLabel) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryLabel]: !prev[categoryLabel]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-[90%] sm:max-w-sm bg-white z-50 lg:hidden shadow-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <img src={SpherestayLogo} alt="Spherestay Logo" className="w-10 h-10" />
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Spherestay Kenya</h2>
                    <p className="text-xs text-gray-500">Discover Kenya</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="px-4 py-3 border-b border-gray-100">
                <SearchBox
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Explore Kenya..."
                  className="w-full rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-gray-50 text-sm placeholder-gray-400 transition-colors duration-150"
                />
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  {/* Main Navigation */}
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Main Navigation
                  </h3>
                  <div className="space-y-1 mb-4">
                    {mainNavigation.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                      >
                        <Link
                          to={item.href}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors duration-150 group block"
                          onClick={onClose}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 group-hover:text-orange-600 text-sm transition-colors duration-150">
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Discover Section */}
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Discover
                  </h3>
                  {error ? (
                    <div className="p-4 text-sm text-red-500">Failed to load categories: {error.message}</div>
                  ) : isLoading ? (
                    <div className="p-4 text-sm text-gray-500">Loading categories...</div>
                  ) : navigationItems.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      No navigation items available. Please check the configuration.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {navigationItems.map((item, index) => (
                        <div key={item.label} className="mb-1">
                          {/* Main Category - Keep as Link */}
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (mainNavigation.length + index) * 0.05, duration: 0.2 }}
                          >
                            <Link
                              to={item.href}
                              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors duration-150 group block"
                              onClick={onClose}
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.icon}
                                  alt={item.label}
                                  className="w-8 h-8 object-cover rounded-md"
                                  loading="lazy"
                                />
                                <div className="text-left">
                                  <div className="font-medium text-gray-900 group-hover:text-orange-600 text-sm transition-colors duration-150">
                                    {item.label}
                                  </div>
                                  <div className="text-xs text-gray-500">{item.description}</div>
                                </div>
                              </div>
                              <div 
                                className="transition-transform duration-200"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleCategory(item.label);
                                }}
                              >
                                {expandedCategories[item.label] ? (
                                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </Link>
                          </motion.div>

                          {/* Subcategories - Remove Links */}
                          <AnimatePresence>
                            {expandedCategories[item.label] && (
                              <motion.div
                                className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {item.subcategories.map((subcategory, subIndex) => (
                                  <motion.div
                                    key={subcategory.label}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIndex * 0.05, duration: 0.15 }}
                                  >
                                    <div
                                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-orange-50 transition-colors duration-150 cursor-pointer"
                                    >
                                      <img
                                        src={subcategory.image}
                                        alt={subcategory.label}
                                        className="w-6 h-6 object-cover rounded-sm flex-shrink-0"
                                        loading="lazy"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-800 hover:text-orange-600 text-sm transition-colors duration-150 truncate">
                                          {subcategory.label}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">{subcategory.description}</div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Quick Access
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (mainNavigation.length + navigationItems.length + index) * 0.05, duration: 0.2 }}
                      >
                        <Link
                          to={action.href}
                          className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-orange-50 transition-colors duration-150 group"
                          onClick={onClose}
                        >
                          <action.icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors duration-150" />
                          <span className="text-xs font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-150 text-center">
                            {action.label}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="text-center text-xs text-gray-500">
                  <p>🇰🇪 Proudly Kenyan</p>
                  <p className="mt-1">© 2025 Spherestay Kenya. All rights reserved.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;