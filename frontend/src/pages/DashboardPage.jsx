import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import { 
  LayoutDashboard, Map, Package, FastForward, Activity, AlertTriangle, PackageCheck, Search, Bell,
  Zap, ArrowRight, DollarSign, Clock, ShieldCheck, Info, X, Loader2
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import useShipmentsStream from '../hooks/useShipmentsStream';
import { api } from '../api/endpoints';
import LiveMap from '../components/LiveMap';
import EventFeed from '../components/EventFeed';
import AIInsightsPanel from '../components/AIInsightsPanel';
import ShipmentTable from '../components/ShipmentTable';
import Chatbot from '../components/Chatbot';

// --- SIDEBAR (UNCHANGED) ---
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboardpage', active: location.pathname === '/dashboardpage' },
    { name: 'Map', icon: Map, path: '/maps', active: location.pathname === '/maps' },
    { name: 'Shipments', icon: Package, path: '/shipment/GLOBAL-CNTR-4112', active: location.pathname.startsWith('/shipment') },
    { name: 'Simulation', icon: FastForward, path: '#', active: false },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen border-r border-gray-100 bg-white flex flex-col p-8 z-50 antialiased">
      <div className="mb-12 cursor-pointer" onClick={() => navigate('/')}>
        <h1 className="text-2xl font-bold text-black tracking-tighter">SmartChain</h1>
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mt-1">Enterprise OS</p>
      </div>
      
      <nav className="flex-1 space-y-8">
        {links.map((link, idx) => (
          <motion.a 
            key={idx} 
            href={link.path}
            onClick={(e) => {
              if (link.path !== '#') {
                e.preventDefault();
                navigate(link.path);
              }
            }}
            whileHover={{ x: 4 }}
            className={`flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${link.active ? 'text-black' : 'text-gray-400 hover:text-black'}`}
          >
            <link.icon size={18} strokeWidth={link.active ? 2.5 : 1.5} />
            {link.name}
          </motion.a>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Node: UAE-DXB-01</span>
        </div>
      </div>
    </aside>
  );
};

// --- STAT CARD ---
const StatCard = ({ title, value, subtext, icon, warning = false, change }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 bg-white border border-gray-100 flex flex-col justify-between h-44 transition-all hover:border-black/10"
  >
    <div className="flex justify-between items-start">
      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">{title}</span>
      <div className={`p-2 border border-gray-50 rounded-lg ${warning ? 'text-black bg-black/5' : 'text-gray-200'}`}>
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-4xl font-bold tracking-tighter text-black">{value}</h3>
      <p className="text-[11px] text-gray-400 font-medium mt-1 uppercase tracking-tight">{subtext}</p>
      {change && (
        <span className={`text-[10px] font-bold mt-1 block ${change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
  </motion.div>
);

// --- MAIN DASHBOARD ---
const DashboardPage = () => {
  const streamData = useShipmentsStream();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Reroute Modal State
  const [rerouteShipment, setRerouteShipment] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleRerouteRequest = async (shipment) => {
    setRerouteShipment(shipment);
    setLoadingAI(true);
    setRecommendation(null);
    try {
      const res = await api.getRerouteRecommendation(shipment.id);
      setRecommendation(res.data);
    } catch (err) {
      console.error('Reroute AI failed:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleApplyReroute = async (optionIndex) => {
    if (!rerouteShipment) return;
    try {
      await api.reroute(rerouteShipment.id, { routeChoice: optionIndex === 0 ? 'A' : 'B' });
      setRerouteShipment(null);
      setRecommendation(null);
    } catch (err) {
      console.error('Failed to apply reroute:', err);
    }
  };

  useEffect(() => {
    // Load CSV data
    fetch('/sample-import.csv')

      .then(r => r.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data.map(row => ({
              id: row.id,
              vehicleId: row.vehicleId,
              source: row.source,
              destination: row.destination,
              cargoType: row.cargoType,
              temperatureC: parseFloat(row.temperatureC),
              riskScore: parseInt(row.riskScore),
              etaMinutes: parseInt(row.etaMinutes),
              active: true,
              status: 'In Transit',
              progressPct: Math.floor(Math.random() * 80),
              speedKmph: 50 + Math.random() * 30,
              currentPosition: { lat: 20 + Math.random() * 20, lng: 70 + Math.random() * 40 },
              route: [
                { lat: 20 + Math.random() * 10, lng: 70 + Math.random() * 20 },
                { lat: 20 + Math.random() * 10, lng: 70 + Math.random() * 20 }
              ],
            }));
            setShipments(data);
            setLoading(false);
            console.log(`✅ Loaded ${data.length} shipments from CSV`);
          }
        });
      })
      .catch(err => {
        console.error('CSV load failed:', err);
        setLoading(false);
      });
  }, []);

  // Use stream data if available, else CSV fallback
  const finalShipments = streamData.shipments?.length > 0 ? streamData.shipments : shipments;
  const connected = streamData.connected;
  const events = streamData.events || [];

  // Stats
  const maxRisk = Math.max(...finalShipments.map(s => s.riskScore || 0), 0);
  const highRiskCount = finalShipments.filter(s => s.riskScore >= 75).length;
  const activeCount = finalShipments.filter(s => s.active).length;
  
  // Calculate relative health and changes
  const stats = [
    { title: 'System Health', value: `${Math.max(0, 100 - maxRisk)}%`, subtext: `LVL ${Math.max(1, 5 - Math.floor(maxRisk / 25))}`, icon: <Activity size={20} />, change: 2 },
    { title: 'High Risk', value: highRiskCount, subtext: 'Shipments', icon: <AlertTriangle size={20} />, warning: true, change: highRiskCount > 3 ? -1 : 1 },
    { title: 'Active', value: activeCount, subtext: 'Shipments', icon: <PackageCheck size={20} />, change: Math.floor(activeCount / 6) },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50/30 font-sans antialiased">
      <Sidebar />
      <div className="flex-1 ml-64">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 border border-gray-100 w-96">
            <Search size={16} />
            <input placeholder="SEARCH SHIPMENTS..." className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest text-black w-full" />
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-sm font-bold">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {connected ? 'Live' : 'Demo Mode'}
            </div>
            <Bell size={20} />
            <div className="w-8 h-8 bg-black rounded-full" />
          </div>
        </header>

        <main className="p-12 max-w-[1600px] mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
              </div>
              <div className="bg-white border rounded-2xl overflow-hidden h-[500px]">
                <div className="p-4 bg-black/80 text-white text-sm font-bold">
                  Live Fleet ({finalShipments.length} active)
                </div>
                <LiveMap shipments={finalShipments} onReroute={handleRerouteRequest} />
              </div>
            </div>
            <div className="space-y-6">
              <AIInsightsPanel shipments={finalShipments} />
              <EventFeed events={events} />
            </div>
          </div>
          <section className="bg-white border rounded-3xl p-8 shadow-sm shadow-black/5">
            <h3 className="text-3xl font-black mb-8">Global Ledger</h3>
            <ShipmentTable shipments={finalShipments} onReroute={handleRerouteRequest} />
          </section>
        </main>
      </div>
      <Chatbot />

      {/* --- AI REROUTE MODAL --- */}
      <AnimatePresence>
        {rerouteShipment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRerouteShipment(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-black/20 overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="bg-black p-8 text-white flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="text-indigo-400 fill-indigo-400" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">AI Reroute Command</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter">Shipment {rerouteShipment.id}</h2>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">
                    {rerouteShipment.source} <ArrowRight className="inline mx-1 opacity-50" size={10} /> {rerouteShipment.destination}
                  </p>
                </div>
                <button 
                  onClick={() => setRerouteShipment(null)}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8">
                {/* Analysis Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Info size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Strategic Analysis</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 relative overflow-hidden">
                    {loadingAI ? (
                      <div className="flex items-center gap-4 py-2">
                        <Loader2 className="animate-spin text-black" size={20} />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Scanning Global Corridors...</span>
                      </div>
                    ) : (
                      <p className="text-lg font-medium text-gray-800 leading-relaxed italic">
                        "{recommendation?.analysis}"
                      </p>
                    )}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap size={64} />
                    </div>
                  </div>
                </div>

                {/* Options Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recommended Alternatives</span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">2 Optimized Paths Found</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!loadingAI && recommendation?.options.map((opt, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        onClick={() => handleApplyReroute(i)}
                        className="group bg-white border-2 border-gray-100 hover:border-black rounded-2xl p-6 transition-all cursor-pointer relative"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                            {opt.name}
                          </div>
                          <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px]">
                            <ShieldCheck size={14} />
                            {opt.confidence}
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                          {opt.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <DollarSign className="text-gray-400 mb-1" size={12} />
                            <p className="text-[10px] font-black text-gray-800">{opt.costImpact}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <Clock className="text-indigo-400 mb-1" size={12} />
                            <p className="text-[10px] font-black text-indigo-600">{opt.etaImpact}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <Zap className="text-amber-500 mb-1" size={12} />
                            <p className="text-[10px] font-black text-amber-600">{opt.riskImpact}</p>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-[11px] font-black uppercase tracking-widest group-hover:text-black transition-colors opacity-40 group-hover:opacity-100">
                          Deploy Route <ArrowRight size={14} />
                        </div>
                      </motion.div>
                    ))}

                    {loadingAI && [1, 2].map(i => (
                      <div key={i} className="bg-gray-50 border border-gray-100 border-dashed rounded-2xl h-48 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 pt-0 flex justify-center">
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em] text-center">
                  Secure Strategic Deployment System • Powered by Wayyak AI
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;

