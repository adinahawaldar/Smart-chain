import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: ['Pricing', 'Security', 'Integrations'],
    company: ['About', 'Careers', 'Contact'],
  };

  const techBadges = ['VERTEX AI', 'BIGQUERY', 'GEMINI', 'MAPS API'];

  return (
    <footer className="w-full bg-white px-8 lg:px-24 py-16 border-t border-gray-100 font-sans antialiased">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold text-black tracking-tighter mb-4">
              SmartChain
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              The world's most advanced supply chain intelligence platform. Engineered for resilience.
            </p>
          </div>

          {/* Links Grid */}
          <div className="flex flex-row gap-16 sm:gap-24">
            <div>
              <h3 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-6">
                Product
              </h3>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-sm text-gray-500 hover:text-black transition-colors duration-300 font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-6">
                Company
              </h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-sm text-gray-500 hover:text-black transition-colors duration-300 font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-100 mb-10" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-6">
          
          {/* Tech Stack Badges */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest sm:mr-2">
              Infrastructure
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {techBadges.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-bold text-gray-400 tracking-tighter transition-all hover:border-black hover:text-black cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center">
            © {currentYear} SmartChain Technologies <span className="hidden sm:inline">/ Global Corridors</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;