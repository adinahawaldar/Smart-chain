import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { getRiskBand } from '../utils/risk';
import { fmtEta, fmtSpeed } from '../utils/format';

export default function VehicleMap({ shipments }) {
  const globeRef = useRef();
  const [selected, setSelected] = useState(null);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth / 2 : 600, 
    height: 600 
  });
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
    // small delay to let layout settle
    setTimeout(updateSize, 100);
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const routable = useMemo(() => 
    shipments.filter(s => s.currentPosition && s.source && s.destination),
    [shipments]
  );

  const markerData = useMemo(() => routable.map(s => {
    // Determine type
    let type = 'truck';
    if (s.cargoType === 'Electronics' || s.source === 'Mumbai') type = 'ship';
    if (s.cargoType === 'Pharmaceuticals' || s.destination === 'New York') type = 'plane';

    return {
      lat: s.currentPosition.lat,
      lng: s.currentPosition.lng,
      shipment: s,
      type
    };
  }), [routable]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[600px] relative overflow-hidden bg-gradient-to-br from-slate-900 to-black rounded-2xl border border-gray-800">
      <Globe
        ref={globeRef}
        width={windowSize.width}
        height={windowSize.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        htmlElementsData={markerData}
        htmlElement={d => {
          const el = document.createElement('div');
          el.className = 'group cursor-pointer transition-transform hover:scale-125';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.background = 'rgba(0,0,0,0.5)';
          el.style.borderRadius = '50%';
          el.style.border = '1px solid rgba(255,255,255,0.2)';
          el.style.backdropFilter = 'blur(4px)';
          el.style.pointerEvents = 'auto';
          el.onclick = () => {
             setSelected(d.shipment);
             globeRef.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 0.5 }, 1000);
          };
          
          let iconSvg = '';
          if (d.type === 'ship') {
             iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/></svg>`;
          } else if (d.type === 'plane') {
             iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.5l-1.3 1.5c-.3.3-.3.8 0 1.1L7 13l-4 4-2.5-.5c-.3 0-.6.2-.8.5L0 19l6 1 1 6c.3-.2.5-.5.5-.8l-.5-2.5 4-4 3.7 4.6c.3.3.8.3 1.1 0l1.5-1.3c.3-.2.6-.6.5-1.1z"/></svg>`;
          } else {
             iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`;
          }
          el.innerHTML = iconSvg;
          return el;
        }}
      />
      
      {/* Overlays */}
      <div className="absolute top-4 left-6 pointer-events-none z-10">
        <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          Live Fleet Radar
        </h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Vehicle Tracking Matrix</p>
      </div>

      <div className="absolute bottom-4 left-6 flex gap-2 z-10 pointer-events-auto">
        <button 
          onClick={() => {
            if (globeRef.current) globeRef.current.pointOfView({ lat: 20, lng: 70, altitude: 2.0 }, 1000);
          }}
          className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black px-4 py-2 rounded-lg border border-white/20 shadow-sm transition-all active:scale-95 uppercase tracking-tighter backdrop-blur-sm"
        >
          Reset View
        </button>
      </div>

      {selected && (
        <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80 bg-white/10 backdrop-blur-xl p-6 rounded-2xl z-[100] border border-white/20 text-white animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-black text-white">{selected.id}</h4>
              <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">{selected.vehicleId}</p>
            </div>
            <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
            <div>
              <p className="text-white/50 uppercase font-black text-[9px] mb-1">Status</p>
              <p className="font-bold flex items-center gap-1.5 text-white/90">
                <span className={`w-1.5 h-1.5 rounded-full ${selected.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {selected.status}
              </p>
            </div>
            <div>
              <p className="text-white/50 uppercase font-black text-[9px] mb-1">Speed</p>
              <p className="font-bold text-white/90">{fmtSpeed(selected.speedKmph * (selected.speedFactor || 1))}</p>
            </div>
            <div className="col-span-2 p-2 bg-black/20 rounded-lg border border-white/10">
              <p className="text-white/50 uppercase font-black text-[9px] mb-1">Route</p>
              <p className="font-bold truncate text-white">{selected.source} → {selected.destination}</p>
            </div>
            <div>
              <p className="text-white/50 uppercase font-black text-[9px] mb-1">ETA</p>
              <p className="font-bold text-indigo-300">{fmtEta(selected.etaMinutes)}</p>
            </div>
            <div>
              <p className="text-white/50 uppercase font-black text-[9px] mb-1">Risk Score</p>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${selected.riskScore > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selected.riskScore}
                </span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all" style={{ width: `${selected.riskScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
