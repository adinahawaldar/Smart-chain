import React from 'react';
import { motion } from 'framer-motion';

// --- ICONS (Refined to 20px for a smaller footprint) ---
const IconVisibility = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconCascade = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconFirefighting = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const IconRigidity = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const crisisData = [
  { icon: <IconVisibility />, title: 'Visibility Blackout', desc: 'Fragmented data creates blind spots between hubs, stalling real-time decisions.' },
  { icon: <IconCascade />, title: 'Cascade Effect', desc: 'Single port delays ripple into warehouse stock-outs thousands of miles away.' },
  { icon: <IconFirefighting />, title: 'Reactive Strategy', desc: 'Teams spend 80% of time manually fixing disruptions that already occurred.' },
  { icon: <IconRigidity />, title: 'Structural Rigidity', desc: 'Brittle corridors lack the agility required to pivot during global crises.' },
];

const ProfessionalCrisis = () => {
  return (
    <section className="w-full bg-white py-20 px-6 lg:px-12 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12 border-l-2  pl-6">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold mb-1"
          >
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-slate-900 tracking-tight"
          >
            The Legacy Logistics Crisis
          </motion.h2>
        </div>

        {/* Minimal Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {crisisData.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group p-6 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300 ease-out"
            >
              {/* Icon - Minimal Square */}
              <div className="w-10 h-10 rounded-md bg-white border border-slate-200 text-slate-400 flex items-center justify-center group-hover:border-blue-500 group-hover:text-blue-600 transition-colors duration-300 shadow-sm">
                {item.icon}
              </div>

              <div className="mt-5 space-y-2">
                <h4 className="text-base font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Minimal Interactive Accent */}
              <div className="mt-4 flex items-center gap-2">
                <div className="h-[2px] w-4 bg-slate-200 group-hover:w-8 group-hover:bg-blue-600 transition-all duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalCrisis;