import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import RusungaBanner from '@/assets/images/rusinga.svg';
import MountKenya from '@/assets/images/mountKenya.svg';
import { FaChevronDown } from 'react-icons/fa';
import { MpesaIcon } from '@/assets/icons';
import SearchBox from '../hero/SearchBox';
import { useNavigate } from 'react-router-dom';

// Swahili phrases
const SWAHILI_PHRASES = [
  { text: "Karibu Kenya!", translation: "Welcome to Kenya!" },
  { text: "Pata mazingira mazuri", translation: "Find beautiful environments" },
  { text: "Lipa kwa M-Pesa", translation: "Pay with M-Pesa" },
  { text: "Safari njema!", translation: "Have a good trip!" }
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % SWAHILI_PHRASES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle search submission (passed to SearchBox)
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('HeroSection handleSearch triggered with query:', searchQuery); // Debug
    if (searchQuery) {
      navigate(`/search?type=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] max-w-[100vw] overflow-x-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          effect="fade"
          speed={1000}
          pagination={{ clickable: true, el: '.swiper-pagination' }}
          className="h-full w-full"
        >
          <SwiperSlide>
            <div className="relative h-full w-full">
              <img 
                src={RusungaBanner} 
                alt="Rusinga Island" 
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#006644]/80 to-transparent" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative h-full w-full">
              <img 
                src={MountKenya} 
                alt="Mount Kenya" 
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#006644]/80 to-transparent" />
            </div>
          </SwiperSlide>
          <div className="swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2" />
        </Swiper>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-8 sm:pb-12 px-2 sm:px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-6xl mx-auto text-center"
        >
          {/* Swahili Phrase Rotator */}
          <div className="mb-4 sm:mb-6">
            <motion.div
              key={SWAHILI_PHRASES[currentPhraseIndex].text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white bg-[#E83A17]/90 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm">
                {SWAHILI_PHRASES[currentPhraseIndex].text}
                <span className="block text-xs sm:text-sm font-normal text-[#FFC72C]">
                  {SWAHILI_PHRASES[currentPhraseIndex].translation}
                </span>
              </span>
            </motion.div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 font-display">
            Discover the <span className="text-[#FFC72C]">Magic</span> of Kenya
          </h1>
          
          <p className="text-base sm:text-lg text-white mb-4 sm:mb-6 max-w-md sm:max-w-xl mx-auto">
            Book authentic experiences, stay in breathtaking locations, and pay seamlessly with M-Pesa.
          </p>

          {/* SearchBox Integration */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-lg max-w-6xl mx-auto">
            <SearchBox setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
          </div>

          {/* M-Pesa Badge */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="mt-4 sm:mt-6 inline-flex items-center gap-2 bg-[#00A651] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg"
          >
            <MpesaIcon className="w-5 sm:w-6 h-5 sm:h-6" />
            <span className="text-sm sm:text-base font-medium">Lipa kwa M-Pesa</span>
            <span className="text-xs sm:text-sm opacity-80">(Pay with M-Pesa)</span>
          </motion.div>
        </motion.div>

        {/* Scrolling Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <FaChevronDown className="text-white text-lg sm:text-xl" />
        </motion.div>
      </div>

      {/* Maasai Pattern Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-3 sm:h-4 bg-repeat-x" style={{
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M0 0h20v20H0z" fill="%23E83A17"/><path d="M0 0h5v5H0zM10 10h5v5h-5zM5 5h5v5H5zM15 15h5v5h-5z" fill="%23FFC72C"/></svg>')`,
        opacity: 0.6
      }} />
    </section>
  );
};

export default HeroSection;