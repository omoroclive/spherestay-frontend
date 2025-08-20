import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaUndoAlt, FaHome, FaUserCheck, FaCreditCard } from 'react-icons/fa';
import heroBackground from '@/assets/images/rusinga2.svg'; // Reusing from About.jsx
import policyImage from '@/assets/images/mountKenya.svg'; // Reusing ecoInitiative as placeholder

const Policy = () => {
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
            Our <span className="text-[#FFC72C]">Policies</span>
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto"
          >
            Learn about our tax, cancellation, host, guest, and payment policies to ensure a smooth experience with Spherestay Kenya.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 -mt-16 relative z-10">
        {/* Tax Policy */}
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
                  <FaMoneyBillWave className="text-[#E83A17] text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tax Policy</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                All bookings on Spherestay Kenya are subject to Kenyan tax regulations, ensuring transparency and compliance.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                    <FaMoneyBillWave className="text-[#E83A17] text-sm" />
                  </div>
                  <span><strong>16% Value Added Tax (VAT):</strong> Applied to the base price of all bookings as per Kenyan tax laws.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                    <FaMoneyBillWave className="text-[#E83A17] text-sm" />
                  </div>
                  <span><strong>2% Tourism Levy:</strong> A mandatory levy to support tourism development in Kenya, applied to all bookings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                    <FaMoneyBillWave className="text-[#E83A17] text-sm" />
                  </div>
                  <span>Taxes are clearly displayed in the booking summary before payment.</span>
                </li>
              </ul>
            </div>
            <div className="hidden md:block relative">
              <img
                src={policyImage}
                alt="Tax policy illustration"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* Cancellation Policy */}
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
                  <FaUndoAlt className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Cancellation Policy</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUndoAlt className="text-white text-sm" />
                  </div>
                  <span><strong>Flexible (Guest):</strong> Full refund if cancelled 7 days before check-in. 50% refund for cancellations 3–6 days before check-in. No refund within 48 hours.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUndoAlt className="text-white text-sm" />
                  </div>
                  <span><strong>Host Cancellations:</strong> Hosts must provide a full refund if cancelling, and may face penalties for frequent cancellations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUndoAlt className="text-white text-sm" />
                  </div>
                  <span>Extenuating circumstances (e.g., natural disasters) may allow full refunds, reviewed case-by-case.</span>
                </li>
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center mt-8 bg-white text-[#006644] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md"
              >
                Contact Support for Assistance
              </Link>
            </div>
            <div className="relative h-64 md:h-auto">
              <img
                src={policyImage}
                alt="Cancellation policy illustration"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* Host Responsibilities */}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Host Responsibilities</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Hosts on Spherestay Kenya are expected to maintain high standards to ensure a great guest experience.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-[#FFC72C]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaHome className="text-[#FFC72C] text-sm" />
                </div>
                <span><strong>Accuracy:</strong> Provide accurate property details, including amenities, availability, and pricing.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#FFC72C]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaHome className="text-[#FFC72C] text-sm" />
                </div>
                <span><strong>Cleanliness:</strong> Ensure properties are clean and well-maintained for every guest.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#FFC72C]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaHome className="text-[#FFC72C] text-sm" />
                </div>
                <span><strong>Communication:</strong> Respond promptly to guest inquiries and booking requests.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#FFC72C]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaHome className="text-[#FFC72C] text-sm" />
                </div>
                <span><strong>Compliance:</strong> Adhere to local laws and Spherestay verification processes.</span>
              </li>
            </ul>
            <Link
              to="/register-host"
              className="inline-flex items-center justify-center mt-8 bg-[#E83A17] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c53214] transition-all shadow-md"
            >
              Become a Host
            </Link>
          </div>
        </motion.section>

        {/* Guest Policies */}
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
                  <FaUserCheck className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Guest Policies</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUserCheck className="text-white text-sm" />
                  </div>
                  <span><strong>Respect:</strong> Treat properties with care and follow host rules (e.g., no smoking, no pets unless allowed).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUserCheck className="text-white text-sm" />
                  </div>
                  <span><strong>Accuracy:</strong> Provide accurate guest information during booking.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUserCheck className="text-white text-sm" />
                  </div>
                  <span><strong>Safety:</strong> Adhere to safety guidelines provided by the host and local authorities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                    <FaUserCheck className="text-white text-sm" />
                  </div>
                  <span><strong>Cancellations:</strong> Review the cancellation policy before booking to understand refund eligibility.</span>
                </li>
              </ul>
              <Link
                to="/properties"
                className="inline-flex items-center justify-center mt-8 bg-white text-[#E83A17] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md"
              >
                Explore Properties
              </Link>
            </div>
            <div className="relative h-64 md:h-auto">
              <img
                src={policyImage}
                alt="Guest policy illustration"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* Payment Terms */}
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
                <FaCreditCard className="text-[#E83A17] text-2xl" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Terms</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We ensure secure and transparent payment processes for all bookings on Spherestay Kenya.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaCreditCard className="text-[#E83A17] text-sm" />
                </div>
                <span><strong>Currency:</strong> All payments are processed in Kenyan Shillings (KES).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaCreditCard className="text-[#E83A17] text-sm" />
                </div>
                <span><strong>Methods:</strong> We accept major credit/debit cards, mobile payments (e.g., M-Pesa), and bank transfers.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaCreditCard className="text-[#E83A17] text-sm" />
                </div>
                <span><strong>Refunds:</strong> Refunds are processed within 7–14 business days, subject to the cancellation policy.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#E83A17]/10 p-1 rounded-full mt-1 flex-shrink-0">
                  <FaCreditCard className="text-[#E83A17] text-sm" />
                </div>
                <span><strong>Security:</strong> All transactions are encrypted and PCI-DSS compliant.</span>
              </li>
            </ul>
            <div className="mt-8 flex justify-center">
              <motion.button
                onClick={() => window.location.href = 'mailto:Spherestaykenya@gmail.com'}
                className="flex items-center gap-2 px-6 py-3 bg-[#E83A17] text-white rounded-lg hover:bg-[#c53214] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Contact support for payment queries"
              >
                Contact Support for Payment Queries
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

export default Policy;