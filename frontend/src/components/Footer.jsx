import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: ['Pricing', 'Security', 'Integrations'],
    company: ['About', 'Careers', 'Contact'],
  };

  const techBadges = ['VERTEX AI', 'BIGQUERY', 'GEMINI', 'MAPS API'];

  return (
    <footer className="w-full bg-white px-6 sm:px-8 py-10 sm:py-12 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-10 md:gap-12 mb-12 sm:mb-16">
          
          {/* Brand Info */}
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tighter mb-3 sm:mb-4">
              SmartChain
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              The world's most advanced supply chain intelligence platform.
            </p>
          </div>

          {/* Links Grid */}
          <div className="flex flex-row gap-12 sm:gap-20">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 sm:mb-5">
                Product
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 sm:mb-5">
                Company
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-6">
          
          {/* Tech Stack Badges */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:mr-2">
              Powered by Google Cloud
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {techBadges.map((tech) => (
                <span 
                  key={tech} 
                  className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[9px] font-bold text-gray-500 tracking-tight whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight text-center">
            © {currentYear} SmartChain Technologies Inc. <span className="hidden sm:inline">All Rights Reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;