import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import heroimg1 from '../assets/heroimg1.png';

const Hero = () => {
  const navigate = useNavigate();
  
  // Scroll-based parallax for background
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 500], [0, 100]);
  const scaleBackground = useTransform(scrollY, [0, 500], [1, 1.05]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -40, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center text-white overflow-hidden font-sans antialiased bg-black">
      
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ 
          backgroundImage: `url(${heroimg1})`,
          y: yBackground,
          scale: scaleBackground 
        }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
      />

      {/* Dark Gradient Overlay - Heavier on the left for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>

      {/* Content Area - Shifted Left */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12"
      >
        <div className="max-w-xl flex flex-col items-start text-left">
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-1"
          >
            SmartChain
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl font-medium text-blue-400 mb-6"
          >
            Smarter Supply Chains with AI
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="text-sm md:text-base text-gray-300 leading-relaxed font-normal opacity-80 mb-10 max-w-md"
          >
            The bespoke control tower for enterprise logistics. 
            Orchestrate multimodal operations with predictive 
            intelligence and real-time visibility.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-row gap-4 w-full sm:w-auto"
          >
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-all shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)]"
            >
              Get Started
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/demo')}
              className="px-8 py-3 bg-white/5 backdrop-blur-md text-white text-sm font-semibold rounded-md border border-white/10 transition-all"
            >
              View Demo

            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle Seam at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-20"></div>
    </section>
  );
};

export default Hero;