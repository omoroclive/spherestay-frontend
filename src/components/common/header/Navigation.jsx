import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Custom SVG Icons
const CalendarDaysIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12V12.75Z" />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const BuildingOfficeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
  </svg>
);

const UserCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const Navigation = ({ className = "" }) => {
  const [activeItem, setActiveItem] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const mainNavigation = [
    { label: 'Home', href: '/', image: null, category: 'main', subCategory: 'home', description: 'Back to homepage' },
    { label: 'About', href: '/about', image: null, category: 'main', subCategory: 'about', description: 'Learn about us' },
    { label: 'Destinations', href: '/destinations', image: null, category: 'main', subCategory: 'destinations', description: 'Explore our destinations' },
    { label: 'Contact', href: '/contact', image: null, category: 'main', subCategory: 'contact', description: 'Get in touch' }
  ];

  const navigationItems = [
    {
      label: 'Transport',
      icon: CarRental,
      category: 'transport',
      description: 'Travel & mobility',
      subcategories: [
        { label: 'Car Rental', href: '/transport', image: CarRental, subCategory: 'car_rental', description: 'Vehicle rentals' },
        { label: 'Airport Transfer', href: '/transport', image: SafariTour, subCategory: 'transfer', description: 'Airport shuttles' }
      ]
    },
    {
      label: 'Experience',
      icon: Adventure,
      category: 'experience',
      description: 'Adventures & tours',
      subcategories: [
        { label: 'Safari Tours', href: '/experience/safari', image: Safari, subCategory: 'safari', description: 'Wildlife adventures' },
        { label: 'Cultural Tours', href: '/culture-tour', image: Cultural, subCategory: 'cultural_tour', description: 'Local traditions' },
        { label: 'Adventure Tours', href: '/experience/adventure', image: AdventureTour, subCategory: 'adventure_tour', description: 'Thrilling activities' },
        { label: 'Beach Tours', href: '/beach', image: BeachTour, subCategory: 'beach_tour', description: 'Coastal adventures' },
        { label: 'Boat Riding', href: '/experience/boat', image: BoatRiding, subCategory: 'boat_riding', description: 'Water activities' }
      ]
    },
    {
      label: 'Accommodation',
      icon: Hotels,
      category: 'accommodation',
      description: 'Places to stay',
      subcategories: [
        { label: 'Hotels', href: '/accommodation', image: Hotels, subCategory: 'hotel', description: 'Luxury stays' },
        { label: 'Villas', href: '/accommodation/villas', image: Villa, subCategory: 'villa', description: 'Private retreats' },
        { label: 'Lodges', href: '/accommodation/lodges', image: Safari, subCategory: 'lodge', description: 'Safari lodges' }
      ]
    },
    {
      label: 'Services',
      icon: Spa,
      category: 'services',
      description: 'Additional services',
      subcategories: [
        { label: 'Spa & Wellness', href: '/services', image: Spa, subCategory: 'spa', description: 'Relaxation services' },
        { label: 'Cultural Experiences', href: '/services/cultural', image: CulturalTour, subCategory: 'cultural_service', description: 'Immersive culture' }
      ]
    }
  ];

  const quickActions = [
    { label: 'My Bookings', icon: CalendarDaysIcon, href: '/bookings', description: 'View your bookings' },
    { label: 'Wishlist', icon: HeartIcon, href: '/wishlist', description: 'Your saved items' },
    { label: 'Help Center', icon: BuildingOfficeIcon, href: '/help', description: 'Get support' },
    { label: 'Profile', icon: UserCircleIcon, href: '/account', description: 'Manage your account' },
  ];

  const handleMouseEnter = (label) => {
    setActiveItem(label);
    setExpandedCategory(label);
  };

  const handleMouseLeave = () => {
    setActiveItem('');
    setExpandedCategory(null);
  };

  return (
    <nav className={`${className} flex items-center space-x-2 md:space-x-3`}>
      {/* Main Navigation */}
      {mainNavigation.map((item, index) => (
        <motion.a
          key={item.label}
          href={`${item.href}?category=${item.category}&subCategory=${item.subCategory}`}
          className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base ${
            activeItem === item.label
              ? 'text-orange-600 bg-orange-50'
              : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
          }`}
          onMouseEnter={() => setActiveItem(item.label)}
          onMouseLeave={() => setActiveItem('')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>{item.label}</span>
          {activeItem === item.label && (
            <motion.div
              className="absolute bottom-0 left-1/2 w-10 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              layoutId="activeNavItem"
              initial={{ opacity: 0, x: '-50%' }}
              animate={{ opacity: 1, x: '-50%' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </motion.a>
      ))}

      {/* Categorized Navigation with Dropdowns */}
      {navigationItems.map((item, index) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.label)}
          onMouseLeave={handleMouseLeave}
        >
          <motion.button
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base ${
              activeItem === item.label
                ? 'text-orange-600 bg-orange-50'
                : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <img
              src={item.icon}
              alt={item.label}
              className="w-6 h-6 md:w-7 md:h-7 object-cover rounded-sm"
              loading="lazy"
            />
            <span>{item.label}</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            {activeItem === item.label && (
              <motion.div
                className="absolute bottom-0 left-1/2 w-10 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                layoutId="activeNavItem"
                initial={{ opacity: 0, x: '-50%' }}
                animate={{ opacity: 1, x: '-50%' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>

          <AnimatePresence>
            {expandedCategory === item.label && (
              <motion.div
                className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-100 z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2">
                  {item.subcategories.map((subcategory, subIndex) => (
                    <motion.a
                      key={subcategory.label}
                      href={`${subcategory.href}?category=${item.category}&subCategory=${subcategory.subCategory}`}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-orange-50 transition-colors duration-150 group block"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: subIndex * 0.05, duration: 0.15 }}
                    >
                      <img
                        src={subcategory.image}
                        alt={subcategory.label}
                        className="w-6 h-6 object-cover rounded-sm flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 group-hover:text-orange-600 text-sm transition-colors duration-150 truncate">
                          {subcategory.label}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{subcategory.description}</div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Quick Actions */}
      {quickActions.map((action, index) => (
        <motion.a
          key={action.label}
          href={`${action.href}?category=quick&subCategory=${action.label.toLowerCase().replace(' ', '_')}`}
          className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm md:text-base ${
            activeItem === action.label
              ? 'text-orange-600 bg-orange-50'
              : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
          }`}
          onMouseEnter={() => setActiveItem(action.label)}
          onMouseLeave={() => setActiveItem('')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <action.icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors duration-150" />
          <span>{action.label}</span>
          {activeItem === action.label && (
            <motion.div
              className="absolute bottom-0 left-1/2 w-10 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              layoutId="activeNavItem"
              initial={{ opacity: 0, x: '-50%' }}
              animate={{ opacity: 1, x: '-50%' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </motion.a>
      ))}
    </nav>
  );
};

export default Navigation;