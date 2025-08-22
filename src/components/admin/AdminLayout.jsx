import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaBookmark,
  FaUserShield,
  FaMoneyBillWave,
  FaStar,
  FaMapMarkerAlt,
  FaTag,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChartBar,
  FaCog,
  FaCreditCard,
} from 'react-icons/fa';
import { GiKenya } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { logoutUser } from '../../store/slices/authSlice';
import { TextField, IconButton, Menu, MenuItem } from '@mui/material';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Logged out successfully');
    setAnchorEl(null);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/admin/users', label: 'Users', icon: FaUsers },
    { path: '/admin/properties', label: 'Properties', icon: FaBuilding },
    { path: '/admin/public-properties', label: 'Public Properties', icon: FaBookmark },
    { path: '/admin/bookings', label: 'Bookings', icon: FaCreditCard },
    { path: '/admin/employees', label: 'Employees', icon: FaUserShield, superadmin: true },
    { path: '/admin/subscriptions', label: 'Subscriptions', icon: FaMoneyBillWave },
    { path: '/admin/payments', label: 'Payments', icon: FaMoneyBillWave },
    { path: '/admin/reviews', label: 'Reviews', icon: FaStar },
    { path: '/admin/locations', label: 'Locations', icon: FaMapMarkerAlt },
    { path: '/admin/categories-amenities', label: 'Categories & Amenities', icon: FaTag },
    { path: '/admin/expenses', label: 'Expenses', icon: FaMoneyBillWave },
    { path: '/admin/notifications', label: 'Notifications', icon: FaBell },
    { path: '/admin/recommendations', label: 'Recommendations', icon: FaStar },
    { path: '/admin/sessions', label: 'Sessions', icon: FaCog },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
    { path: '/admin/settings', label: 'Settings', icon: FaCog },
  ];

  if (loading) return <LoadingSkeleton height="100vh" />;
  if (!isAuthenticated || !['admin', 'superadmin'].includes(user?.role)) {
    return null; // AdminGuard handles redirect
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed lg:static lg:flex w-64 bg-white shadow-lg z-50 flex-col h-full"
            >
              <div className="p-6 flex items-center gap-2 border-b border-gray-200">
                <GiKenya className="text-[#006644] text-2xl" />
                <h1 className="text-xl font-bold text-gray-900">SphereStay Admin</h1>
                <IconButton className="lg:hidden ml-auto" onClick={toggleSidebar}>
                  <FaTimes className="text-[#E83A17]" />
                </IconButton>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) =>
                  (!item.superadmin || user?.role === 'superadmin') && (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-[#006644] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="text-lg" />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                )}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <IconButton className="lg:hidden" onClick={toggleSidebar}>
                  <FaBars className="text-[#E83A17]" />
                </IconButton>
                <div className="hidden lg:flex items-center gap-2">
                  <GiKenya className="text-[#006644] text-2xl" />
                  <h1 className="text-xl font-bold text-gray-900">SphereStay Admin</h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TextField
                  placeholder="Search users, properties..."
                  size="small"
                  className="w-64"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '9999px',
                      backgroundColor: '#f3f4f6',
                    },
                  }}
                />
                <IconButton>
                  <FaBell className="text-[#006644]" />
                </IconButton>
                <IconButton onClick={handleMenuOpen}>
                  <div className="w-8 h-8 bg-gradient-to-br from-[#006644] to-[#E83A17] rounded-full flex items-center justify-center text-white font-bold">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <NavLink to="/admin/profile">Profile</NavLink>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <FaSignOutAlt className="mr-2" /> Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 pt-24 pb-12 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="mb-6 text-gray-600">
                <NavLink to="/admin" className="hover:text-[#E83A17]">
                  Home
                </NavLink>
                <span className="mx-2">/</span>
                {location.pathname.split('/').pop()}
              </div>
              <Outlet />
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-600">
            <div className="container mx-auto px-4">
              <p>© 2025 SphereStay Kenya 🇰🇪. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminLayout;
