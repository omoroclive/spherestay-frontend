import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronRightIcon, CalendarDaysIcon, HeartIcon, BuildingOfficeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Image Imports
import CarRental from '@/assets/images/transport.svg';
import SafariTour from '@/assets/images/mountKenya.svg';
import Safari from '@/assets/images/maasaiMara3.svg';
import Cultural from '@/assets/images/maasaiCulture2.svg';
import AdventureTour from '@/assets/images/adventures.svg';
import BeachTour from '@/assets/images/dianiBeach.svg';
import BoatRiding from '@/assets/images/boatRiding.svg';
import Hotels from '@/assets/images/hotel1.svg';
import Villa from '@/assets/images/lodge2.svg';
import Spa from '@/assets/images/spa.svg';
import CulturalTour from '@/assets/images/maasaiMara.svg';

// Custom SVG Icons from MobileMenu
const CalendarDaysIconComponent = ({ className }) => (
  <CalendarDaysIcon className={className} />
);

const HeartIconComponent = ({ className }) => (
  <HeartIcon className={className} />
);

const BuildingOfficeIconComponent = ({ className }) => (
  <BuildingOfficeIcon className={className} />
);

const UserCircleIconComponent = ({ className }) => (
  <UserCircleIcon className={className} />
);

// Placeholder image for fallbacks
const PlaceholderImage = 'https://via.placeholder.com/150';

// Static default categories (aligned with categorySchema and App.jsx routes)
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

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch categories from the backend
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories', {
        params: { status: 'active' }
      });
      console.log('Raw API response:', response.data); // Debug log
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Use fetched categories if available, otherwise use defaultCategories
  const categories = Array.isArray(data) && data.length > 0 ? data : defaultCategories;

  // Log error for debugging
  if (error) {
    console.error('Error fetching categories:', error.message, error.response?.data);
  }

  // Image mapping for subcategories (aligned with MobileMenu)
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

  // Main navigation links (aligned with MobileMenu)
  const mainNavigation = [
    { label: 'Home', href: '/', icon: null, category: 'main', subCategory: 'home', description: 'Back to home page' },
    { label: 'About', href: '/about', icon: null, category: 'main', subCategory: 'about', description: 'Learn about us' },
    { label: 'Destinations', href: '/destinations', icon: null, category: 'main', subCategory: 'destinations', description: 'Explore our destinations' },
    { label: 'Contact', href: '/contact', icon: null, category: 'main', subCategory: 'contact', description: 'Get in touch' }
  ];

  // Quick actions (aligned with MobileMenu)
  const quickActions = [
    { label: 'My Bookings', icon: CalendarDaysIconComponent, href: '/bookings', description: 'View your bookings' },
    { label: 'Wishlist', icon: HeartIconComponent, href: '/wishlist', description: 'Your saved items' },
    { label: 'Help Center', icon: BuildingOfficeIconComponent, href: '/help', description: 'Get support' },
    { label: 'Profile', icon: UserCircleIconComponent, href: '/account', description: 'Manage your account' }
  ];

  // Transform categories into navigationItems structure
  const navigationItems = categories.reduce((acc, category) => {
    const existingCategory = acc.find(item => item.category === category.type);
    const subcategory = {
      label: category.name,
      // Remove href for subcategories
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
        href: `/${category.type}`, // Keep href for main categories
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

  const handleCategoryClick = (item) => {
    toggleCategory(item.label);
    setActiveItem(item.label);
  };

  const handleSubcategoryClick = (subcategory) => {
    setActiveItem(subcategory.label);
  };

  return (
    <div className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-md border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Explore Categories
          </h3>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* Main Navigation */}
          {mainNavigation.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <Link
                to={item.href}
                onClick={() => setActiveItem(item.label)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-150 block ${
                  activeItem === item.label
                    ? 'bg-orange-50 text-orange-600'
                    : 'hover:bg-orange-50 hover:text-orange-600 text-gray-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className="text-xs text-gray-500 truncate">{item.description}</div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Dynamic Categories */}
          {error ? (
            <div className="p-4 text-sm text-red-500">Failed to load categories: {error.message}</div>
          ) : isLoading ? (
            <div className="p-4 text-sm text-gray-500">Loading categories...</div>
          ) : navigationItems.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              No navigation items available. Please check the configuration.
            </div>
          ) : (
            navigationItems.map((item, index) => (
              <div key={item.label} className="mb-1">
                {/* Main Category - Keep as Link */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (mainNavigation.length + index) * 0.05, duration: 0.2 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => handleCategoryClick(item)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                      activeItem === item.label && !expandedCategories[item.label]
                        ? 'bg-orange-50 text-orange-600'
                        : 'hover:bg-orange-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-6 h-6 object-cover rounded-sm"
                        loading="lazy"
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium">{item.label}</div>
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
                      className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-2"
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
                            onClick={() => handleSubcategoryClick(subcategory)}
                            className={`flex items-center space-x-3 p-2 rounded-md transition-colors duration-150 cursor-pointer ${
                              activeItem === subcategory.label
                                ? 'bg-orange-50 text-orange-600'
                                : 'hover:bg-orange-50 hover:text-orange-600 text-gray-600'
                            }`}
                          >
                            <img
                              src={subcategory.image}
                              alt={subcategory.label}
                              className="w-5 h-5 object-cover rounded-sm flex-shrink-0"
                              loading="lazy"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium truncate">{subcategory.label}</div>
                              <div className="text-xs text-gray-500 truncate">{subcategory.description}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (mainNavigation.length + navigationItems.length + index) * 0.05, duration: 0.2 }}
              >
                <Link
                  to={action.href}
                  onClick={() => setActiveItem(action.label)}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors duration-150 block ${
                    activeItem === action.label
                      ? 'bg-orange-50 text-orange-600'
                      : 'hover:bg-orange-50 hover:text-orange-600 text-gray-700'
                  }`}
                >
                  <action.icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors duration-150" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{action.label}</div>
                    <div className="text-xs text-gray-500 truncate">{action.description}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
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
    </div>
  );
};

export default Sidebar;