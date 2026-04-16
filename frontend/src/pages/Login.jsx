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
    // Logic for Admin/123, Manager/456, User/789
    if (username === 'Admin' && password === '123') {
      navigate('/dashboard');
    } else if (username === 'Manager' && password === '456') {
      navigate('/dashboard');
    } else if (username === 'User' && password === '789') {
      navigate('/dashboard');
    } else {
      setError('Credential verification failed.');
    }
  };

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans antialiased overflow-hidden">
      
      {/* --- Left Section: Minimalist Brand Panel --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative hidden lg:flex w-[40%] flex-col justify-between p-16 overflow-hidden bg-gray-50 border-r border-gray-100"
      >
        {/* Subtle Engineering Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-blue-600 rounded-full" />
            <span className="text-sm font-bold tracking-[0.3em] text-gray-900">SMARTCHAIN</span>
          </motion.div>
        </div>

        <div className="relative z-10">
          <motion.h2 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-5xl font-bold text-gray-900 leading-tight tracking-tighter"
          >
            Predictive <br />
            Intelligence for <br />
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Global Trade.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-gray-500 text-lg max-w-xs leading-relaxed"
          >
            The centralized operating system for enterprise logistics and supply chain orchestration.
          </motion.p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[10px] tracking-widest text-gray-400 font-bold uppercase">
          <div className="w-8 h-[1px] bg-gray-200" />
        </div>
      </motion.div>

      {/* --- Right Section: The Login Form --- */}
      <div className="w-full lg:w-[60%] flex flex-col justify-center items-center bg-white p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-gray-950 text-3xl font-bold tracking-tight">Welcome Back</h3>
            <p className="text-gray-500 mt-2">Authorized personnel only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ scale: 0.9 }} 
                animate={{ scale: 1 }} 
                className="text-red-600 text-xs font-semibold bg-red-50 p-4 rounded-lg border border-red-100 text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">User Identity</label>
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white border border-gray-200 px-4 py-4 rounded-lg text-gray-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
                placeholder="Admin / Manager / User"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Access Code</label>
              </div>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 px-4 py-4 rounded-lg text-gray-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
                placeholder="••••••••"
              />
            </div>

            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full py-5 bg-gray-950 text-white font-bold text-xs tracking-[0.2em] uppercase rounded-lg shadow-2xl shadow-gray-200 hover:bg-blue-600 transition-all"
            >
              Initialize Dashboard
            </motion.button>
          </form>

          <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <p>© 2026 SmartChain Tech</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Compliance</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;