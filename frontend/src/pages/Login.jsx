import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic preserved as requested
    if (username === 'Admin' && password === '123') {
      navigate('/dashboardpage');
    } else if (username === 'Manager' && password === '456') {
      navigate('/dashboardpage');
    } else if (username === 'User' && password === '789') {
      navigate('/dashboardpage');
    } else {
      setError('Identity verification failed.');
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans antialiased overflow-hidden">
      
      {/* --- Left Section: Institutional Panel --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative hidden lg:flex w-[45%] flex-col justify-between p-20 overflow-hidden bg-black"
      >
        {/* Engineering Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">SmartChain </span>
          </motion.div>
        </div>

        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl font-bold text-white leading-[1.1] tracking-tighter"
          >
            Autonomous <br /> 
            Intelligence for <br />
            <span className="text-gray-500">Global Logistics.</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "60px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-[1px] bg-white my-8"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-sm max-w-xs leading-relaxed font-medium"
          >
            Access the  system for predictive orchestration and real-time corridor resilience.
          </motion.p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex flex-col gap-1">
          </div>
        </div>
      </motion.div>

      {/* --- Right Section: The Auth Interface --- */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center bg-white p-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className="mb-12">
            <h3 className="text-black text-3xl font-bold tracking-tighter">Terminal Access</h3>
            <p className="text-gray-400 text-sm mt-2 font-medium">Please enter your authorized credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-[11px] font-bold text-black bg-gray-50 p-4 border border-gray-100 text-center uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Identity</label>
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white border border-gray-100 px-5 py-4 rounded-none text-sm text-black outline-none focus:border-black transition-all placeholder:text-gray-200"
                placeholder="USER / MANAGER / ADMIN"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Secure Access Code</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-100 px-5 py-4 rounded-none text-sm text-black outline-none focus:border-black transition-all placeholder:text-gray-200"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit" 
                className="w-full py-5 bg-black text-white font-bold text-[11px] tracking-[0.3em] uppercase transition-all hover:bg-gray-900"
              >
                Initialize Session
              </motion.button>
            </div>
          </form>

          <div className="mt-20 flex justify-between items-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em]">
            <p>© 2026 SmartChain</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-black transition-colors">Legal</a>
              <a href="#" className="hover:text-black transition-colors">Protocol</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

