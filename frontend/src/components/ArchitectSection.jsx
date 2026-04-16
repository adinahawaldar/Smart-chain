import React from 'react';
import { motion } from 'framer-motion';

const ArchitectSection = () => {
  // Animation variants for re-triggering on every scroll
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="w-full bg-white py-24 px-8 lg:px-16 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl font-bold text-slate-900 tracking-tight"
          >
            Architected for Precision
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-4 text-lg"
          >
            Leveraging generative AI and causal inference to de-risk your logistics.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]"
        >
          
          {/* 1. Large Feature Card: Cascade Risk */}
          <motion.div 
            variants={cardVariants}
            className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-2xl bg-slate-100 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent z-10" />
            {/* Image Placeholder - Replace src with your asset */}
            <img 
              src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800" 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:scale-105 transition-transform duration-700" 
              alt="Risk Prediction" 
            />
            <div className="relative z-20 p-10 h-full flex flex-col justify-end">
              <span className="bg-blue-600 text-[10px] font-bold text-white px-2 py-1 rounded w-fit mb-4 uppercase tracking-widest">AI-Predicted</span>
              <h3 className="text-2xl font-bold text-white mb-2">Cascade Risk Prediction</h3>
              <p className="text-white/80 text-sm max-w-sm">Anticipate port delays before they happen. Our model predicts secondary impacts across your inland network.</p>
            </div>
          </motion.div>

          {/* 2. Minimalist Feature Card: Multimodal */}
          <motion.div 
            variants={cardVariants}
            className="bg-white border border-slate-100 rounded-2xl p-8 flex flex-col justify-between hover:border-blue-200 transition-colors shadow-sm"
          >
            <div className="text-blue-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Multimodal Optimization</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Dynamically switch between sea, air, and rail based on carbon footprint and cost.</p>
            </div>
          </motion.div>

          {/* 3. Small Feature Card: AI Copilot */}
          <motion.div 
            variants={cardVariants}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-8 flex flex-col justify-between hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 transition-all"
          >
            <div className="text-slate-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">AI Copilot</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Natural language interface for complex logistics queries. "Find the fastest route for Shipment A-42."</p>
            </div>
          </motion.div>

          {/* 4. Large Dark Feature Card: Simulation Lab */}
          <motion.div 
            variants={cardVariants}
            className="md:col-span-2 md:row-span-1 bg-[#1a2b3b] rounded-2xl p-10 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Abstract Background Detail */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-500" />
            
            <div className="relative z-10 space-y-4">
              <h3 className="text-3xl font-bold text-white tracking-tight">Simulation Lab</h3>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                Run "What-If" scenarios to stress-test your supply chain against geopolitical shifts or natural disasters.
              </p>
            </div>
            
            <motion.button 
              whileHover={{ x: 5 }}
              className="relative z-10 flex items-center gap-2 text-white text-sm font-bold tracking-widest uppercase group/btn"
            >
              Enter the Lab 
              <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
            </motion.button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default ArchitectSection;