import React, { useState } from 'react';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = ['Dashboard', 'Map', 'Shipments', 'Simulation'];

  return (
    // "absolute" makes it sit on top of the Hero. "z-50" keeps it above the overlay.
    <nav className="absolute top-0 left-0 w-full z-50 font-sans border-b border-white/5">
      <div className="max-w-full px-4 sm:px-8 py-6 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center space-x-10">
          <h1 className="text-xl font-bold text-white tracking-tight">SmartChain</h1>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setActiveTab(link)}
                className={`text-sm font-medium transition-all pb-1 border-b-2 ${
                  activeTab === link ? 'text-blue-400 border-blue-400' : 'text-gray-300 hover:text-white border-transparent'
                }`}
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-5">
          <button className="p-1 text-gray-300 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-teal-500 overflow-hidden border border-white/20">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Adina" alt="Profile" className="w-full h-full object-cover" />
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-1 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Darkened background since it's floating */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl px-6 py-4 flex flex-col space-y-2">
          {navLinks.map((link) => (
            <button key={link} className="text-left py-2 text-gray-300">{link}</button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;