import React from 'react';
import { motion } from 'framer-motion';

const caseStudies = [
  {
    title: "Suez Canal Bypass",
    metric: "$4.2M Loss Mitigation",
    category: "Geopolitical Risk",
    desc: "SmartChain identified early labor unrest signals in Port Said 10 days before the 2026 strike. Automated orchestration rerouted pharmaceutical cargo to Air-Bridge, maintaining 100% fulfillment while competitors faced a 14-day queue.",
    source: "Global Logistics Review",
    link: "/reports/suez-analysis"
  },
  {
    title: "Cold-Chain Thermal Pivot",
    metric: "22% Efficiency Increase",
    category: "Climate Adaptation",
    desc: "Leveraging causal inference during the 2026 heatwave, the system optimized cold-chain routes to minimize ambient exposure. This proactive adjustment prevented critical biological spoilage across the inland network.",
    source: "Sustainability Hub",
    link: "/reports/thermal-efficiency"
  },
  {
    title: "Multimodal Decarbonization",
    metric: "15% Carbon Reduction",
    category: "Operational Optimization",
    desc: "A UAE-based distributor utilized the Simulation Lab to transition 30% of long-haul terrestrial freight to rail. The transition met 2026 sustainability targets without increasing lead times or total landed cost.",
    source: "Logistics Middle East",
    link: "/reports/decarbonization"
  }
];

const CaseStudies = () => {
  return (
    <section className="w-full bg-[#fcfcfc] py-24 px-8 lg:px-24 font-sans antialiased border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="text-4xl md:text-5xl font-bold text-black tracking-tighter"
            >
              Intelligence in Action
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-500 text-sm max-w-xs leading-relaxed font-medium"
          >
            Documented impacts of predictive orchestration across global corridors and volatile landscapes.
          </motion.p>
        </div>

        {/* Corporate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-l border-gray-200">
          {caseStudies.map((study, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="group p-10 border-r border-b border-gray-200 bg-white hover:bg-gray-50 transition-all duration-500 flex flex-col min-h-[450px]"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-10">
                  <span className="font-bold text-[10px] text-gray-400 uppercase tracking-[0.2em]">{study.category}</span>
                  {/* Replaced blue dot with a sleek black indicator */}
                  <div className="w-1.5 h-1.5 rounded-full bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-black mb-3 leading-tight tracking-tight">
                  {study.title}
                </h3>
                {/* Metric now in Bold Black */}
                <p className="text-black font-extrabold text-xl mb-8 tracking-tighter">
                  {study.metric}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {study.desc}
                </p>
              </div>

              {/* Technical Footer */}
              <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Source: {study.source}</span>
                <motion.a 
                  href={study.link}
                  whileHover={{ x: 5 }}
                  className="text-black text-xs font-black flex items-center gap-2 group/link tracking-widest"
                >
                  FULL REPORT
                  <span className="text-lg leading-none transition-transform group-hover/link:translate-x-1">→</span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;