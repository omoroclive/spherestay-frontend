import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Sidebar from './header/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './footer/Footer';
import useMobileDetection from '../../hooks/useMobileDetection'; // Suggested custom hook

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobileDetection(); // Hook to detect mobile devices

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with mobile menu toggle */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex flex-1 items-center justify-center">
        {/* Sidebar - conditionally rendered on mobile */}
        {!isMobile ? (
          <Sidebar />
        ) : (
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'tween', duration: 0.2 }}
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Content Column */}
        <div className={`flex-1 flex flex-col transition-all duration-200 ${
          !isMobile ? 'lg:ml-64' : ''
        }`}>
          {/* Main Content */}
          <motion.main
            className="flex-1 container mx-auto px-4 sm:px-6 py-4 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={location.pathname} // Add this if using react-router location
          >
            <Outlet />
          </motion.main>

          {/* Footer */}
          <Footer />
        </div>

        {/* Mobile overlay when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(MainLayout);