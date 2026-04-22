import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How does SmartChain predict disruptions 10 days in advance?",
    answer: "Our neural network ingests real-time telemetry from maritime AIS and air manifests, cross-referencing them against a decade of historical transit patterns to identify 'Black Swan' signals before they manifest as physical delays."
  },
  {
    question: "What makes the 'Autonomous Rerouting' feature secure?",
    answer: "Every rerouting decision is verified through our LLM reasoning engine and dispatched via encrypted protocols. It generates updated manifests and stakeholder emails automatically, ensuring zero-latency transitions without manual risk."
  },
  {
    question: "Can SmartChain integrate with existing ERP systems?",
    answer: "Yes. SmartChain is designed as a bespoke control tower that sits atop your current infrastructure, pulling data via secure API layers to provide a unified intelligence surface without requiring a complete system overhaul."
  },
  {
    question: "How does the system handle sustainability targets?",
    answer: "The platform includes a Simulation Lab that calculates the carbon footprint of every route. It suggests multimodal pivots—like transitioning terrestrial freight to rail—to meet decarbonization goals without increasing landed costs."
  },
  {
    question: "What is the role of the LLM Reasoning Engine in logistics?",
    answer: "The engine processes unstructured multimodal data—such as news reports or port documents—to reason through complex logic, providing human-like strategic rerouting instructions that traditional algorithms might miss."
  },
  {
    question: "How does the automated email notification system work?",
    answer: "Once a rerouting decision is made, the system instantly generates and sends high-priority updates to all relevant stakeholders, including carriers, warehouse managers, and end customers, ensuring total supply chain synchronization."
  }
];

const FAQItem = ({ faq, index, isOpen, toggleOpen }) => {
  return (
    <div className={`border-b border-gray-100 transition-all duration-500 ${isOpen ? 'bg-gray-50/30' : 'bg-transparent'}`}>
      <button
        onClick={() => toggleOpen(index)}
        className="w-full py-6 flex items-center justify-between text-left px-2"
      >
        <span className="text-base font-semibold text-black tracking-tight pr-8">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="black" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 px-2 max-w-2xl">
              <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="w-full bg-white py-24 px-8 lg:px-24 font-sans antialiased border-t border-gray-50">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-16">
        
        <div className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="lg:sticky lg:top-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tighter mb-4">
              Intelligence <br /> Resource Center
            </h2>
            
          </motion.div>
        </div>

        <div className="lg:w-2/3 border-t border-black/5">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              index={index}
              faq={faq}
              isOpen={openIndex === index}
              toggleOpen={toggleOpen}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;