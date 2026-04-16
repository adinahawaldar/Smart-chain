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
    <section className="w-full bg-[#fcfcfc] py-24 px-8 lg:px-16 font-sans antialiased border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="" />
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Intelligence in Action</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            Documented impacts of predictive orchestration across global corridors and volatile landscapes.
          </p>
        </div>

        {/* Corporate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-l border-slate-200">
          {caseStudies.map((study, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: idx * 0.15 }}
              className="group p-10 border-r border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors duration-500 flex flex-col min-h-[420px]"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{study.category}</span>
                  <div className="w-2 h-2 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
                  {study.title}
                </h3>
                <p className="text-blue-600 font-bold text-lg mb-6">
                  {study.metric}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed font-normal">
                  {study.desc}
                </p>
              </div>

              {/* Technical Footer */}
              <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Source: {study.source}</span>
                <motion.a 
                  href={study.link}
                  whileHover={{ x: 3 }}
                  className="text-blue-600 text-xs font-bold flex items-center gap-2 group/link"
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