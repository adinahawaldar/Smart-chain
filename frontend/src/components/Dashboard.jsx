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
import LiveMap from './LiveMap';

export default function Dashboard({ onBack }) {
  const { connected, lastUpdated, loading } = useShipmentsStream();
  const [rerouteTarget, setRerouteTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const csvRef = useRef(null);

  // --- REALISTIC DEMO DATA SET ---
  const demoShipments = [
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
  ];

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* TOP NAVIGATION */}
      <header className="flex items-center justify-between mb-10 max-w-[1750px] mx-auto">
        <div className="flex items-center gap-12">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-[18px] flex items-center justify-center shadow-2xl">
              <div className="w-5 h-5 border-[3px] border-white rotate-45 rounded-sm" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">SmartChain</span>
          </div>

          <nav className="hidden lg:flex bg-white/70 backdrop-blur-md p-1.5 rounded-[24px] shadow-sm border border-white">
            {['Overview', 'Shipping', 'Tracking', 'Analytics', 'Fleet'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 text-[13px] font-bold rounded-[18px] transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-xl'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {connected ? 'Network_Live' : 'Polling'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1750px] mx-auto space-y-8">

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-7">
          {[
            { label: 'Total Shipments', val: '4,129', diff: '+2.4%', sub: 'All Nodes' },
            { label: 'Active Moving', val: '18', diff: 'LIVE', sub: 'Global Fleet' },
            { label: 'Risk Alerts', val: '2', diff: 'NOMINAL', sub: 'Score Threshold' },
            { label: 'Delayed Units', val: '3', diff: '-12%', sub: 'Avg 14m' },
            { label: 'Daily Revenue', val: '$42,840', diff: '+5.1%', sub: 'Gross Yield' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-7 rounded-[32px] shadow border">
              <p className="text-[11px] font-bold text-slate-400 uppercase">{kpi.label}</p>
              <h3 className="text-3xl font-black">{kpi.val}</h3>
              <p className="text-[10px] text-slate-400">{kpi.sub}</p>
            </div>
          ))}
        </section>

        {/* MAP + EVENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 bg-white rounded-[40px] border shadow overflow-hidden h-[600px]">
            <LiveMap shipments={demoShipments} />
          </div>

          <div className="lg:col-span-4 bg-white rounded-[40px] border shadow h-[600px] overflow-y-auto p-6">
            <EventFeed events={demoEvents} />
          </div>

        </div>

        {/* TABLE + TELEMETRY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 bg-white rounded-[40px] border shadow p-4">
            <ShipmentTable shipments={demoShipments} onReroute={setRerouteTarget} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-[40px] border shadow">
              <TelemetryPanel shipments={demoShipments} />
              <SimulationPanel onSimulated={() => {}} />
            </div>
          </div>

        </div>

      </main>

      <div className="fixed bottom-10 right-10 z-50">
        <Chatbot />
      </div>

    </div>
  );
}