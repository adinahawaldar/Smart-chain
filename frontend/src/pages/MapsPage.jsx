import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import { 
  LayoutDashboard, Map, Package, FastForward, Search, Bell, Map as MapIcon, Compass
} from 'lucide-react';
import useShipmentsStream from '../hooks/useShipmentsStream';
import Map2D from '../components/Map2D';
import Chatbot from '../components/Chatbot';

// --- SIDEBAR ---
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

const MapsPage = () => {
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
          }
        });
      })
      .catch(err => {
        console.error('CSV load failed:', err);
        setLoading(false);
      });
  }, []);

  const finalShipments = streamData.shipments?.length > 0 ? streamData.shipments : shipments;
  const connected = streamData.connected;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-400 uppercase font-bold tracking-widest text-sm">Loading Cartography...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50/30 font-sans antialiased">
      <Sidebar />
      <div className="flex-1 ml-64">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 border border-gray-100 w-96">
            <Search size={16} />
            <input placeholder="SEARCH COORDINATES..." className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest text-black w-full" />
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-sm font-bold">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {connected ? 'Live Data' : 'Demo Mode'}
            </div>
            <Bell size={20} />
            <div className="w-8 h-8 bg-black rounded-full" />
          </div>
        </header>

        <main className="p-8 max-w-[1800px] mx-auto space-y-8">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-black flex items-center gap-3">
              Global Command <span className="text-gray-300">/ Maps</span>
            </h2>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2">
              Dual-perspective telemetry tracking and route visualization
            </p>
          </div>

          <div className="h-[calc(100vh-220px)] min-h-[600px] w-full">
            <div className="flex flex-col h-full bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm shadow-black/5 relative group">
              <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/90 to-transparent z-10 p-6 pointer-events-none flex items-center gap-3">
                 <MapIcon size={20} className="text-indigo-600" />
                 <h3 className="text-black font-black text-sm uppercase tracking-widest">Live Interactive Map</h3>
              </div>
              <div className="flex-1">
                <Map2D shipments={finalShipments} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default MapsPage;
