import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  FaHome, FaMapMarkerAlt, FaCamera, FaDollarSign, FaBed,
  FaCheckCircle, FaExclamationTriangle, FaBuilding, FaClock,
  FaPaw, FaSmoking, FaTag, FaInfoCircle, FaCar, FaUsers
} from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Mock useAuth hook (replace with actual implementation)
const useAuth = () => ({
  isAuthenticated: true,
  user: { _id: '123', role: 'host' },
});

// Hardcoded categories (mock ObjectIds and names)
const categories = [
  { _id: '507f1f77bcf86cd799439011', name: 'Luxury' },
  { _id: '507f1f77bcf86cd799439012', name: 'Service' },
  { _id: '507f1f77bcf86cd799439013', name: 'Accomodation' },
  { _id: '507f1f77bcf86cd799439014', name: 'Transport' },
  { _id: '507f1f77bcf86cd799439015', name: 'Business' },
  { _id: '507f1f77bcf86cd799439016', name: 'Adventure' },
];

// Hardcoded list of apartment amenities
const amenities = [
  { _id: 'amenity1', name: 'Wi-Fi' },
  { _id: 'amenity2', name: 'Air Conditioning' },
  { _id: 'amenity3', name: 'Heating' },
  { _id: 'amenity4', name: 'Kitchen' },
  { _id: 'amenity5', name: 'TV' },
  { _id: 'amenity6', name: 'Washing Machine' },
  { _id: 'amenity7', name: 'Dryer' },
  { _id: 'amenity8', name: 'Free Parking' },
  { _id: 'amenity9', name: 'Elevator' },
  { _id: 'amenity10', name: 'Gym' },
  { _id: 'amenity11', name: 'Pool' },
  { _id: 'amenity12', name: 'Balcony' },
  { _id: 'amenity13', name: 'Fireplace' },
  { _id: 'amenity14', name: 'Smoke Alarm' },
  { _id: 'amenity15', name: 'First Aid Kit' },
];

const ListProperty = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    businessName: '',
    businessRegistration: '',
    location: { address: '', city: '', county: '', coordinates: { latitude: -1.286389, longitude: 36.817223 }, nearbyLandmarks: [] },
    images: [],
    isMainImage: 0,
    videos: [],
    pricing: { basePrice: '', currency: 'KES', priceUnit: '' },
    capacity: { maxGuests: '', bedrooms: '', bathrooms: '', beds: '', seats: '', transmission: '', fuelType: '', groupSize: { min: '', max: '' }, duration: { value: '', unit: '' } },
    amenities: [],
    features: [],
    availability: { isAvailable: true, minimumStay: 1, maximumStay: 365, advanceBooking: 365, instantBook: false },
    policies: { cancellation: 'moderate', checkIn: { from: '15:00', to: '22:00' }, checkOut: '11:00', houseRules: [], petPolicy: { allowed: false, fee: '' }, smokingPolicy: 'not_allowed' },
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mutation for submitting property
  const mutation = useMutation({
    mutationFn: async (formDataToSend) => {
      const response = await api.post('/api/properties', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage('Property listed successfully! Redirecting to your properties...');
      setTimeout(() => navigate('/my-properties'), 3000);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to list property. Please try again.';
      setApiError(message);
      setIsLoading(false);
    },
  });

  // Redirect if not authenticated or not a host/business
  useEffect(() => {
    if (!isAuthenticated || !['host', 'business'].includes(user?.role)) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu',
    'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
    'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
    'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
    'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi',
    'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.title) newErrors.title = 'Title is required';
      else if (formData.title.length > 100) newErrors.title = 'Title cannot exceed 100 characters';
      if (!formData.description) newErrors.description = 'Description is required';
      else if (formData.description.length > 2000) newErrors.description = 'Description cannot exceed 2000 characters';
      if (!formData.type) newErrors.type = 'Property type is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
    } else if (step === 2) {
      if (!formData.location.address) newErrors.address = 'Address is required';
      if (!formData.location.city) newErrors.city = 'City is required';
      if (!formData.location.county) newErrors.county = 'County is required';
      if (!formData.location.coordinates.latitude) newErrors.latitude = 'Latitude is required';
      else if (formData.location.coordinates.latitude < -90 || formData.location.coordinates.latitude > 90) newErrors.latitude = 'Invalid latitude';
      if (!formData.location.coordinates.longitude) newErrors.longitude = 'Longitude is required';
      else if (formData.location.coordinates.longitude < -180 || formData.location.coordinates.longitude > 180) newErrors.longitude = 'Invalid longitude';
    } else if (step === 3) {
      if (!formData.images.length) newErrors.images = 'At least one image is required';
      else if (formData.images.length > 15) newErrors.images = 'Cannot upload more than 15 images';
      else if (!formData.images.some((_, idx) => idx === parseInt(formData.isMainImage))) newErrors.isMainImage = 'Exactly one image must be marked as main';
      formData.images.forEach((img, idx) => {
        if (!['image/jpeg', 'image/png'].includes(img.type)) newErrors[`image${idx}`] = `Image ${idx + 1} must be JPEG or PNG`;
        if (img.size > 5 * 1024 * 1024) newErrors[`image${idx}`] = `Image ${idx + 1} must be under 5MB`;
      });
      formData.videos.forEach((vid, idx) => {
        if (!['video/mp4'].includes(vid.type)) newErrors[`video${idx}`] = `Video ${idx + 1} must be MP4`;
        if (vid.size > 50 * 1024 * 1024) newErrors[`video${idx}`] = `Video ${idx + 1} must be under 50MB`;
      });
    } else if (step === 4) {
      if (!formData.pricing.basePrice) newErrors.basePrice = 'Base price is required';
      else if (formData.pricing.basePrice < 0) newErrors.basePrice = 'Base price cannot be negative';
      if (!formData.pricing.priceUnit) newErrors.priceUnit = 'Price unit is required';
      if (!formData.capacity.maxGuests) newErrors.maxGuests = 'Maximum guests is required';
      else if (formData.capacity.maxGuests < 1) newErrors.maxGuests = 'Must accommodate at least 1 guest';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      if (field === 'coordinates') {
        const coordField = name.split('.')[2];
        setFormData({
          ...formData,
          location: { ...formData.location, coordinates: { ...formData.location.coordinates, [coordField]: value } },
        });
      } else {
        setFormData({ ...formData, location: { ...formData.location, [field]: value } });
      }
    } else if (name.includes('pricing.')) {
      const field = name.split('.')[1];
      setFormData({ ...formData, pricing: { ...formData.pricing, [field]: value } });
    } else if (name.includes('capacity.')) {
      const field = name.split('.')[1];
      if (field.includes('groupSize.')) {
        const subField = field.split('.')[1];
        setFormData({
          ...formData,
          capacity: { ...formData.capacity, groupSize: { ...formData.capacity.groupSize, [subField]: value } },
        });
      } else if (field.includes('duration.')) {
        const subField = field.split('.')[1];
        setFormData({
          ...formData,
          capacity: { ...formData.capacity, duration: { ...formData.capacity.duration, [subField]: value } },
        });
      } else {
        setFormData({ ...formData, capacity: { ...formData.capacity, [field]: value } });
      }
    } else if (name.includes('policies.')) {
      const field = name.split('.')[1];
      if (field.includes('checkIn.')) {
        const subField = field.split('.')[1];
        setFormData({
          ...formData,
          policies: { ...formData.policies, checkIn: { ...formData.policies.checkIn, [subField]: value } },
        });
      } else if (field.includes('petPolicy.')) {
        const subField = field.split('.')[1];
        setFormData({
          ...formData,
          policies: { ...formData.policies, petPolicy: { ...formData.policies.petPolicy, [subField]: value } },
        });
      } else {
        setFormData({ ...formData, policies: { ...formData.policies, [field]: value } });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
    setApiError('');
  };

  const handleMultiInput = (field, value) => {
    setFormData({ ...formData, [field]: value.split(',').map((item) => item.trim()).filter((item) => item) });
    setErrors({ ...errors, [field]: '' });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const newFiles = Array.from(files);
    if (name === 'images' && formData.images.length + newFiles.length > 15) {
      setErrors({ ...errors, images: 'Cannot upload more than 15 images' });
      return;
    }
    setFormData({ ...formData, [name]: [...formData[name], ...newFiles] });
    setErrors({ ...errors, [name]: '', isMainImage: '' });
    setApiError('');
  };

  const handleMainImageChange = (index) => {
    setFormData({ ...formData, isMainImage: index });
    setErrors({ ...errors, isMainImage: '' });
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newMainImage = formData.isMainImage === index ? 0 : formData.isMainImage > index ? formData.isMainImage - 1 : formData.isMainImage;
    setFormData({ ...formData, images: newImages, isMainImage: newMainImage });
    setErrors({ ...errors, images: '', isMainImage: '' });
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenityId)
        ? formData.amenities.filter((id) => id !== amenityId)
        : [...formData.amenities, amenityId],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < 5) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('businessName', formData.businessName);
    formDataToSend.append('businessRegistration', formData.businessRegistration);
    formDataToSend.append('location', JSON.stringify(formData.location));
    formDataToSend.append('pricing', JSON.stringify(formData.pricing));
    formDataToSend.append('capacity', JSON.stringify(formData.capacity));
    formDataToSend.append('amenities', JSON.stringify(formData.amenities));
    formDataToSend.append('features', JSON.stringify(formData.features));
    formDataToSend.append('availability', JSON.stringify(formData.availability));
    formDataToSend.append('policies', JSON.stringify(formData.policies));
    formDataToSend.append('isMainImage', formData.isMainImage);
    formData.images.forEach((file) => formDataToSend.append('images', file));
    formData.videos.forEach((file) => formDataToSend.append('videos', file));

    mutation.mutate(formDataToSend);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setFormData({
          ...formData,
          location: {
            ...formData.location,
            coordinates: { latitude: e.latlng.lat, longitude: e.latlng.lng },
          },
        });
        setErrors({ ...errors, latitude: '', longitude: '' });
      },
    });
    return null;
  };

  const steps = [
    { name: 'Basic Info', icon: FaHome },
    { name: 'Location', icon: FaMapMarkerAlt },
    { name: 'Media', icon: FaCamera },
    { name: 'Pricing & Capacity', icon: FaDollarSign },
    { name: 'Amenities & Policies', icon: FaTag },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          List Your Property
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Share your unique property with travelers. Fill in the details below to create your listing.
        </p>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((s, index) => (
            <div key={index} className="flex-1 text-center">
              <div
                className={`flex items-center justify-center w-10 h-10 mx-auto rounded-full ${
                  step > index + 1 ? 'bg-[#E83A17] text-white' : step === index + 1 ? 'bg-[#E83A17] text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <s.icon className="text-lg" />
              </div>
              <p className="text-sm mt-2 font-medium text-gray-700">{s.name}</p>
            </div>
          ))}
        </div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-2"
            >
              <FaExclamationTriangle />
              <span>{apiError}</span>
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg flex items-center gap-2"
            >
              <FaCheckCircle />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter property title"
                    />
                  </div>
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter business name"
                    />
                  </div>
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full p-4 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                    placeholder="Describe your property"
                    rows="4"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                    >
                      <option value="">Select property type</option>
                      {['hotel', 'villa', 'apartment', 'car', 'tour', 'restaurant', 'experience', 'spa', 'other'].map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Registration (Optional)
                  </label>
                  <input
                    type="text"
                    name="businessRegistration"
                    value={formData.businessRegistration}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    placeholder="Enter business registration number"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter street address"
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter city"
                    />
                  </div>
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    County <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="location.county"
                      value={formData.location.county}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.county ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                    >
                      <option value="">Select a county</option>
                      {counties.map((county) => (
                        <option key={county} value={county}>
                          {county}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.county && <p className="text-red-500 text-sm mt-1">{errors.county}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coordinates <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        name="location.coordinates.latitude"
                        value={formData.location.coordinates.latitude}
                        onChange={handleInputChange}
                        className={`w-full pl-4 pr-4 py-2 border ${errors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                        placeholder="Latitude"
                      />
                      {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
                    </div>
                    <div>
                      <input
                        type="number"
                        name="location.coordinates.longitude"
                        value={formData.location.coordinates.longitude}
                        onChange={handleInputChange}
                        className={`w-full pl-4 pr-4 py-2 border ${errors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                        placeholder="Longitude"
                      />
                      {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
                    </div>
                  </div>
                  <div className="mt-4 h-64 rounded-lg overflow-hidden">
                    <MapContainer
                      center={[formData.location.coordinates.latitude, formData.location.coordinates.longitude]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[formData.location.coordinates.latitude, formData.location.coordinates.longitude]} />
                      <MapClickHandler />
                    </MapContainer>
                    <p className="text-sm text-gray-500 mt-2">Click on the map to set coordinates</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nearby Landmarks (Optional)
                  </label>
                  <input
                    type="text"
                    name="location.nearbyLandmarks"
                    value={formData.location.nearbyLandmarks.join(', ')}
                    onChange={(e) => handleMultiInput('location.nearbyLandmarks', e.target.value)}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    placeholder="Enter landmarks, separated by commas"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="images"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={handleFileChange}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <input
                            type="radio"
                            name="isMainImage"
                            checked={parseInt(formData.isMainImage) === idx}
                            onChange={() => handleMainImageChange(idx)}
                            className="absolute top-2 right-2"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            &times;
                          </button>
                          <p className="text-sm text-gray-500 mt-1 truncate">{img.name}</p>
                          {errors[`image${idx}`] && <p className="text-red-500 text-sm">{errors[`image${idx}`]}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                  {errors.isMainImage && <p className="text-red-500 text-sm mt-1">{errors.isMainImage}</p>}
                  <p className="text-sm text-gray-500 mt-1">Upload up to 15 JPEG/PNG images (max 5MB each). Select one as main.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Videos (Optional)
                  </label>
                  <input
                    type="file"
                    name="videos"
                    accept="video/mp4"
                    multiple
                    onChange={handleFileChange}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                  />
                  {formData.videos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.videos.map((vid, idx) => (
                        <p key={idx} className="text-sm text-gray-500">
                          {vid.name}
                          {errors[`video${idx}`] && <span className="text-red-500 text-sm ml-2">{errors[`video${idx}`]}</span>}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Upload MP4 videos (max 50MB each).</p>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="pricing.basePrice"
                      value={formData.pricing.basePrice}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.basePrice ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter base price"
                    />
                  </div>
                  {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="pricing.currency"
                      value={formData.pricing.currency}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    >
                      {['KES', 'USD', 'EUR'].map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Unit <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="pricing.priceUnit"
                      value={formData.pricing.priceUnit}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.priceUnit ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                    >
                      <option value="">Select price unit</option>
                      {['night', 'hour', 'day', 'week', 'month', 'person', 'group', 'km', 'mile'].map((unit) => (
                        <option key={unit} value={unit}>
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.priceUnit && <p className="text-red-500 text-sm mt-1">{errors.priceUnit}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Guests <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="capacity.maxGuests"
                      value={formData.capacity.maxGuests}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.maxGuests ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter max guests"
                    />
                  </div>
                  {errors.maxGuests && <p className="text-red-500 text-sm mt-1">{errors.maxGuests}</p>}
                </div>
                {['hotel', 'villa', 'apartment'].includes(formData.type) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        name="capacity.bedrooms"
                        value={formData.capacity.bedrooms}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Enter number of bedrooms"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        name="capacity.bathrooms"
                        value={formData.capacity.bathrooms}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Enter number of bathrooms"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Beds
                      </label>
                      <input
                        type="number"
                        name="capacity.beds"
                        value={formData.capacity.beds}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Enter number of beds"
                      />
                    </div>
                  </>
                )}
                {formData.type === 'car' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seats
                      </label>
                      <input
                        type="number"
                        name="capacity.seats"
                        value={formData.capacity.seats}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Enter number of seats"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transmission
                      </label>
                      <select
                        name="capacity.transmission"
                        value={formData.capacity.transmission}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                      >
                        <option value="">Select transmission</option>
                        {['manual', 'automatic'].map((t) => (
                          <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fuel Type
                      </label>
                      <select
                        name="capacity.fuelType"
                        value={formData.capacity.fuelType}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                      >
                        <option value="">Select fuel type</option>
                        {['petrol', 'diesel', 'hybrid', 'electric'].map((f) => (
                          <option key={f} value={f}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                {['tour', 'experience'].includes(formData.type) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Size (Min)
                      </label>
                      <input
                        type="number"
                        name="capacity.groupSize.min"
                        value={formData.capacity.groupSize.min}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Minimum group size"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Size (Max)
                      </label>
                      <input
                        type="number"
                        name="capacity.groupSize.max"
                        value={formData.capacity.groupSize.max}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Maximum group size"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          name="capacity.duration.value"
                          value={formData.capacity.duration.value}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                          placeholder="Duration value"
                        />
                        <select
                          name="capacity.duration.unit"
                          value={formData.capacity.duration.unit}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        >
                          <option value="">Select unit</option>
                          {['hours', 'days', 'weeks'].map((unit) => (
                            <option key={unit} value={unit}>
                              {unit.charAt(0).toUpperCase() + unit.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-4">
                    {amenities.map((amenity) => (
                      <label key={amenity._id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity._id)}
                          onChange={() => handleAmenityToggle(amenity._id)}
                          className="h-4 w-4 text-[#E83A17] focus:ring-[#E83A17]"
                        />
                        <span className="text-sm text-gray-700">{amenity.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features (Optional)
                  </label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features.join(', ')}
                    onChange={(e) => handleMultiInput('features', e.target.value)}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    placeholder="Enter features, separated by commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="availability.isAvailable"
                      checked={formData.availability.isAvailable}
                      onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, isAvailable: e.target.checked } })}
                      className="h-4 w-4 text-[#E83A17] focus:ring-[#E83A17]"
                    />
                    <span className="text-sm text-gray-700">Property is available</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instant Book
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="availability.instantBook"
                      checked={formData.availability.instantBook}
                      onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, instantBook: e.target.checked } })}
                      className="h-4 w-4 text-[#E83A17] focus:ring-[#E83A17]"
                    />
                    <span className="text-sm text-gray-700">Allow instant booking</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stay (days)
                  </label>
                  <input
                    type="number"
                    name="availability.minimumStay"
                    value={formData.availability.minimumStay}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    placeholder="Minimum stay"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Stay (days)
                  </label>
                  <input
                    type="number"
                    name="availability.maximumStay"
                    value={formData.availability.maximumStay}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    placeholder="Maximum stay"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Advance Booking (days)
                  </label>
                  <input
                    type="number"
                    name="availability.advanceBooking"
                    value={formData.availability.advanceBooking}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    placeholder="Advance booking days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cancellation Policy
                  </label>
                  <select
                    name="policies.cancellation"
                    value={formData.policies.cancellation}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                  >
                    {['flexible', 'moderate', 'strict', 'super_strict'].map((policy) => (
                      <option key={policy} value={policy}>
                        {policy.charAt(0).toUpperCase() + policy.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Time
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        name="policies.checkIn.from"
                        value={formData.policies.checkIn.from}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                      />
                    </div>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        name="policies.checkIn.to"
                        value={formData.policies.checkIn.to}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Time
                  </label>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      name="policies.checkOut"
                      value={formData.policies.checkOut}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Policy
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="policies.petPolicy.allowed"
                      checked={formData.policies.petPolicy.allowed}
                      onChange={(e) => setFormData({ ...formData, policies: { ...formData.policies, petPolicy: { ...formData.policies.petPolicy, allowed: e.target.checked } } })}
                      className="h-4 w-4 text-[#E83A17] focus:ring-[#E83A17]"
                    />
                    <span className="text-sm text-gray-700">Pets allowed</span>
                  </label>
                  {formData.policies.petPolicy.allowed && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pet Fee
                      </label>
                      <input
                        type="number"
                        name="policies.petPolicy.fee"
                        value={formData.policies.petPolicy.fee}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Enter pet fee"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Smoking Policy
                  </label>
                  <select
                    name="policies.smokingPolicy"
                    value={formData.policies.smokingPolicy}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                  >
                    {['not_allowed', 'allowed', 'designated_areas'].map((policy) => (
                      <option key={policy} value={policy}>
                        {policy.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    House Rules (Optional)
                  </label>
                  <input
                    type="text"
                    name="policies.houseRules"
                    value={formData.policies.houseRules.join(', ')}
                    onChange={(e) => handleMultiInput('policies.houseRules', e.target.value)}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    placeholder="Enter house rules, separated by commas"
                  />
                </div>
                <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg flex items-start gap-2">
                  <FaInfoCircle className="text-blue-600 mt-1" />
                  <p className="text-sm text-blue-700">
                    Your property will be reviewed by our team. You'll be notified of the verification status via email.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <motion.button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>
            )}
            <motion.button
              type="submit"
              disabled={isLoading || mutation.isLoading}
              className={`px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors flex items-center gap-2 ${
                (isLoading || mutation.isLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {(isLoading || mutation.isLoading) ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Submitting...
                </>
              ) : step === 5 ? (
                'Submit Listing'
              ) : (
                'Next'
              )}
            </motion.button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          View your properties?{' '}
          <button onClick={() => navigate('/my-properties')} className="text-[#E83A17] hover:underline font-medium">
            My Properties
          </button>
        </p>
      </div>
    </div>
  );
};

export default ListProperty;