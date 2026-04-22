import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import hero from '../assets/hero.jpg';

const Hero = () => {
  const navigate = useNavigate();
  
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 500], [0, 80]);
  const scaleBackground = useTransform(scrollY, [0, 500], [1, 1.03]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-white p-4 sm:p-5 font-sans antialiased overflow-hidden">
      
      <div className="relative w-full h-[95vh] flex items-center rounded-[2rem] overflow-hidden shadow-sm">
        
        {/* Background Image */}
        <motion.div 
          style={{ 
            backgroundImage: `url(${hero})`,
            y: yBackground,
            scale: scaleBackground 
          }}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        />

        {/* Enhanced Overlay: Combined a base dark tint with a stronger left-side gradient */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-11"></div>

        {/* Content Area */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 w-full max-w-[1440px] mx-auto px-10 md:px-20"
        >
          <div className="max-w-xl flex flex-col items-start text-left">
            
            <motion.h1 
              variants={itemVariants}
              // Added drop-shadow for extra "pop" against busy backgrounds
              className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-2 drop-shadow-md"
            >
              SmartChain
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              // Increased weight slightly and added shadow for readability
              className="text-lg md:text-xl font-medium text-white/95 mb-8 max-w-sm leading-relaxed drop-shadow-sm"
            >
              The bespoke control tower for enterprise logistics and predictive intelligence.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-row gap-4"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="px-9 py-3.5 bg-white text-black text-xs uppercase tracking-widest font-bold rounded-full transition-all shadow-xl"
              >
                Get Started
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/demo')}
                className="px-9 py-3.5 bg-transparent backdrop-blur-md text-white text-xs uppercase tracking-widest font-bold rounded-full border border-white/40 transition-all"
              >
                View Demo
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;