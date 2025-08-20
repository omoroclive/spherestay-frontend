
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaQuestionCircle,
  FaLifeRing,
  FaPaperPlane,
  FaExclamationCircle,
  FaCheck,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaChevronDown // Added missing import
} from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const Help = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: 'How do I book a property or experience?',
      answer: 'Browse properties or experiences on our platform, select your desired dates, and complete the booking process. You can pay securely with M-Pesa or other payment methods.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Cancellation policies vary by property or experience. Check the specific listing for details. Most allow free cancellations up to 48 hours before check-in.',
    },
    {
      question: 'How can I pay with M-Pesa?',
      answer: 'During checkout, select M-Pesa as your payment option, enter your phone number, and follow the prompts to complete the payment.',
    },
    {
      question: 'How do I become a host?',
      answer: 'Register as a host via the "List Your Property" page, provide details about your property, and submit for verification. Our team will guide you through the process.',
    },
  ];

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/help', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage('Your inquiry has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    },
    onError: (error) => {
      setApiError(error.response?.data?.message || 'Failed to send inquiry. Please try again.');
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) 
      newErrors.email = 'Invalid email format';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      mutation.mutate(formData);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://facebook.com/spherestaykenya', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com/spherestaykenya', label: 'Instagram' },
    { icon: FaTwitter, href: 'https://twitter.com/spherestaykenya', label: 'X (Twitter)' },
    { icon: FaTiktok, href: 'https://tiktok.com/@spherestaykenya', label: 'TikTok' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-2 sm:px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-display">
            We're Here to <span className="text-[#E83A17]">Help</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Find answers to common questions or reach out to our support team for personalized assistance.
          </p>
        </motion.div>

        {/* FAQs and Form/Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <FaQuestionCircle className="text-[#E83A17] text-xl sm:text-2xl" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b border-gray-200 pb-4"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left flex justify-between items-center text-sm sm:text-base font-medium text-gray-900 hover:text-[#E83A17] focus:outline-none focus:ring-2 focus:ring-[#E83A17] rounded-lg"
                    aria-expanded={openFaq === index}
                    aria-label={`Toggle FAQ: ${faq.question}`}
                  >
                    <span>{faq.question}</span>
                    <motion.span
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="text-[#006644] text-base sm:text-lg" />
                    </motion.span>
                  </button>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-2 text-sm sm:text-base text-gray-600"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Form and Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Inquiry Form */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <FaLifeRing className="text-[#E83A17] text-xl sm:text-2xl" />
                Need More Help?
              </h2>
              
              {apiError && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 sm:p-4 bg-[#E83A17]/10 text-[#E83A17] rounded-lg flex items-center gap-2 text-sm sm:text-base"
                >
                  <FaExclamationCircle />
                  <span>{apiError}</span>
                </motion.div>
              )}
              
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 sm:p-4 bg-[#006644]/10 text-[#006644] rounded-lg flex items-center gap-2 text-sm sm:text-base"
                >
                  <FaCheck />
                  <span>{successMessage}</span>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {[
                  { name: 'name', placeholder: 'Your full name', icon: FaUser, label: 'Name' },
                  { name: 'email', placeholder: 'Your email address', icon: FaEnvelope, label: 'Email', type: 'email' },
                ].map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} <span className="text-[#E83A17]">*</span>
                    </label>
                    <div className="relative">
                      <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#006644] text-base sm:text-lg" />
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 sm:py-3 min-h-[48px] border ${errors[field.name] ? 'border-[#E83A17]' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-sm sm:text-base bg-white/50 backdrop-blur-sm`}
                        placeholder={field.placeholder}
                        aria-label={field.label}
                      />
                    </div>
                    {errors[field.name] && <p className="mt-1 text-sm text-[#E83A17]">{errors[field.name]}</p>}
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-[#E83A17]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-3 min-h-[100px] border ${errors.message ? 'border-[#E83A17]' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#E83A17] focus:border-transparent text-sm sm:text-base bg-white/50 backdrop-blur-sm resize-y`}
                    placeholder="Describe your issue or question"
                    aria-label="Message"
                  />
                  {errors.message && <p className="mt-1 text-sm text-[#E83A17]">{errors.message}</p>}
                </motion.div>
                
                <motion.button
                  type="submit"
                  disabled={isLoading || mutation.isLoading}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(232, 58, 23, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-[#E83A17] to-[#c53214] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    (isLoading || mutation.isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {(isLoading || mutation.isLoading) ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-base sm:text-lg" />
                      Submit Inquiry
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-b from-[#E83A17] to-[#c53214] text-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <FaLifeRing className="text-xl sm:text-2xl" />
                Contact Support
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {[
                  { icon: FaPhoneAlt, title: 'Phone', value: '+245791150726' },
                  { icon: FaEnvelope, title: 'Email', value: 'Spherestaykenya@gmail.com' },
                  { icon: FaMapMarkerAlt, title: 'Address', value: 'Nairobi, Kenya' },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4"
                  >
                    <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg">
                      <item.icon className="text-2xl sm:text-3xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{item.title}</h3>
                      <p className="text-sm sm:text-base">{item.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/30"
              >
                <h3 className="font-semibold text-base sm:text-lg mb-4">Follow Us</h3>
                <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-full hover:bg-gradient-to-r hover:from-[#FFC72C] hover:to-[#E83A17] transition-all"
                      aria-label={link.label}
                    >
                      <link.icon className="text-2xl sm:text-3xl" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Help;
