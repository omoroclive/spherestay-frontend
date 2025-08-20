// EditProperty.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  FaHome, FaMapMarkerAlt, FaDollarSign, FaBed,
  FaCheckCircle, FaExclamationTriangle, FaBuilding, FaClock,
  FaPaw, FaSmoking, FaTag, FaInfoCircle, FaCar, FaUsers, FaTimes
} from 'react-icons/fa';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/services/api';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Hardcoded categories
const categories = [
  { _id: '507f1f77bcf86cd799439011', name: 'Luxury' },
  { _id: '507f1f77bcf86cd799439012', name: 'Service' },
  { _id: '507f1f77bcf86cd799439013', name: 'Accomodation' },
  { _id: '507f1f77bcf86cd799439014', name: 'Transport' },
  { _id: '507f1f77bcf86cd799439015', name: 'Business' },
  { _id: '507f1f77bcf86cd799439016', name: 'Adventure' },
];

// Hardcoded amenities
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

const EditProperty = ({ id, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    businessName: '',
    businessRegistration: '',
    location: { address: '', city: '', county: '', coordinates: { latitude: -1.286389, longitude: 36.817223 }, nearbyLandmarks: [] },
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

  // Fetch property data
  const { data: property, isLoading: isPropertyLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get(`/api/properties/${id}`);
      return response.data;
    },
  });

  // Set form data when property is fetched
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        type: property.type || '',
        category: property.category || '',
        businessName: property.businessName || '',
        businessRegistration: property.businessRegistration || '',
        location: property.location || { address: '', city: '', county: '', coordinates: { latitude: -1.286389, longitude: 36.817223 }, nearbyLandmarks: [] },
        pricing: property.pricing || { basePrice: '', currency: 'KES', priceUnit: '' },
        capacity: property.capacity || { maxGuests: '', bedrooms: '', bathrooms: '', beds: '', seats: '', transmission: '', fuelType: '', groupSize: { min: '', max: '' }, duration: { value: '', unit: '' } },
        amenities: property.amenities || [],
        features: property.features || [],
        availability: property.availability || { isAvailable: true, minimumStay: 1, maximumStay: 365, advanceBooking: 365, instantBook: false },
        policies: property.policies || { cancellation: 'moderate', checkIn: { from: '15:00', to: '22:00' }, checkOut: '11:00', houseRules: [], petPolicy: { allowed: false, fee: '' }, smokingPolicy: 'not_allowed' },
      });
    }
  }, [property]);

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

  const handleAmenityToggle = (amenityId) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenityId)
        ? formData.amenities.filter((id) => id !== amenityId)
        : [...formData.amenities, amenityId],
    });
  };

  const mutation = useMutation({
    mutationFn: async (formDataToSend) => {
      const response = await api.put(`/api/properties/${id}`, formDataToSend);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage('Property updated successfully!');
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 3000);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update property. Please try again.';
      setApiError(message);
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    const formDataToSend = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      businessName: formData.businessName,
      businessRegistration: formData.businessRegistration,
      location: formData.location,
      pricing: formData.pricing,
      capacity: formData.capacity,
      amenities: formData.amenities,
      features: formData.features,
      availability: formData.availability,
      policies: formData.policies,
    };

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
    { name: 'Pricing & Capacity', icon: FaDollarSign },
    { name: 'Amenities & Policies', icon: FaTag },
  ];

  if (isPropertyLoading) return <div>Loading property data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Edit Property</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={24} />
        </button>
      </div>
      <p className="text-gray-600 mb-8">
        Update your property details below.
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

      {/* Messages */}
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
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Same as ListProperty step 1 */}
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
              {/* Same as ListProperty step 2 */}
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Same as ListProperty step 4 */}
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

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Same as ListProperty step 5 */}
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
                  Changes will be reviewed if necessary. You'll be notified via email.
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
            {(isLoading || mutation.isLoading) ? 'Updating...' : step === 4 ? 'Update Property' : 'Next'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;