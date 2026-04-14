import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Cpu, 
  Navigation, 
  FlaskConical, 
  Activity,
  ArrowRight,
  LayoutDashboard,
  Database,
  BarChart3,
  Map,
  Zap,
  EyeOff,
  TrendingDown,
  RefreshCcw
} from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  
  const fadeIn = {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans tracking-tight antialiased">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Enterprise Supply Intelligence</p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-6 leading-tight">
              SmartChain – Smarter Supply Chains with AI
            </h1>
            <p className="text-base text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              Predict disruptions. Prevent delays. Optimize logistics. <br/>
              The autonomous operating system for global trade networks.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded transition-all uppercase tracking-widest">
                Request Demo
              </button>
              <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 text-[10px] font-bold rounded transition-all uppercase tracking-widest">
                Login
              </button>
<button 
                onClick={onEnter}
                className="px-6 py-2.5 text-slate-400 hover:text-slate-900 text-[10px] font-bold transition-all uppercase tracking-widest"
              >
                View Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION (Visual & Minimal) */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">The Inefficiency Gap</h2>
            <p className="text-xl font-bold text-slate-900">Global logistics are breaking under manual oversight.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Zap size={20} className="text-amber-500" />, title: 'Delays ', desc: 'Predictable transit is now a rarity.' },
              { icon: <EyeOff size={20} className="text-slate-400" />, title: 'Lack of visibility ', desc: 'Fragmented data leads to blind spots.' },
              { icon: <TrendingDown size={20} className="text-red-500" />, title: 'High costs ', desc: 'Reactive management drains margins.' },
              { icon: <RefreshCcw size={20} className="text-blue-500" />, title: 'Chain reactions ', desc: 'Single failures cause network collapse.' }
            ].map((problem, i) => (
              <motion.div key={i} {...fadeIn} transition={{delay: i * 0.1}} className="p-6 bg-white border border-slate-200 rounded">
                <div className="mb-4">{problem.icon}</div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2">{problem.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{problem.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section className="py-24 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Our Methodology</h2>
            <p className="text-2xl font-bold text-slate-900 mb-6 leading-relaxed">
              “SmartChain uses AI to predict risks and <br className="hidden md:block"/> optimize logistics in real time.”
            </p>
            <div className="flex justify-center gap-12 mt-12 opacity-60 grayscale">
              <div className="flex flex-col items-center gap-2">
                <BarChart3 size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">AI Analysis</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Activity size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">Risk Prediction</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Navigation size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">Smart Decisions</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. KEY FEATURES (Technical Grid) */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Core Capabilities</h2>
            <p className="text-lg font-bold text-slate-900 uppercase tracking-tighter italic underline decoration-blue-600 underline-offset-8">Feature Specification</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: <Activity />, title: 'Cascade Risk Prediction', desc: 'Detect ripple effects.' },
              { icon: <Cpu />, title: 'AI Copilot', desc: 'Natural language terminal.' },
              { icon: <Navigation />, title: 'Autonomous Rerouting', desc: 'Real-time path correction.' },
              { icon: <FlaskConical />, title: 'Simulation Lab', desc: 'Digital twin stress-testing.' },
              { icon: <Database />, title: 'Demand Forecasting', desc: 'Deep learning market data.' },
              { icon: <ShieldAlert />, title: 'Threat Mitigation', desc: 'Automated security protocols.' },
              { icon: <BarChart3 />, title: 'Cost Optimization', desc: 'Algorithmic margin protection.' },
              { icon: <Map />, title: 'Global Live-View', desc: 'Unified supply chain visibility.' }
            ].map((f, i) => (
              <motion.div key={i} {...fadeIn} transition={{delay: i * 0.05}} className="p-6 border border-slate-100 rounded-sm hover:border-slate-300 transition-colors">
                <div className="text-blue-600 mb-4">{React.cloneElement(f.icon, { size: 18 })}</div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-2">{f.title}</h3>
                <p className="text-[10px] text-slate-500 font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (The Engine) */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold tracking-[0.4em] text-slate-500 uppercase mb-12">Orchestration Flow</p>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-4">
             {['Data', 'AI', 'Risk', 'Action'].map((step, i) => (
               <React.Fragment key={i}>
                 <div className="flex-1 text-center">
                    <div className="text-[9px] font-black text-blue-500 mb-2">PROT-0{i+1}</div>
                    <h4 className="text-sm font-bold tracking-widest uppercase mb-1">{step}</h4>
                    <div className="h-[2px] w-8 bg-blue-600 mx-auto mt-2" />
                 </div>
                 {i < 3 && <div className="hidden md:block h-px flex-1 bg-slate-800" />}
               </React.Fragment>
             ))}
          </div>
        </div>
      </section>

      {/* 6. DASHBOARD PREVIEW (Live Demo Mock) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Command Center</h2>
            <p className="text-sm font-medium text-slate-500">Real-time interface for global resource management.</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xl relative overflow-hidden">
             {/* Storm Alert Bonus Section */}
             <motion.div 
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="absolute top-10 right-10 z-20 p-4 bg-white border-l-4 border-red-500 shadow-xl"
             >
                <p className="text-[10px] font-black text-red-600 tracking-widest mb-1">LIVE RISK ALERT</p>
                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-tighter">Storm detected in Chennai</p>
                <div className="mt-2 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                   <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Rerouting Required</p>
                </div>
             </motion.div>

             <div className="aspect-[16/9] border border-slate-100 rounded bg-slate-50 flex flex-col p-4 opacity-40">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                   </div>
                   <div className="h-4 w-32 bg-slate-200 rounded" />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-4">
                   <div className="col-span-8 bg-slate-100 rounded border border-slate-200 border-dashed flex items-center justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 italic">MAP_VIEW_ACTIVE</p>
                   </div>
                   <div className="col-span-4 space-y-4">
                      <div className="h-1/3 bg-slate-100 rounded border border-slate-200" />
                      <div className="h-2/3 bg-slate-100 rounded border border-slate-200" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 7. TECHNOLOGY SECTION */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-10 opacity-30 grayscale contrast-125">
           {['Google Cloud', 'Gemini AI', 'BigQuery', 'Maps API'].map(tech => (
             <span key={tech} className="text-[10px] font-black uppercase tracking-[0.5em]">{tech}</span>
           ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="py-32 text-center">
        <motion.div {...fadeIn}>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Try SmartChain Today</h2>
          <div className="flex justify-center gap-3">
             <button className="px-8 py-3 bg-slate-900 text-white text-[10px] font-bold rounded uppercase tracking-[0.2em]">Login</button>
             <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 text-[10px] font-bold rounded uppercase tracking-[0.2em]">Start Demo</button>
          </div>
          <div className="mt-12 flex justify-center gap-8">
             <div><p className="text-xl font-bold">30%</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Delay Reduction</p></div>
             <div><p className="text-xl font-bold">25%</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Cost Saving</p></div>
          </div>
        </motion.div>
      </section>

      <footer className="py-10 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 SmartChain Enterprise Solutions. Built for Scale.</p>
      </footer>
    </div>
  );
};

export default LandingPage;