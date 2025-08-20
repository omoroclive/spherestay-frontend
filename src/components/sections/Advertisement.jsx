import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaShieldAlt, FaUsers, FaDollarSign, FaClock } from 'react-icons/fa';

const AdvertisementSwiper = () => {
  const slides = [
    {
      title: 'Exclusive Discounts for New Listings',
      subtitle: 'Get 50% off your first month\'s listing fees and reach thousands of travelers instantly!',
      background: 'bg-gradient-to-br from-[#E83A17] to-[#FFC72C]',
      icon: FaDollarSign,
      cta: 'Start Listing Today',
      link: '/register-host',
    },
    {
      title: 'Grace Period for First 10 Hosts',
      subtitle: 'Be among the first 10 property owners to join and enjoy free premium listing for 3 months with zero fees!',
      background: 'bg-gradient-to-br from-[#006644] to-[#E83A17]',
      icon: FaClock,
      cta: 'Claim Your Spot Now',
      link: '/register-host',
    },
    {
      title: 'High-Level Service & Global Outreach',
      subtitle: 'Benefit from our premium marketing, SEO optimization, and partnerships to attract high-end domestic and international guests.',
      background: 'bg-gradient-to-br from-[#003D2B] to-[#FFC72C]',
      icon: FaUsers,
      cta: 'Elevate Your Business',
      link: '/register-host',
    },
    {
      title: 'Unmatched Advanced Filters',
      subtitle: 'Our sophisticated search filters ensure your property matches perfectly with the right travelers, boosting bookings and reviews.',
      background: 'bg-gradient-to-br from-[#E83A17] to-[#006644]',
      icon: FaStar,
      cta: 'Experience the Difference',
      link: '/properties',
    },
    {
      title: 'Smart Nearby Recommendations',
      subtitle: 'Leverage AI-powered nearby property suggestions to increase visibility and cross-promote your listings to exploring guests.',
      background: 'bg-gradient-to-br from-[#FFC72C] to-[#003D2B]',
      icon: FaMapMarkerAlt,
      cta: 'Discover More Features',
      link: '/about',
    },
    {
      title: 'Secure & Seamless Platform',
      subtitle: 'Enjoy 24/7 support, encrypted payments, verified users, and sustainable tourism tools—all designed for your success.',
      background: 'bg-gradient-to-br from-[#006644] to-[#E83A17]',
      icon: FaShieldAlt,
      cta: 'Join Spherestay Kenya',
      link: '/register-host',
    },
  ];

  return (
    <section className="py-12 bg-gray-900 overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        loop={true}
        className="h-[50vh] min-h-[400px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <motion.div
              className={`${slide.background} h-full flex items-center justify-center text-center px-6 relative`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                  className="mb-6 flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <slide.icon className="text-white text-6xl opacity-80" />
                </motion.div>
                <motion.h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-serif tracking-tight"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Link
                    to={slide.link}
                    className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all shadow-lg border border-white/30"
                  >
                    {slide.cta}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AdvertisementSwiper;