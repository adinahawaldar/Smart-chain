import React from 'react';
import { motion } from 'framer-motion';

const solutionFeatures = [
  {
    id: "01",
    title: "Predictive Anomaly Detection",
    subtitle: "Anti-Crisis Intelligence",
    desc: "Our neural network monitors global shipping lanes to identify shutdowns and port congestion 10 days before they occur, triggering instant pre-emptive alerts.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800", 
    size: "lg:col-span-2"
  },
  {
    id: "02",
    title: "LLM Reasoning Engine",
    subtitle: "Autonomous Logic",
    desc: "Uses advanced reasoning to process multimodal logistics data and generate strategic rerouting instructions automatically.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", // New AI/Neural visual
    size: "lg:col-span-1"
  },
  {
    id: "03",
    title: "Autonomous Rerouting",
    subtitle: "Zero-Latency Pivot",
    desc: "Instantly recalculates routes and dispatches updated instructions via secure automated email protocols.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800", 
    size: "lg:col-span-1"
  },
  {
    id: "04",
    title: "Automated Stakeholder Sync",
    subtitle: "Real-time Communication",
    desc: "Generates and sends detailed disruption reports and updated timelines to your network without manual intervention.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800", 
    size: "lg:col-span-2"
  }
];

const SmartSolution = () => {
  return (
    <section className="w-full bg-white py-24 px-8 lg:px-24 font-sans antialiased">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-black tracking-tighter mb-6"
          >
            The Autonomous <br /> Solution Layer
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-500 text-lg font-medium leading-relaxed"
          >
            Moving from reactive firefighting to predictive orchestration. SmartChain 
            solves problems before they impact your bottom line.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {solutionFeatures.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              // Reduced height to h-[380px] for a more compact look
              className={`group relative overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 h-[380px] flex flex-col justify-end p-8 hover:border-black transition-all duration-500 ${feature.size}`}
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${feature.image})` }}
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Content Layer */}
              <div className="relative z-20 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">
                  {feature.subtitle}
                </p>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed font-medium max-w-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {feature.desc}
                </p>
              </div>

              {/* Number Badge */}
              <div className="absolute top-6 right-6 z-20 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white text-[10px] font-bold backdrop-blur-md">
                {feature.id}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartSolution;