import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheck } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    // Basic validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setStatus('error');
      return;
    }

    try {
      // Replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Example: await api.subscribeToNewsletter(email);
      setStatus('success');
      setEmail('');
    } catch (err) {
      setError('Subscription failed. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <section className="bg-[#006644] text-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Pata Habari za Safari
            </h2>
            <p className="max-w-lg mx-auto">
              Jiandikishe kupokea taarifa za michezo, ofa maalum, na ujuzi wa kusafiri kutoka kwa wataalamu wetu.
            </p>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center justify-center gap-3"
            >
              <FaCheck className="text-green-600" />
              <span>Asante! Umeandikishwa kwa mafanikio.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Barua pepe yako"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]"
                  required
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#FFC72C] hover:bg-[#E83A17] text-gray-900 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    'Inatumwa...'
                  ) : (
                    <>
                      <FaPaperPlane />
                      Jiandikishe
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-200 text-center">
                  {error}
                </p>
              )}
              <p className="mt-4 text-sm text-white/80 text-center">
                Tutahifadhi maelezo yako kwa usalama. Sio spam!
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;