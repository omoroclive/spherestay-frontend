import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SpherestayLogo from '@/assets/images/spherestay_kenya_logo.svg';
import MobileMenu from '../header/MobileMenu';
import { Link } from 'react-router-dom';

// Custom SVG Icons
const MagnifyingGlassIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const Bars3Icon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XMarkIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white text-xs py-2 hidden lg:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <PhoneIcon className="w-3 h-3" />
              <span>+254 791 150 726</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPinIcon className="w-3 h-3" />
              <span>Explore Spherestay Kenya</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="opacity-80">Currency: KES</span>
            <span className="opacity-80">|</span>
            <span className="opacity-80">English</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md' 
            : 'bg-white/90 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <img src={SpherestayLogo} alt="Spherestay Logo" className="w-10 h-10 md:w-12 md:h-12" />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Spherestay Kenya
                </h1>
                <p className="text-xs text-gray-600 -mt-0.5">Discover. Explore. Experience.</p>
              </div>
            </motion.div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4 md:mx-6">
              <div className={`relative w-full transition-all duration-200 ${
                searchFocused ? 'scale-105' : ''
              }`}>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Explore Kenya..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none text-sm ${
                      searchFocused 
                        ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500' 
                        : 'border-gray-200 bg-gray-50'
                    } placeholder-gray-400 text-gray-800`}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  <motion.div
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-1.5 rounded-lg hover:shadow-md transition-shadow duration-150">
                      <MagnifyingGlassIcon className="w-4 h-4" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Wishlist */}
              <motion.div
                className="hidden sm:flex"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-1.5 px-2 md:px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                >
                  <HeartIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  <span className="hidden lg:inline text-gray-700 font-medium text-sm">Wishlist</span>
                </Link>
              </motion.div>

              {/* Profile */}
              <motion.div
                className="hidden sm:flex"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/account"
                  className="flex items-center space-x-1.5 px-2 md:px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                >
                  <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  <span className="hidden lg:inline text-gray-700 font-medium text-sm">Account</span>
                </Link>
              </motion.div>

              {/* List Property */}
              <motion.div
                className="hidden sm:flex"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/list-property"
                  className="flex items-center space-x-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium hover:shadow-md transition-shadow duration-150"
                >
                  <span>List Property</span>
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 text-gray-700" />
                ) : (
                  <Bars3Icon className="w-5 h-5 text-gray-700" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Header;