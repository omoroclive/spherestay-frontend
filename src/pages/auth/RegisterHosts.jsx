
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
  FaBuilding,
  FaFileUpload,
  FaExclamationTriangle,
  FaCheckCircle,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaInfoCircle,
} from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';

const RegisterHosts = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    address: { street: '', city: '', county: '', postalCode: '' },
    role: 'host',
    businessName: '',
    taxPIN: '',
    hostDescription: '',
    socialMedia: { facebook: '', twitter: '', instagram: '', linkedIn: '' },
    website: '',
    idFront: [],
    idBack: [],
    selfie: [],
    isMainIdFront: 0,
    isMainIdBack: 0,
    isMainSelfie: 0,
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu',
    'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
    'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
    'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
    'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi',
    'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
  ];

  // Mutation for submitting registration
  const mutation = useMutation({
    mutationFn: async (formDataToSend) => {
      const response = await api.post('/api/users/signup', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage('Registration successful! Please log in to continue. Your host verification is pending.');
      setTimeout(() => navigate('/login'), 3000);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to register. Please try again.';
      setApiError(message);
      setIsLoading(false);
    },
  });

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))
        newErrors.email = 'Invalid email format';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      else if (!/^\+?\d{10,15}$/.test(formData.phone))
        newErrors.phone = 'Invalid phone number';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8)
        newErrors.password = 'Password must be at least 8 characters';
      if (!formData.passwordConfirm) newErrors.passwordConfirm = 'Please confirm your password';
      else if (formData.password !== formData.passwordConfirm)
        newErrors.passwordConfirm = 'Passwords do not match';
    } else if (step === 2) {
      if (!formData.address.street) newErrors.street = 'Street is required';
      if (!formData.address.city) newErrors.city = 'City is required';
      if (!formData.address.county) newErrors.county = 'County is required';
    } else if (step === 3) {
      if (formData.role === 'business' && !formData.businessName)
        newErrors.businessName = 'Business name is required';
      if (!formData.taxPIN) newErrors.taxPIN = 'Tax PIN is required';
      if (!formData.hostDescription) newErrors.hostDescription = 'Host description is required';
    } else if (step === 4) {
      if (!formData.idFront.length) newErrors.idFront = 'At least one ID front image is required';
      else if (formData.idFront.length > 15) newErrors.idFront = 'Cannot upload more than 15 ID front images';
      else if (!formData.idFront.some((_, idx) => idx === parseInt(formData.isMainIdFront)))
        newErrors.isMainIdFront = 'Exactly one ID front image must be marked as main';
      formData.idFront.forEach((img, idx) => {
        if (!['image/jpeg', 'image/png'].includes(img.type))
          newErrors[`idFront${idx}`] = `ID front image ${idx + 1} must be JPEG or PNG`;
        if (img.size > 5 * 1024 * 1024)
          newErrors[`idFront${idx}`] = `ID front image ${idx + 1} must be under 5MB`;
      });
      if (!formData.idBack.length) newErrors.idBack = 'At least one ID back image is required';
      else if (formData.idBack.length > 15) newErrors.idBack = 'Cannot upload more than 15 ID back images';
      else if (!formData.idBack.some((_, idx) => idx === parseInt(formData.isMainIdBack)))
        newErrors.isMainIdBack = 'Exactly one ID back image must be marked as main';
      formData.idBack.forEach((img, idx) => {
        if (!['image/jpeg', 'image/png'].includes(img.type))
          newErrors[`idBack${idx}`] = `ID back image ${idx + 1} must be JPEG or PNG`;
        if (img.size > 5 * 1024 * 1024)
          newErrors[`idBack${idx}`] = `ID back image ${idx + 1} must be under 5MB`;
      });
      if (!formData.selfie.length) newErrors.selfie = 'At least one selfie image is required';
      else if (formData.selfie.length > 15) newErrors.selfie = 'Cannot upload more than 15 selfie images';
      else if (!formData.selfie.some((_, idx) => idx === parseInt(formData.isMainSelfie)))
        newErrors.isMainSelfie = 'Exactly one selfie image must be marked as main';
      formData.selfie.forEach((img, idx) => {
        if (!['image/jpeg', 'image/png'].includes(img.type))
          newErrors[`selfie${idx}`] = `Selfie image ${idx + 1} must be JPEG or PNG`;
        if (img.size > 5 * 1024 * 1024)
          newErrors[`selfie${idx}`] = `Selfie image ${idx + 1} must be under 5MB`;
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value },
      });
    } else if (name.includes('socialMedia.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        socialMedia: { ...formData.socialMedia, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
    setApiError('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const newFiles = Array.from(files);
    if (formData[name].length + newFiles.length > 15) {
      setErrors({ ...errors, [name]: `Cannot upload more than 15 ${name} images` });
      return;
    }
    setFormData({ ...formData, [name]: [...formData[name], ...newFiles] });
    setErrors({ ...errors, [name]: '', [`isMain${name.charAt(0).toUpperCase() + name.slice(1)}`]: '' });
    setApiError('');
  };

  const handleMainImageChange = (field, index) => {
    setFormData({ ...formData, [`isMain${field.charAt(0).toUpperCase() + field.slice(1)}`]: index });
    setErrors({ ...errors, [`isMain${field.charAt(0).toUpperCase() + field.slice(1)}`]: '' });
  };

  const handleRemoveImage = (field, index) => {
    const newImages = formData[field].filter((_, i) => i !== index);
    const mainField = `isMain${field.charAt(0).toUpperCase() + field.slice(1)}`;
    const newMainImage = formData[mainField] === index ? 0 : formData[mainField] > index ? formData[mainField] - 1 : formData[mainField];
    setFormData({ ...formData, [field]: newImages, [mainField]: newMainImage });
    setErrors({ ...errors, [field]: '', [mainField]: '' });
  };

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

    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('passwordConfirm', formData.passwordConfirm);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('address', JSON.stringify(formData.address));
    formDataToSend.append('businessName', formData.businessName);
    formDataToSend.append('taxPIN', formData.taxPIN);
    formDataToSend.append('hostDescription', formData.hostDescription);
    formDataToSend.append('socialMedia', JSON.stringify(formData.socialMedia));
    formDataToSend.append('website', formData.website);
    formDataToSend.append('isMainIdFront', formData.isMainIdFront);
    formDataToSend.append('isMainIdBack', formData.isMainIdBack);
    formDataToSend.append('isMainSelfie', formData.isMainSelfie);
    formData.idFront.forEach((file) => formDataToSend.append('idFront', file));
    formData.idBack.forEach((file) => formDataToSend.append('idBack', file));
    formData.selfie.forEach((file) => formDataToSend.append('selfie', file));

    mutation.mutate(formDataToSend);
  };

  const steps = [
    { name: 'Personal Info', icon: FaUser },
    { name: 'Address', icon: FaMapMarkerAlt },
    { name: 'Host Info', icon: FaBuilding },
    { name: 'Verification', icon: FaFileUpload },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Become a Host
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Join our platform to list your properties and share unique experiences with travelers across Kenya.
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
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter your first name"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter your last name"
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="+254123456789"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
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
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.street ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter your street address"
                    />
                  </div>
                  {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter your city"
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
                      name="address.county"
                      value={formData.address.county}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                      placeholder="Enter your postal code"
                    />
                  </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    >
                      <option value="host">Individual Host</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
                {formData.role === 'business' && (
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
                        placeholder="Enter your business name"
                      />
                    </div>
                    {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax PIN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="taxPIN"
                      value={formData.taxPIN}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.taxPIN ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                      placeholder="Enter your tax PIN"
                    />
                  </div>
                  {errors.taxPIN && <p className="text-red-500 text-sm mt-1">{errors.taxPIN}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Host Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="hostDescription"
                    value={formData.hostDescription}
                    onChange={handleInputChange}
                    className={`w-full p-4 border ${errors.hostDescription ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]`}
                    placeholder="Tell us about yourself and why you want to host"
                    rows="4"
                  />
                  {errors.hostDescription && <p className="text-red-500 text-sm mt-1">{errors.hostDescription}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Media (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        name="socialMedia.facebook"
                        value={formData.socialMedia.facebook}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Facebook URL"
                      />
                    </div>
                    <div className="relative">
                      <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        name="socialMedia.twitter"
                        value={formData.socialMedia.twitter}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Twitter URL"
                      />
                    </div>
                    <div className="relative">
                      <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        name="socialMedia.instagram"
                        value={formData.socialMedia.instagram}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="Instagram URL"
                      />
                    </div>
                    <div className="relative">
                      <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        name="socialMedia.linkedIn"
                        value={formData.socialMedia.linkedIn}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                        placeholder="LinkedIn URL"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website (Optional)
                  </label>
                  <div className="relative">
                    <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                      placeholder="Enter your website URL"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Front <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="file"
                      name="idFront"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleFileChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    />
                  </div>
                  {formData.idFront.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.idFront.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`ID Front Preview ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <input
                            type="radio"
                            name="isMainIdFront"
                            checked={parseInt(formData.isMainIdFront) === idx}
                            onChange={() => handleMainImageChange('idFront', idx)}
                            className="absolute top-2 right-2"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('idFront', idx)}
                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            &times;
                          </button>
                          <p className="text-sm text-gray-500 mt-1 truncate">{img.name}</p>
                          {errors[`idFront${idx}`] && <p className="text-red-500 text-sm">{errors[`idFront${idx}`]}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.idFront && <p className="text-red-500 text-sm mt-1">{errors.idFront}</p>}
                  {errors.isMainIdFront && <p className="text-red-500 text-sm mt-1">{errors.isMainIdFront}</p>}
                  <p className="text-sm text-gray-500 mt-1">Upload up to 15 JPEG or PNG images (max 5MB each). Select one as main.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Back <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="file"
                      name="idBack"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleFileChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    />
                  </div>
                  {formData.idBack.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.idBack.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`ID Back Preview ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <input
                            type="radio"
                            name="isMainIdBack"
                            checked={parseInt(formData.isMainIdBack) === idx}
                            onChange={() => handleMainImageChange('idBack', idx)}
                            className="absolute top-2 right-2"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('idBack', idx)}
                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            &times;
                          </button>
                          <p className="text-sm text-gray-500 mt-1 truncate">{img.name}</p>
                          {errors[`idBack${idx}`] && <p className="text-red-500 text-sm">{errors[`idBack${idx}`]}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.idBack && <p className="text-red-500 text-sm mt-1">{errors.idBack}</p>}
                  {errors.isMainIdBack && <p className="text-red-500 text-sm mt-1">{errors.isMainIdBack}</p>}
                  <p className="text-sm text-gray-500 mt-1">Upload up to 15 JPEG or PNG images (max 5MB each). Select one as main.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selfie with ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="file"
                      name="selfie"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleFileChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#E83A17] focus:border-[#E83A17]"
                    />
                  </div>
                  {formData.selfie.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.selfie.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Selfie Preview ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <input
                            type="radio"
                            name="isMainSelfie"
                            checked={parseInt(formData.isMainSelfie) === idx}
                            onChange={() => handleMainImageChange('selfie', idx)}
                            className="absolute top-2 right-2"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('selfie', idx)}
                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            &times;
                          </button>
                          <p className="text-sm text-gray-500 mt-1 truncate">{img.name}</p>
                          {errors[`selfie${idx}`] && <p className="text-red-500 text-sm">{errors[`selfie${idx}`]}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.selfie && <p className="text-red-500 text-sm mt-1">{errors.selfie}</p>}
                  {errors.isMainSelfie && <p className="text-red-500 text-sm mt-1">{errors.isMainSelfie}</p>}
                  <p className="text-sm text-gray-500 mt-1">Upload up to 15 JPEG or PNG images (max 5MB each). Select one as main.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-2">
                  <FaInfoCircle className="text-blue-600 mt-1" />
                  <p className="text-sm text-blue-700">
                    Your documents will be reviewed by our team. You'll be notified of your verification status via email.
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
              ) : step === 4 ? (
                'Submit Registration'
              ) : (
                'Next'
              )}
            </motion.button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[#E83A17] hover:underline font-medium"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterHosts;
