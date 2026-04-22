import React from 'react';
import { motion } from 'framer-motion';

// --- ICONS (Refined to pure monochrome) ---
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
  { icon: <IconVisibility />, title: '01. Visibility Blackout', desc: 'Fragmented data creates blind spots between hubs, stalling real-time decisions.' },
  { icon: <IconCascade />, title: '02. Cascade Effect', desc: 'Single port delays ripple into warehouse stock-outs thousands of miles away.' },
  { icon: <IconFirefighting />, title: '03. Reactive Strategy', desc: 'Teams spend 80% of time manually fixing disruptions that already occurred.' },
  { icon: <IconRigidity />, title: '04. Structural Rigidity', desc: 'Brittle corridors lack the agility required to pivot during global crises.' },
];

const ProfessionalCrisis = () => {
  return (
    <section className="w-full bg-white py-24 px-6 lg:px-24 font-sans antialiased">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl font-bold text-black tracking-tight"
          >
            The Legacy Logistics Crisis
          </motion.h2>
        </div>

        {/* Minimal Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {crisisData.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group p-8 bg-white border border-gray-100 rounded-3xl hover:border-black transition-all duration-500 ease-out flex flex-col justify-between min-h-[280px]"
            >
              <div>
                <div className="text-black mb-10 transition-transform duration-500 group-hover:scale-110">
                  {item.icon}
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-black tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Minimal Line Detail */}
              <div className="mt-8 pt-6 border-t border-gray-50">
                <div className="h-[1px] w-0 bg-black group-hover:w-full transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalCrisis;