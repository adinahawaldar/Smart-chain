import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { 
  LayoutDashboard, Map, Package, FastForward, Activity, AlertTriangle, PackageCheck, Search, Bell 
} from 'lucide-react';
import useShipmentsStream from '../hooks/useShipmentsStream';
import { api } from '../api/endpoints';
import LiveMap from '../components/LiveMap';
import EventFeed from '../components/EventFeed';
import AIInsightsPanel from '../components/AIInsightsPanel';
import ShipmentTable from '../components/ShipmentTable';

// --- SIDEBAR (UNCHANGED) ---
const Sidebar = () => {
  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Map', icon: Map, active: false },
    { name: 'Shipments', icon: Package, active: false },
    { name: 'Simulation', icon: FastForward, active: false },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen border-r border-gray-100 bg-white flex flex-col p-8 z-50 antialiased">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-black tracking-tighter">SmartChain</h1>
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mt-1">Enterprise OS</p>
      </div>
      
      <nav className="flex-1 space-y-8">
        {links.map((link, idx) => (
          <motion.a 
            key={idx} 
            href="#" 
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

  // Use stream data if available, else CSV
  const finalShipments = streamData.shipments?.length > 0 ? streamData.shipments : shipments;
  const connected = streamData.connected;
  const events = streamData.events || [];

  // Stats
  const maxRisk = Math.max(...finalShipments.map(s => s.riskScore || 0), 0);
  const highRiskCount = finalShipments.filter(s => s.riskScore >= 75).length;
  const activeCount = finalShipments.filter(s => s.active).length;
  const stats = [
    { title: 'System Health', value: `${100 - maxRisk}%`, subtext: `LVL ${Math.max(1, 5 - Math.floor(maxRisk / 25))}`, icon: <Activity size={20} />, change: 2 },
    { title: 'High Risk', value: highRiskCount, subtext: 'Shipments', icon: <AlertTriangle size={20} />, warning: true, change: highRiskCount > 3 ? -1 : 1 },
    { title: 'Active', value: activeCount, subtext: 'Shipments', icon: <PackageCheck size={20} />, change: 5 },
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
                <LiveMap shipments={finalShipments} />
              </div>
            </div>
            <div className="space-y-6">
              <AIInsightsPanel shipments={finalShipments} />
              <EventFeed events={events} />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <section className="bg-white border rounded-3xl p-8">
              <h3 className="text-3xl font-black mb-8">Global Ledger</h3>
              <ShipmentTable shipments={finalShipments} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

