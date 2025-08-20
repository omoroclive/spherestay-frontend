import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchUser, logoutUser, clearAuthError } from '@/store/slices/authSlice';

const Account = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Fetch user data on mount if token exists and user is not loaded
  useEffect(() => {
    if (localStorage.getItem('token') && !user && !loading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const accountOptions = [
    { label: 'Update Profile', href: '/account/update-profile', description: 'Edit your personal details' },
    { label: 'Delete Account', href: '/account/delete-account', description: 'Permanently delete your account' },
    { label: 'Update Password', href: '/account/update-password', description: 'Change your account password' },
    { label: 'Reset Password', href: '/account/reset-password', description: 'Recover your account access' },
    { label: 'Upload Photo', href: '/account/upload-photo', description: 'Add or update your profile picture' },
    { label: 'Submit Verification', href: '/account/submit-verification', description: 'Upgrade to host or business' },
    { label: 'Login', href: '/login', description: 'Sign in to your account' },
    { label: 'Register as Host/Business', href: '/register-host', description: 'Become a host or business partner' },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      {loading ? (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </motion.div>
      ) : error ? (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error || 'An error occurred while loading your account. Please try logging in again.'}
          </p>
          <button
            onClick={() => dispatch(clearAuthError())}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-150"
          >
            Clear Error
          </button>
        </motion.div>
      ) : (
        <motion.section
          className="bg-white rounded-xl shadow-sm p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Your Account</h1>
          <p className="text-sm md:text-base text-gray-600 mb-8">
            Manage your Spherestay Kenya account and explore hosting opportunities.
          </p>

          <div className="grid gap-4">
            {accountOptions.map((option, index) => (
              <motion.div
                key={option.label}
                className="group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link
                  to={option.href}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-500 transition-all duration-150"
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-600">
                      {option.label}
                    </h3>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
            {user && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: accountOptions.length * 0.1, duration: 0.3 }}
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-500 transition-all duration-150"
                >
                  <h3 className="text-base font-semibold text-gray-900 hover:text-red-600">Logout</h3>
                  <p className="text-xs text-gray-500">Sign out of your account</p>
                </button>
              </motion.div>
            )}
          </div>
          <Outlet />
        </motion.section>
      )}
    </div>
  );
};

export default Account;