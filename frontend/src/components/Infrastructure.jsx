import React from 'react';
import { motion } from 'framer-motion';

const infrastructureStages = [
  {
    id: "01",
    title: "Global Signal Ingestion",
    subtitle: "Real-time Telemetry",
    desc: "Seamlessly ingests data from maritime AIS, air freight manifests, and terrestrial GPS. Monitors for 'Black Swan' events like port closures.",
  },
  {
    id: "02",
    title: "Predictive Risk Quantization",
    subtitle: "Historical Cross-Reference",
    desc: "Calculates a Cascade Risk Score by referencing live signals against historical transit data. Identifies shutdowns 10 days in advance.",
  },
  {
    id: "03",
    title: "Autonomous Decision Orchestration",
    subtitle: "LLM Reasoning Engine",
    desc: "Automatically reasons through multimodal alternatives and generates updated manifests and driver instructions.",
  }
];

const Infrastructure = () => {
  return (
    <section className="w-full bg-white py-24 px-8 lg:px-16 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-20 text-center lg:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4"
          >
            The Intelligence Infrastructure
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-500 text-lg"
          >
            A high-fidelity data fabric engineered for global resilience.
          </motion.p>
        </div>

        {/* Desktop Sequence (Horizontal Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {infrastructureStages.map((stage, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} // Triggers every time it scrolls into view
              transition={{ 
                duration: 0.7, 
                delay: idx * 0.2, // Staggered entrance
                ease: [0.215, 0.610, 0.355, 1.000] 
              }}
              className="relative flex flex-col"
            >
              {/* Step Indicator - Minimalist Circle */}
              <div className="mb-8">
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-blue-600 font-bold text-sm bg-slate-50/50">
                  {stage.id}
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold">
                    {stage.subtitle}
                  </p>
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                    {stage.title}
                  </h4>
                </div>
                
                <p className="text-sm text-slate-500 leading-relaxed font-normal">
                  {stage.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Infrastructure;