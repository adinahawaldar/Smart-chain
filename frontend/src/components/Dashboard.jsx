import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import useShipmentsStream from '../hooks/useShipmentsStream';
import { api } from '../api/endpoints';
import { fmtTimestamp } from '../utils/format';

// COMPONENTS
import ShipmentTable from './ShipmentTable';
import TelemetryPanel from './TelemetryPanel';
import EventFeed from './EventFeed';
import AIInsightsPanel from './AIInsightsPanel';
import SimulationPanel from './SimulationPanel';
import ReroutingModal from './ReroutingModal';
import Chatbot from './Chatbot';
import LoadingSkeleton from './LoadingSkeleton';
<<<<<<< HEAD
import LiveMap from './LiveMap';
=======
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec

export default function Dashboard({ onBack }) {
  const { connected, lastUpdated, loading } = useShipmentsStream();
  const [rerouteTarget, setRerouteTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const csvRef = useRef(null);

  // --- REALISTIC DEMO DATA SET ---
  const demoShipments = [
<<<<<<< HEAD
    { id: 'SC-9421', active: true, source: 'Dubai', destination: 'Abu Dhabi', status: 'In Transit', progressPct: 65, etaMinutes: 80, speedKmph: 68, temperatureC: 5, cargoType: 'Electronics', vehicleId: 'TRK-11', riskScore: 22, currentPosition: { lat: 24.95, lng: 54.37 }, route: [{ lat: 25.2048, lng: 55.2708 }, { lat: 24.4539, lng: 54.3773 }] },
    { id: 'SC-8832', active: true, source: 'Mumbai', destination: 'Pune', status: 'Loading', progressPct: 12, etaMinutes: 160, speedKmph: 40, temperatureC: 7, cargoType: 'Pharma', vehicleId: 'TRK-07', riskScore: 35, currentPosition: { lat: 18.95, lng: 73.2 }, route: [{ lat: 19.076, lng: 72.8777 }, { lat: 18.5204, lng: 73.8567 }] },
    { id: 'SC-7104', active: true, source: 'Singapore', destination: 'Chennai', status: 'Customs', progressPct: 45, etaMinutes: 420, speedKmph: 52, temperatureC: 4, cargoType: 'Auto Parts', vehicleId: 'TRK-19', riskScore: 71, currentPosition: { lat: 8.5, lng: 84.5 }, route: [{ lat: 1.3521, lng: 103.8198 }, { lat: 13.0827, lng: 80.2707 }] },
    { id: 'SC-5521', active: false, source: 'Delhi', destination: 'Jaipur', status: 'Delivered', progressPct: 100, etaMinutes: 0, speedKmph: 0, temperatureC: 9, cargoType: 'Textiles', vehicleId: 'TRK-03', riskScore: 8, currentPosition: { lat: 26.9124, lng: 75.7873 }, route: [{ lat: 28.6139, lng: 77.209 }, { lat: 26.9124, lng: 75.7873 }] },
    { id: 'SC-4409', active: true, source: 'Sharjah', destination: 'Al Ain', status: 'Delayed', progressPct: 30, etaMinutes: 110, speedKmph: 44, temperatureC: 6, cargoType: 'Food', vehicleId: 'TRK-14', riskScore: 58, currentPosition: { lat: 24.5, lng: 55.9 }, route: [{ lat: 25.3463, lng: 55.4209 }, { lat: 24.2075, lng: 55.7447 }] },
  ];

  const demoEvents = [
    { message: 'PROTOCOL_ALPHA: Asset SC-9421 entered Dubai Logistics Hub.', timestamp: new Date() },
    { message: 'WEATHER_ALERT: Heavy fog detected on E11 highway. Rerouting suggested.', timestamp: new Date() },
    { message: 'SYSTEM: Telemetry sync successful for 18 active nodes.', timestamp: new Date() },
    { message: 'SECURITY: Biometric verification cleared for Terminal 3 dispatch.', timestamp: new Date() },
=======
    { id: 'SC-9421', active: true, route: 'Dubai → Abu Dhabi', status: 'In Transit', progress: 65, eta: '14:20', weight: '1,240 kg', risk: 'Low' },
    { id: 'SC-8832', active: true, route: 'Mumbai → Pune', status: 'Loading', progress: 12, eta: '18:45', weight: '850 kg', risk: 'Nominal' },
    { id: 'SC-7104', active: true, route: 'Singapore → Chennai', status: 'Customs', progress: 45, eta: 'Tomorrow', weight: '2,100 kg', risk: 'High' },
    { id: 'SC-5521', active: false, route: 'Delhi → Jaipur', status: 'Delivered', progress: 100, eta: 'Completed', weight: '400 kg', risk: 'None' },
    { id: 'SC-4409', active: true, route: 'Sharjah → Al Ain', status: 'Delayed', progress: 30, eta: '16:10', weight: '1,100 kg', risk: 'Medium' },
  ];

  const demoEvents = [
    { message: "PROTOCOL_ALPHA: Asset SC-9421 entered Dubai Logistics Hub.", timestamp: new Date() },
    { message: "WEATHER_ALERT: Heavy fog detected on E11 highway. Rerouting suggested.", timestamp: new Date() },
    { message: "SYSTEM: Telemetry sync successful for 18 active nodes.", timestamp: new Date() },
    { message: "SECURITY: Biometric verification cleared for Terminal 3 dispatch.", timestamp: new Date() },
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
  ];

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900 p-8 antialiased">
<<<<<<< HEAD
=======
      
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
      {/* 1. TOP NAVIGATION (Est-Trans Style) */}
      <header className="flex items-center justify-between mb-10 max-w-[1750px] mx-auto">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-[18px] flex items-center justify-center shadow-2xl">
              <div className="w-5 h-5 border-[3px] border-white rotate-45 rounded-sm" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">SmartChain</span>
          </div>
<<<<<<< HEAD

          <nav className="hidden lg:flex bg-white/70 backdrop-blur-md p-1.5 rounded-[24px] shadow-sm border border-white">
            {['Overview', 'Shipping', 'Tracking', 'Analytics', 'Fleet'].map((tab) => (
              <button
                key={tab}
=======
          
          <nav className="hidden lg:flex bg-white/70 backdrop-blur-md p-1.5 rounded-[24px] shadow-sm border border-white">
            {['Overview', 'Shipping', 'Tracking', 'Analytics', 'Fleet'].map((tab) => (
              <button 
                key={tab} 
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 text-[13px] font-bold rounded-[18px] transition-all duration-300 ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{connected ? 'Network_Live' : 'Polling'}</span>
          </div>
          <div className="flex items-center gap-3 bg-white pl-2 pr-5 py-1.5 rounded-full border border-slate-100 shadow-sm cursor-pointer hover:border-slate-300 transition-all">
            <div className="w-9 h-9 bg-indigo-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-black">AH</div>
            <div className="text-left">
              <p className="text-[12px] font-black leading-none">Adina Hawaldar</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter italic">Systems Lead</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1750px] mx-auto space-y-8">
<<<<<<< HEAD
=======
        
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
        {/* 2. OVERVIEW KPI CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-7">
          {[
            { label: 'Total Shipments', val: '4,129', diff: '+2.4%', sub: 'All Nodes' },
            { label: 'Active Moving', val: '18', diff: 'LIVE', sub: 'Global Fleet' },
            { label: 'Risk Alerts', val: '2', diff: 'NOMINAL', sub: 'Score Threshold' },
            { label: 'Delayed Units', val: '3', diff: '-12%', sub: 'Avg 14m' },
            { label: 'Daily Revenue', val: '$42,840', diff: '+5.1%', sub: 'Gross Yield' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-7 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 hover:scale-[1.02] transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${kpi.val === '2' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {kpi.diff}
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.val}</h3>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">{kpi.sub}</p>
            </div>
          ))}
        </section>

        {/* 3. MAPS & LOG SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
<<<<<<< HEAD
=======
          
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
          {/* MAP SECTION */}
          <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-[600px]">
            <div className="px-10 py-7 border-b border-slate-50 flex justify-between items-center bg-white z-10">
              <div>
                <h4 className="text-lg font-black tracking-tight">Geospatial Command Center</h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Vectored Hub: Dubai Terminal 1</p>
              </div>
              <div className="flex gap-3">
<<<<<<< HEAD
                <button className="px-5 py-2 text-[10px] font-black text-slate-900 border border-slate-200 rounded-xl uppercase">Map Settings</button>
                <button className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl shadow-lg">+ New Deployment</button>
              </div>
            </div>

            <div className="flex-1 relative min-h-0">
              <LiveMap shipments={demoShipments} />
=======
                 <button className="px-5 py-2 text-[10px] font-black text-slate-900 border border-slate-200 rounded-xl uppercase">Map Settings</button>
                 <button className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl shadow-lg">+ New Deployment</button>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-100 relative p-12 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
               {/* DEMO FLOATING ASSET CARDS */}
               <div className="absolute top-10 right-10 flex flex-col gap-4">
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Global Link Stable</span>
                  </div>
               </div>

               {/* SHIPMENT CARDS ON MAP */}
               <div className="absolute bottom-10 left-10 right-10 grid grid-cols-2 gap-6">
                  {demoShipments.slice(0, 2).map((s, i) => (
                    <div key={i} className="bg-white/95 backdrop-blur-lg p-6 rounded-[28px] shadow-2xl border border-white flex gap-5 items-center">
                      <div className="w-14 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shrink-0">
                         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                           <p className="text-[10px] font-black text-slate-400 uppercase">{s.id}</p>
                           <span className="text-[11px] font-black text-indigo-600">{s.progress}%</span>
                        </div>
                        <p className="text-[14px] font-black">{s.route}</p>
                        <div className="h-1.5 bg-slate-100 w-full mt-3 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-600" style={{width: `${s.progress}%`}} />
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
            </div>
          </div>

          {/* EVENT FEED */}
          <div className="lg:col-span-4 bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] flex flex-col h-[600px]">
            <div className="px-10 py-7 border-b border-slate-50">
<<<<<<< HEAD
              <h4 className="text-lg font-black tracking-tight">System Event Feed</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <EventFeed events={demoEvents} />
=======
               <h4 className="text-lg font-black tracking-tight">System Event Feed</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
               <EventFeed events={demoEvents} />
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
            </div>
          </div>
        </div>

        {/* 4. SHIPMENT REGISTRY & TELEMETRY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
<<<<<<< HEAD
          {/* SHIPMENT REGISTRY TABLE */}
          <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h4 className="text-lg font-black tracking-tight">Shipment Registry</h4>
              <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
                {['All Shipments', 'Active', 'Delayed'].map((f, i) => (
                  <button key={f} className={`px-5 py-1.5 text-[11px] font-bold rounded-xl transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4">
              <ShipmentTable shipments={demoShipments} onReroute={setRerouteTarget} />
            </div>
=======
          
          {/* SHIPMENT REGISTRY TABLE */}
          <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden">
             <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h4 className="text-lg font-black tracking-tight">Shipment Registry</h4>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
                   {['All Shipments', 'Active', 'Delayed'].map((f, i) => (
                     <button key={f} className={`px-5 py-1.5 text-[11px] font-bold rounded-xl transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}`}>{f}</button>
                   ))}
                </div>
             </div>
             <div className="p-4">
                <ShipmentTable shipments={demoShipments} onReroute={setRerouteTarget} />
             </div>
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
          </div>

          {/* TELEMETRY & SIMULATION ENGINE */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
<<<<<<< HEAD
              <h4 className="text-lg font-black tracking-tight mb-8">Asset Telemetry</h4>
              <TelemetryPanel shipments={demoShipments} />
              <div className="mt-8 pt-8 border-t border-slate-50">
                <SimulationPanel onSimulated={() => {}} />
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-[0.2em] mb-4">Neural Insights</p>
                <div className="space-y-4">
                  <p className="text-[13px] font-medium leading-relaxed text-indigo-50">
                    Asset <span className="font-black">SC-7104</span> showing 12% drift in ETA. Traffic optimization on Singapore Corridor recommended.
                  </p>
                  <button className="text-[10px] font-black uppercase text-indigo-400 hover:text-white transition-colors">Apply Reroute Pattern →</button>
                </div>
              </div>
            </div>
          </div>
=======
               <h4 className="text-lg font-black tracking-tight mb-8">Asset Telemetry</h4>
               <TelemetryPanel shipments={demoShipments} />
               <div className="mt-8 pt-8 border-t border-slate-50">
                  <SimulationPanel onSimulated={() => {}} />
               </div>
            </div>
            
            <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-[0.2em] mb-4">Neural Insights</p>
                  <div className="space-y-4">
                     <p className="text-[13px] font-medium leading-relaxed text-indigo-50">
                        Asset <span className="font-black">SC-7104</span> showing 12% drift in ETA. Traffic optimization on Singapore Corridor recommended.
                     </p>
                     <button className="text-[10px] font-black uppercase text-indigo-400 hover:text-white transition-colors">Apply Reroute Pattern →</button>
                  </div>
               </div>
            </div>
          </div>

>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
        </div>
      </main>

      {/* FOOTER ACTION */}
      <div className="fixed bottom-10 right-10 z-50">
        <Chatbot />
      </div>
    </div>
  );
}