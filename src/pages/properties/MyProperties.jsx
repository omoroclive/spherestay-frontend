import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import EditProperty from './EditProperties';
import {
  FaHome, FaTrash, FaEdit, FaCamera, FaCheckCircle, FaExclamationTriangle, FaSignInAlt, FaPlus
} from 'react-icons/fa';

const MyProperties = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [selectedForMedia, setSelectedForMedia] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch my properties
  const { data: properties, isLoading: isPropertiesLoading, error: propertiesError } = useQuery({
    queryKey: ['myProperties'],
    queryFn: async () => {
      const response = await api.get('/api/properties/my-properties');
      return response.data;
    },
    enabled: isAuthenticated && ['host', 'business'].includes(user?.role),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProperties']);
      setSuccessMessage('Property deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setApiError(error.response?.data?.message || 'Failed to delete property. Please try again.');
    },
  });

  // Add media mutation
  const addMediaMutation = useMutation({
    mutationFn: async ({ id, formDataToSend }) => {
      await api.post(`/api/properties/${id}/add-images`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProperties']);
      setSuccessMessage('Images added successfully!');
      setMediaFiles([]);
      setSelectedForMedia(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setApiError(error.response?.data?.message || 'Failed to add images. Please try again.');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 15) {
      setApiError('Cannot upload more than 15 images.');
      return;
    }
    files.forEach((file, idx) => {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setApiError(`Image ${idx + 1} must be JPEG or PNG.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setApiError(`Image ${idx + 1} must be under 5MB.`);
        return;
      }
    });
    setMediaFiles(files);
    setApiError('');
  };

  const handleAddMedia = (e) => {
    e.preventDefault();
    if (mediaFiles.length === 0) {
      setApiError('Please select at least one image to upload.');
      return;
    }
    const formDataToSend = new FormData();
    mediaFiles.forEach((file) => formDataToSend.append('images', file));
    addMediaMutation.mutate({ id: selectedForMedia._id, formDataToSend });
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to log in to view your properties.</p>
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignInAlt /> Log In
            </motion.button>
            <motion.button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome /> Back to Home
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but not host/business
  if (!['host', 'business'].includes(user?.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Register as Host</h2>
          <p className="text-gray-600 mb-6">You need to register as a host to list and manage properties.</p>
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={() => navigate('/register-host')}
              className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Register as Host
            </motion.button>
            <motion.button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome /> Back to Home
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isPropertiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="animate-spin h-5 w-5 text-[#E83A17]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading properties...
        </div>
      </div>
    );
  }

  // Error fetching properties
  if (propertiesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Properties</h2>
          <p className="text-gray-600 mb-6">{propertiesError.message || 'Failed to load properties. Please try again later.'}</p>
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={() => queryClient.invalidateQueries(['myProperties'])}
              className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
            <motion.button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome /> Back to Home
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // No properties
  if (properties?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <FaHome className="text-gray-400 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Properties Listed</h2>
          <p className="text-gray-600 mb-6">You haven't listed any properties yet. Start by adding a new property!</p>
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={() => navigate('/list-property')}
              className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> List a Property
            </motion.button>
            <motion.button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome /> Back to Home
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Properties</h2>
          <motion.button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome /> Back to Home
          </motion.button>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-2"
            >
              <FaExclamationTriangle /> {apiError}
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2"
            >
              <FaCheckCircle /> {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map((prop) => (
            <motion.div
              key={prop._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              {prop.images && prop.images[prop.isMainImage] ? (
                <img src={prop.images[prop.isMainImage]} alt={prop.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <FaHome className="text-4xl text-gray-400" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{prop.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{prop.description}</p>
                <div className="flex justify-between gap-2">
                  <motion.button
                    onClick={() => setSelectedForEdit(prop._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEdit /> Edit
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedForMedia(prop)}
                    className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaCamera /> Add Pics
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(prop._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTrash /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {selectedForEdit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl w-full m-4"
              >
                <EditProperty
                  id={selectedForEdit}
                  onClose={() => setSelectedForEdit(null)}
                  onSuccess={() => queryClient.invalidateQueries(['myProperties'])}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Media Modal */}
        <AnimatePresence>
          {selectedForMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full m-4"
              >
                <h3 className="text-xl font-bold mb-4">Add Pictures to {selectedForMedia.title}</h3>
                <form onSubmit={handleAddMedia}>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png"
                    onChange={handleMediaChange}
                    className="w-full mb-4 p-2 border rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mb-4">Upload up to 15 JPEG/PNG images (max 5MB each).</p>
                  <div className="flex justify-end gap-2">
                    <motion.button
                      type="button"
                      onClick={() => setSelectedForMedia(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={addMediaMutation.isLoading || mediaFiles.length === 0}
                      className={`px-4 py-2 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors ${
                        addMediaMutation.isLoading || mediaFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {addMediaMutation.isLoading ? 'Adding...' : 'Add'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyProperties;