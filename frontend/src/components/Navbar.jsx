import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboardpage' },
    { label: 'Shipments', path: '/maps' },
    { label: 'Simulation', path: '/demo' },
  ];

  const getActiveTab = () => {
    const match = navLinks.find(link => location.pathname === link.path);
    return match ? match.label : 'Home';
  };

  const activeTab = getActiveTab();

  const handleNav = (path, label) => {
    navigate(path);
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 font-sans">
      <div className="w-full px-10 sm:px-14 py-10 flex items-center justify-between">
        
        {/* Left Section: Minimalist Text Logo */}
        <div className="flex items-center">
          <h1 
            className="text-2xl md:text-3xl font-bold text-white tracking-tighter drop-shadow-md cursor-pointer"
            onClick={() => navigate('/')}
          >
            SmartChain
          </h1>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.path, link.label)}
              className={`text-xs uppercase tracking-[0.2em] font-bold transition-all pb-1 border-b-2 ${
                activeTab === link.label 
                ? 'text-white border-white' 
                : 'text-white/50 hover:text-white border-transparent'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Section: Login CTA */}
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/login')}
            className="hidden md:block px-10 py-3 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-black rounded-full transition-all hover:bg-gray-100 shadow-lg"
          >
            Login
          </button>
          
          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-1 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl px-8 py-6 flex flex-col space-y-6">
          {navLinks.map((link) => (
            <button 
              key={link.label} 
              onClick={() => { handleNav(link.path, link.label); setIsMenuOpen(false); }}
              className="text-left text-xs uppercase tracking-widest font-bold text-white/70 hover:text-white"
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => navigate('/login')}
            className="text-left text-xs uppercase tracking-widest font-bold text-white"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
