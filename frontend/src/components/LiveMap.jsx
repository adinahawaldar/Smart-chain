import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { getRiskBand } from '../utils/risk';
import { fmtEta, fmtSpeed, fmtProgress, fmtTemp } from '../utils/format';
import { api } from '../api/endpoints';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, ArrowRight, DollarSign, Clock, ShieldCheck, Info } from 'lucide-react';

// Major logistics hubs / country labels for a better "Global" feel
const COUNTRY_LABELS = [
  { lat: 20.5937, lng: 78.9629, name: 'India', color: '#64748b', size: 1.2 },
  { lat: 35.8617, lng: 104.1954, name: 'China', color: '#64748b', size: 1.2 },
  { lat: 37.0902, lng: -95.7129, name: 'USA', color: '#64748b', size: 1.2 },
  { lat: 55.3781, lng: -3.4360, name: 'UK', color: '#64748b', size: 1.0 },
  { lat: 25.2744, lng: 133.7751, name: 'Australia', color: '#64748b', size: 1.2 },
  { lat: -14.2350, lng: -51.9253, name: 'Brazil', color: '#64748b', size: 1.2 },
  { lat: 23.8859, lng: 45.0792, name: 'Saudi Arabia', color: '#64748b', size: 1.0 },
  { lat: 1.3521, lng: 103.8198, name: 'Singapore', color: '#64748b', size: 0.8 },
  { lat: 25.2048, lng: 55.2708, name: 'UAE', color: '#64748b', size: 0.8 },
  { lat: 52.1326, lng: 5.2913, name: 'Netherlands', color: '#64748b', size: 0.8 },
];

export default function LiveMap({ shipments, onReroute }) {
  const globeRef = useRef();
  const [selected, setSelected] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200, 
    height: 500 
  });

  // Filter valid routable shipments
  const routable = useMemo(() => 
    shipments.filter(s => s.currentPosition && s.source && s.destination),
    [shipments]
  );

  // Map arcs (routes)
  const arcsData = useMemo(() => routable.map(s => {
    const band = getRiskBand(s.riskScore);
    const start = s.route && s.route.length > 0 ? s.route[0] : s.currentPosition;
    const end = s.route && s.route.length > 0 ? s.route[s.route.length - 1] : s.currentPosition;

    return {
      startLat: start.lat,
      startLng: start.lng,
      endLat: end.lat,
      endLng: end.lng,
      color: band.color,
      name: `${s.id}: ${s.source} → ${s.destination}`,
      risk: s.riskScore
    };
  }), [routable]);

  // Combined labels for Countries and Shipments
  const combinedLabels = useMemo(() => {
    const shipmentLabels = routable.map(s => {
      const band = getRiskBand(s.riskScore);
      return {
        lat: s.currentPosition.lat,
        lng: s.currentPosition.lng,
        name: `ID: ${s.id}`,
        color: band.color,
        size: 0.8,
        shipment: s,
        isShipment: true
      };
    });

    return [...COUNTRY_LABELS, ...shipmentLabels];
  }, [routable]);

  // Points (Live vehicle glow)
  const pointsData = useMemo(() => routable.map(s => {
    const band = getRiskBand(s.riskScore);
    return {
      lat: s.currentPosition.lat,
      lng: s.currentPosition.lng,
      size: s.active ? 0.6 : 0.2,
      color: band.color,
      shipment: s
    };
  }), [routable]);

  // Handle resizing
  const containerRef = useRef();
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setWindowSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = isHovered ? 2.5 : 0.5;
      controls.enablePan = true;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      if (!selected) {
        globeRef.current.pointOfView({ lat: 20, lng: 70, altitude: 2.0 }, 1000);
      }
    }
  }, [isHovered]);

  // Handle Reroute Click
  const handleRerouteAI = () => {
    if (!selected) return;
    onReroute(selected);
  };

  const handleReset = () => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 70, altitude: 2.0 }, 1000);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#eef2ff]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Globe
        ref={globeRef}
        width={windowSize.width}
        height={windowSize.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        // Arcs
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={2}
        arcDashAnimateTime={2000}
        arcStroke={0.6}
        
        // Points
        pointsData={pointsData}
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointsMerge={false}
        onPointClick={(pt) => {
          setSelected(pt.shipment);
          globeRef.current.pointOfView({ lat: pt.lat, lng: pt.lng, altitude: 1.5 }, 1000);
        }}
        
        // Labels (Countries + Shipments)
        labelsData={combinedLabels}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelSize="size"
        labelDotRadius={0.3}
        labelColor={d => d.isShipment ? d.color : d.color}
        labelResolution={2}
        onLabelClick={d => {
          if (d.isShipment) {
            setSelected(d.shipment);
            globeRef.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.5 }, 1000);
          }
        }}
      />

      {/* Control Overlays */}
      <div className="absolute top-4 left-6 pointer-events-none z-10">
        <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          Global Fleet Telemetric Sphere
        </h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Real-time Orbital Monitoring</p>
      </div>

      <div className="absolute bottom-4 left-6 flex gap-2 z-10">
        <button 
          onClick={handleReset}
          className="bg-white/80 hover:bg-white text-slate-800 text-[10px] font-black px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all active:scale-95 uppercase tracking-tighter"
        >
          Reset View
        </button>
      </div>

      {/* Selected Details Overlay */}
      {selected && (
        <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80 glass p-6 rounded-2xl z-[100] border border-slate-200 text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-black text-slate-800">{selected.id}</h4>
              <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest">{selected.vehicleId}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setSelected(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-black text-[9px] mb-1">Status</p>
              <p className="font-bold flex items-center gap-1.5 text-slate-700">
                <span className={`w-1.5 h-1.5 rounded-full ${selected.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {selected.status}
              </p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-black text-[9px] mb-1">Speed</p>
              <p className="font-bold text-slate-700">{fmtSpeed(selected.speedKmph * (selected.speedFactor || 1))}</p>
            </div>
            <div className="col-span-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-400 uppercase font-black text-[9px] mb-1">Route</p>
              <p className="font-bold truncate text-slate-800">{selected.source} → {selected.destination}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-black text-[9px] mb-1">ETA</p>
              <p className="font-bold text-indigo-600">{fmtEta(selected.etaMinutes)}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-black text-[9px] mb-1">Risk Score</p>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${selected.riskScore > 70 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {selected.riskScore}
                </span>
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800 transition-all" style={{ width: `${selected.riskScore}%` }} />
                </div>
              </div>
            </div>
          </div>
          
          {selected.riskScore >= 70 && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleRerouteAI(); }}
              className="w-full mt-6 bg-indigo-600 text-white font-black py-3 rounded-xl text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              <Zap size={14} />
              Reroute with AI
            </button>
          )}

          <button className="w-full mt-3 bg-slate-900 text-white font-black py-3 rounded-xl text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-colors active:scale-95 shadow-lg shadow-slate-200">
            Intercept Transmission
          </button>
        </div>
      )}

      {/* Minimalism Legend */}
      <div className="absolute top-4 right-6 pointer-events-none flex gap-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
        <div className="flex items-center gap-1.5"><span className="w-2 h-0.5 bg-red-500 rounded-full" /> Critical</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-0.5 bg-yellow-500 rounded-full" /> Alert</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-0.5 bg-blue-600 rounded-full" /> Optimal</div>
      </div>
    </div>
  );
}
