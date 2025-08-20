import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserCheck, FaMapMarkedAlt, FaHome, FaUser, FaGavel } from 'react-icons/fa';
import heroBackground from '@/assets/images/rusinga2.svg'; // Reusing from About.jsx
import termsImage from '@/assets/images/mountKenya.svg'; // Reusing from Policy.jsx

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroBackground})` }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </motion.div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-6 font-serif tracking-tight"
          >
            Terms of <span className="text-[#FFC72C]">Service</span>
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto"
          >
            Understand the terms governing your use of Spherestay Kenya, including user eligibility, location verification, and responsibilities for hosts and guests.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 -mt-16 relative z-10">
        {/* User Eligibility */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16"
        >
          <div className="grid md:grid-cols-2">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E83A17]/10 p-3 rounded-full">
                  <FaUserCheck className="text-[#E83A17] text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">User Eligibility</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To ensure a safe and compliant platform, users must meet the following eligibility criteria.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                    <FaUserCheck className="text-[#E83A17] text-sm" />
                  </div>
                  <span><strong>Minimum Age:</strong> Users must be at least 18 years old to create an account or make bookings on Spherestay Kenya.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                    <FaUserCheck className="text-[#E83A17] text-sm" />
                  </div>
                  <span><strong>Verification:</strong> Users must provide valid identification (e.g., national ID, passport) during account creation or booking for verification purposes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                    <FaUserCheck className="text-[#E83A17] text-sm" />
                  </div>
                  <span><strong>Account Responsibility:</strong> Users are responsible for maintaining the confidentiality of their account credentials and all activities under their account.</span>
                </li>
              </ul>
              <Link
                to="/login"
                className="inline-flex items-center justify-center mt-8 bg-[#E83A17] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c53214] transition-all shadow-md"
                aria-label="Log in to your account"
              >
                Log In or Sign Up
              </Link>
            </div>
            <div className="hidden md:block relative">
              <img
                src={termsImage}
                alt="User eligibility illustration"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* Location Verification */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-[#006644] to-[#003D2B] text-white rounded-2xl shadow-2xl overflow-hidden mb-16"
        >
          <div className="grid md:grid-cols-2">
            <div className="p-8 sm:p-10 lg:p-12 order-last md:order-first">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <FaMapMarkedAlt className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Location Verification</h2>
              </div>
              <p className="mb-6 leading-relaxed">
                Accurate property locations are critical for trust and safety on our platform.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaMapMarkedAlt className="text-white text-sm" />
                  </div>
                  <span><strong>Coordinates:</strong> Hosts must provide precise longitude (between -180 and 180) and latitude (between -90 and 90) coordinates for each property, validated against Kenyan counties.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaMapMarkedAlt className="text-white text-sm" />
                  </div>
                  <span><strong>Verification Process:</strong> Our team verifies coordinates using geospatial data to ensure accuracy, typically within 48 hours of listing submission.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaMapMarkedAlt className="text-white text-sm" />
                  </div>
                  <span><strong>Compliance:</strong> Properties with inaccurate or unverified locations may be suspended until corrected.</span>
                </li>
              </ul>
              <Link
                to="/register-host"
                className="inline-flex items-center justify-center mt-8 bg-white text-[#006644] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md"
                aria-label="Register as a host"
              >
                Become a Host
              </Link>
            </div>
            <div className="relative h-64 md:h-auto">
              <img
                src={termsImage}
                alt="Location verification illustration"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* Host Terms */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16"
        >
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#FFC72C]/10 p-3 rounded-full">
                <FaHome className="text-[#FFC72C] text-2xl" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Host Terms</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Hosts are expected to uphold high standards to ensure a positive experience for guests.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-[#FFC72C]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaHome className="text-[#FFC72C] text-sm" />
                </div>
                <span><strong>Accurate Listings:</strong> Provide truthful information about your property, including amenities, pricing, and availability.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#FFC72C]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaHome className="text-[#FFC72C] text-sm" />
                </div>
                <span><strong>Guest Safety:</strong> Ensure properties meet safety standards (e.g., fire exits, first aid kits) and comply with local regulations.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#FFC72C]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaHome className="text-[#FFC72C] text-sm" />
                </div>
                <span><strong>Timely Communication:</strong> Respond to guest inquiries and booking requests within 24 hours.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#FFC72C]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaHome className="text-[#FFC72C] text-sm" />
                </div>
                <span><strong>Cancellation Policy:</strong> Adhere to our cancellation policy, providing full refunds for host-initiated cancellations unless extenuating circumstances apply.</span>
              </li>
            </ul>
            <Link
              to="/register-host"
              className="inline-flex items-center justify-center mt-8 bg-[#E83A17] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c53214] transition-all shadow-md"
              aria-label="Become a host"
            >
              Start Hosting
            </Link>
          </div>
        </motion.section>

        {/* Guest Terms */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-[#FFC72C] to-[#E83A17] text-white rounded-2xl shadow-2xl overflow-hidden mb-16"
        >
          <div className="grid md:grid-cols-2">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <FaUser className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Guest Terms</h2>
              </div>
              <p className="mb-6 leading-relaxed">
                Guests must adhere to the following terms to ensure a respectful and safe experience.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span><strong>Property Respect:</strong> Treat properties with care, following house rules (e.g., no smoking, no unauthorized guests).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span><strong>Accurate Information:</strong> Provide accurate personal and booking details during the reservation process.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span><strong>Safety Compliance:</strong> Follow safety guidelines provided by hosts and local authorities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span><strong>Booking Terms:</strong> Agree to the cancellation policy and payment terms at the time of booking.</span>
                </li>
              </ul>
              <Link
                to="/properties"
                className="inline-flex items-center justify-center mt-8 bg-white text-[#E83A17] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md"
                aria-label="Explore properties"
              >
                Explore Properties
              </Link>
            </div>
            <div className="relative h-64 md:h-auto">
              <img
                src={termsImage}
                alt="Guest terms illustration"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* General Terms */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#E83A17]/10 p-3 rounded-full">
                <FaGavel className="text-[#E83A17] text-2xl" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">General Terms</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Additional terms governing the use of Spherestay Kenya’s platform.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaGavel className="text-[#E83A17] text-sm" />
                </div>
                <span><strong>Platform Usage:</strong> Users must not misuse the platform (e.g., fraudulent bookings, unauthorized access).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaGavel className="text-[#E83A17] text-sm" />
                </div>
                <span><strong>Liability:</strong> Spherestay Kenya is not liable for disputes between hosts and guests or damages caused during stays, except as required by law.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaGavel className="text-[#E83A17] text-sm" />
                </div>
                <span><strong>Dispute Resolution:</strong> Disputes should be reported to our support team, with mediation offered where applicable.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaGavel className="text-[#E83A17] text-sm" />
                </div>
                <span><strong>Modifications:</strong> Spherestay Kenya may update these terms at any time, with notice provided via email or the platform.</span>
              </li>
            </ul>
            <div className="mt-8 flex justify-center">
              <motion.button
                onClick={() => window.location.href = 'mailto:Spherestaykenya@gmail.com'}
                className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Contact support for terms inquiries"
              >
                Contact Support
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Back to Home */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-md"
            aria-label="Back to home page"
          >
            <FaHome /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;