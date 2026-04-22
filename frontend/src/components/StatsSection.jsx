import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = () => {
  const stats = [
    {
      label: '1M+',
      subtext: 'Shipments Delivered',
    },
    {
      label: '150+',
      subtext: 'Countries Reached',
    },
    {
      label: '98%',
      subtext: 'On-Time Delivery Rate',
    },
  ];

  return (
    <section className="w-full bg-white py-24 px-10 md:px-24 font-sans antialiased overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-16">
        
        {/* Left Side: Refined Heading */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          // Increased max-w to prevent accidental wrapping
          className="max-w-2xl lg:w-1/2"
        >
          <h2 className="text-3xl md:text-[2.5rem] font-semibold text-black leading-[1.2] tracking-tight whitespace-nowrap">
            Smart Logistics That Move <br className="hidden md:block" /> 
            <span className="block">Your Business</span>
          </h2>
        </motion.div>

        {/* Right Side: Stats Grid */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-12 md:gap-20 lg:gap-24">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.7, 
                ease: [0.215, 0.61, 0.355, 1] 
              }}
              className="flex flex-col items-start"
            >
              <span className="text-4xl md:text-5xl font-bold text-black tracking-tighter mb-3">
                {stat.label}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                {stat.subtext}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StatsSection;