import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-lazy-load-image-component/src/effects/blur.css';


// Images
import hikingMountKenya from '@/assets/images/hikingMountkenya.jpg';
import beachVilla from '@/assets/images/dianiTestimonial.jpg';
import swimming from '@/assets/images/swimmingKanyaboli.jpg';
import tourExperience from '@/assets/images/tourguideHellsGate.jpg';

// Testimonials Data
const testimonials = [
  {
    id: 1,
    name: 'Juma Mwangi',
    location: 'Nairobi, Kenya',
    rating: 5,
    content:
      'My Maasai Mara safari was exceptional through this service. They helped plan everything from accommodation to transport.',
    image: hikingMountKenya,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    location: 'London, UK',
    rating: 4,
    content:
      'The beach villa we booked in Diani was even better than the photos. The local support team was available 24/7 for any questions.',
    image: beachVilla,
  },
  {
    id: 3,
    name: 'Amina Hassan',
    location: 'Mombasa, Kenya',
    rating: 5,
    content:
      'Kupanga safari yangu ya Lamu kupitia wavuti hii ilikuwa rahisi sana. Nilipata ofa nzuri na maelezo sahihi kabisa.',
    image: swimming,
  },
  {
    id: 4,
    name: 'David Müller',
    location: 'Berlin, Germany',
    rating: 5,
    content:
      'The cultural experiences organized by this platform were authentic and well-curated. We felt truly welcomed by the local communities.',
    image: tourExperience,
  },
];

const Testimonials = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -5, transition: { duration: 0.3 } },
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 py-20 px-4 font-poppins">
      {/* Background Decorative Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#E83A17]/10 rounded-full blur-3xl top-10 left-[-120px]" />
        <div className="absolute w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />
      </div>

      <div className="relative container mx-auto max-w-7xl z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-left">
  Traveler Stories 
</h2>
        
        </motion.div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          navigation={{
            nextEl: '.custom-swiper-button-next',
            prevEl: '.custom-swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="pb-14 relative group"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-xl flex flex-col transition-all duration-300"
              >
                {/* User Info */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E83A17]">
                    <LazyLoadImage
                      src={t.image}
                      alt={t.name}
                      effect="blur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <FaStar
                        className={`text-lg ${
                          i < t.rating ? 'text-[#FFC72C]' : 'text-gray-300'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <div className="relative flex-1">
                  <FaQuoteLeft className="absolute -top-4 left-0 text-5xl text-[#E83A17]/10" />
                  <p className="pl-10 text-gray-700 text-base leading-relaxed">{t.content}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation Arrows */}
          <motion.button
            className="custom-swiper-button-prev"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <ChevronLeft size={22} />
          </motion.button>
          <motion.button
            className="custom-swiper-button-next"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            viewport={{ once: true }}
          >
            <ChevronRight size={22} />
          </motion.button>
        </Swiper>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-10"
        >
          <a
            href="https://www.tripadvisor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-[#E83A17] text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#c53214] transition-all duration-300"
          >
            Read More on TripAdvisor
            <svg
              className="ml-3 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7M21 12H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Styles */}
      <style>
        {`
          .custom-swiper-button-prev,
          .custom-swiper-button-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(8px);
            border-radius: 50%;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            color: #E83A17;
            z-index: 10;
            cursor: pointer;
            opacity: 0; /* Hidden by default on desktop */
            pointer-events: none;
          }
          .group:hover .custom-swiper-button-prev,
          .group:hover .custom-swiper-button-next {
            opacity: 1;
            pointer-events: auto;
          }
          .custom-swiper-button-prev:hover,
          .custom-swiper-button-next:hover {
            transform: translateY(-50%) scale(1.1);
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          }
          .custom-swiper-button-prev {
            left: -20px;
          }
          .custom-swiper-button-next {
            right: -20px;
          }
          /* Keep visible on mobile */
          @media (max-width: 640px) {
            .custom-swiper-button-prev,
            .custom-swiper-button-next {
              opacity: 1 !important;
              pointer-events: auto !important;
              width: 40px;
              height: 40px;
            }
          }
          /* Pagination Dots */
          .swiper-pagination-bullet {
            background-color: #cbd5e1;
            opacity: 1;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background-color: #E83A17;
            transform: scale(1.3);
            box-shadow: 0 0 8px rgba(232, 58, 23, 0.5);
          }
        `}
      </style>
    </section>
  );
};

export default Testimonials;
