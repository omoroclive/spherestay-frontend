import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import {
  FaGlobeAfrica,
  FaLeaf,
  FaMapMarkedAlt,
  FaBuilding,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTiktok
} from 'react-icons/fa';

// Import optimized images (should be WebP format for performance)
import heroBackground from '@/assets/images/rusinga2.svg';
import ecoInitiative from '@/assets/images/mountKenya.svg';
import curatedDestinations from '@/assets/images/publicProperties.jpg';
import hostProperty from '@/assets/images/lodge.svg';
import teamPhoto from '@/assets/images/photographerMaasaiMara.jpg';

const About = () => {
  const socialLinks = [
    { icon: FaFacebookF, href: 'https://facebook.com/spherestaykenya', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com/spherestaykenya', label: 'Instagram' },
    { icon: FaTwitter, href: 'https://twitter.com/spherestaykenya', label: 'X (Twitter)' },
    { icon: FaTiktok, href: 'https://tiktok.com/@spherestaykenya', label: 'TikTok' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax Effect */}
      <motion.section 
        className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image with Parallax Effect */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroBackground})` }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </motion.div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight"
          >
            Discover <span className="text-[#FFC72C]">Kenya</span> with Us
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8"
          >
            Your gateway to authentic Kenyan experiences, connecting travelers with unique destinations while promoting sustainable tourism.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 -mt-16 relative z-10">
        {/* Mission Section */}
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
                  <FaGlobeAfrica className="text-[#E83A17] text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Spherestay Kenya is a premier platform dedicated to showcasing the best of Kenya's tourism offerings. We bridge the gap between local property owners and both domestic and international tourists.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">For Travelers</h3>
                  <p className="text-sm text-gray-600">
                    Discover authentic Kenyan experiences from luxury hotels to cultural immersions.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">For Hosts</h3>
                  <p className="text-sm text-gray-600">
                    Reach global audiences and grow your business with our platform.
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative">
              <img 
                src={teamPhoto} 
                alt="Spherestay Kenya team" 
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* Eco Initiatives */}
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
                  <FaLeaf className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Sustainability Commitment</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Partnering with eco-conscious properties",
                  "Promoting low-impact tourism experiences",
                  "Tree planting initiative for every booking",
                  "Supporting community conservation projects"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                      <FaLeaf className="text-white text-sm" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex gap-3">
                <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm text-center">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm">Trees Planted</div>
                </div>
                <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm text-center">
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm">Eco Partners</div>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img 
                src={ecoInitiative} 
                alt="Eco initiatives in Kenya" 
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* Curated Destinations */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16"
        >
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#FFC72C]/10 p-3 rounded-full">
                <FaMapMarkedAlt className="text-[#FFC72C] text-2xl" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Kenya's Finest Curations</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img 
                  src={curatedDestinations} 
                  alt="Curated destinations in Kenya" 
                  className="w-full h-auto rounded-xl shadow-md mb-6"
                  loading="lazy"
                />
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our team of local experts handpicks destinations to ensure every traveler finds their perfect Kenyan adventure.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Wildlife Safaris", color: "bg-[#E83A17]/10", text: "text-[#E83A17]" },
                  { title: "Beach Resorts", color: "bg-[#FFC72C]/10", text: "text-[#FFC72C]" },
                  { title: "Cultural Tours", color: "bg-[#006644]/10", text: "text-[#006644]" },
                  { title: "Adventure Sports", color: "bg-[#003D2B]/10", text: "text-[#003D2B]" }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`${item.color} ${item.text} p-4 rounded-xl flex items-center justify-center text-center font-medium h-full`}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Host Section */}
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
                  <FaBuilding className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Become a Host</h2>
              </div>
              <p className="mb-6 leading-relaxed">
                Join thousands of Kenyan property owners reaching global travelers through our platform.
              </p>
              <ol className="space-y-3 mb-8">
                {[
                  "Register as a host in minutes",
                  "List your property or experience",
                  "Get verified within 48 hours",
                  "Start receiving bookings and payments"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-white/20 p-1 rounded-full mt-1 flex-shrink-0 backdrop-blur-sm">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
              <Link
                to="/register-host"
                className="inline-flex items-center justify-center bg-white text-[#E83A17] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md"
              >
                Start Hosting Today
              </Link>
            </div>
            <div className="relative h-64 md:h-auto">
              <img 
                src={hostProperty} 
                alt="Host your property with Spherestay" 
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Connect With Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions or want to partner with us? Reach out through any of these channels.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { 
                  icon: <FaPhoneAlt className="text-2xl" />,
                  title: "Call Us",
                  detail: "+254 791 150 726",
                  action: "tel:+254791150726"
                },
                { 
                  icon: <FaEnvelope className="text-2xl" />,
                  title: "Email Us",
                  detail: "Spherestaykenya@gmail.com",
                  action: "mailto:Spherestaykenya@gmail.com"
                },
                { 
                  icon: <FaMapMarkerAlt className="text-2xl" />,
                  title: "Visit Us",
                  detail: "Nairobi, Kenya",
                  action: "https://maps.google.com"
                }
              ].map((item, index) => (
                <a 
                  key={index} 
                  href={item.action}
                  className="bg-gray-50 hover:bg-gray-100 p-6 rounded-xl text-center transition-all"
                >
                  <div className="bg-[#E83A17]/10 p-3 rounded-full inline-flex mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.detail}</p>
                </a>
              ))}
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-6">Follow Our Journey</h3>
              <div className="flex justify-center gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full text-gray-700 transition-all"
                    aria-label={link.label}
                  >
                    <link.icon className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;