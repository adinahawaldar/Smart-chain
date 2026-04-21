import React, { useState } from 'react';
import { 
  Ship, Plane, Truck, AlertTriangle, Wind, ShieldAlert, 
  Activity, Search, Bell, ChevronRight, CheckCircle2, 
  ArrowRight, Zap, DollarSign, Clock, ShieldCheck, Globe, Info, Lock
} from 'lucide-react';

const SmartChainFinalDemo = () => {
  const [simulationEvent, setSimulationEvent] = useState(null);
  const [location, setLocation] = useState('Suez Canal (EGY)');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Shipments - Risk status is now dynamic based on simulationEvent
  const initialShipments = [
    { id: 'SC-9012', route: 'LAX ➔ TYO', mode: <Plane size={14}/>, baseRisk: 'OPTIMAL', region: 'Pacific' },
    { id: 'SC-0021', route: 'SHG ➔ BOM', mode: <Ship size={14}/>, baseRisk: 'OPTIMAL', region: 'Suez Canal (EGY)' },
    { id: 'SC-5561', route: 'SIN ➔ RTM', mode: <Ship size={14}/>, baseRisk: 'OPTIMAL', region: 'Suez Canal (EGY)' },
    { id: 'SC-4432', route: 'DXB ➔ LHR', mode: <Plane size={14}/>, baseRisk: 'OPTIMAL', region: 'Global' },
    { id: 'SC-1188', route: 'AMS ➔ HAM', mode: <Truck size={14}/>, baseRisk: 'OPTIMAL', region: 'Europe' },
  ];

  const triggerSimulation = (type) => {
    setSimulationEvent(type);
    setIsAnalyzing(true);
    setSelectedRoute(null);
    // Simulate AI "Thinking" time
    setTimeout(() => setIsAnalyzing(false), 800);
  };

  const rerouteStrategies = [
    {
      id: 'opt-1',
      name: 'Cape of Good Hope Diversion',
      eta: '+8.5 Days',
      cost: '+$142,000',
      intelligence: {
        summary: "Primary corridor blocked. Redirecting fleet to Southern African maritime routes.",
        borderReq: "Transit requires 'SADC Regional Customs Transit' (RCTD) digital filing. Pre-clearance required for South African territorial waters.",
        breakdown: [
          { item: "Fuel Bunkering (Durban)", cost: "$85,000", desc: "Mid-transit refueling due to 3,500nm extension." },
          { item: "Insurance Premium", cost: "$12,000", desc: "War-risk/Storm-risk surcharge for high-sea transit." },
          { item: "Crew Overtime", cost: "$45,000", desc: "Compliance with maritime labor laws for extended voyage." }
        ],
        nextStep: "Transmit vector 182° SW to Ship Master. Automate RCTD filing via SmartChain API."
      }
    },
    {
      id: 'opt-2',
      name: 'Intermodal Rail-Bridge Pivot',
      eta: '+3.2 Days',
      cost: '+$111,000',
      intelligence: {
        summary: "Bypassing maritime node via high-speed GCC Rail and Trucking infrastructure.",
        borderReq: "TIR Carnet (International Road Transport) required. Automated border-gate entry for KSA and UAE.",
        breakdown: [
          { item: "Port Discharge (Salalah)", cost: "$30,000", desc: "Priority offloading and crane handling." },
          { item: "Rail Freight (GCC Network)", cost: "$62,000", desc: "Intermodal container leasing and rail toll." },
          { item: "Customs Clearing", cost: "$19,000", desc: "Multi-jurisdictional expedited transit fees." }
        ],
        nextStep: "Initiate container discharge at Port of Salalah. Direct 40 units to Rail-Terminal B."
      }
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">SmartChain</h1>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-bold">Logistics AI</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {['Control Tower', 'Simulation Hub', 'Asset Ledger', 'AI Archive'].map((l) => (
            <button key={l} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${l === 'Simulation Hub' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Activity size={18} /> {l}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Globe size={16} className="text-blue-600" />
            <span>Operational Integrity: <span className="text-emerald-500 font-black">99.8%</span></span>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right border-r pr-4 border-slate-100 uppercase tracking-tighter">
              <p className="text-xs font-bold text-slate-800 tracking-normal">Adina Hawaldar</p>
              <p className="text-[9px] text-slate-400 font-black tracking-widest">Director of Supply Chain</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-xs border border-slate-200">AH</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-12 gap-6">
            
            {/* Map & Simulation Logic */}
            <div className="col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden relative shadow-sm h-[600px]">
              <div className="absolute inset-0 bg-slate-50 overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
                
                {/* Fleet Icons */}
                <div className="absolute top-[40%] left-[20%] group flex flex-col items-center">
                    <Ship size={20} className={`p-1 bg-white rounded shadow-md border ${simulationEvent && location.includes('Suez') ? 'text-red-500 animate-bounce' : 'text-blue-500'}`} />
                    <span className="text-[8px] font-bold mt-1 bg-slate-900 text-white px-1">SC-MARINER-01</span>
                </div>
                <div className="absolute top-[20%] left-[60%] flex flex-col items-center">
                    <Plane size={20} className="p-1 bg-white rounded shadow-md border text-sky-400" />
                    <span className="text-[8px] font-bold mt-1 bg-slate-900 text-white px-1">AIR-G6</span>
                </div>

                {/* Crisis Overlay */}
                {simulationEvent && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-48 bg-red-500/10 border-2 border-dashed border-red-500/30 rounded-full animate-pulse flex items-center justify-center">
                      <div className="bg-white p-4 rounded-full shadow-2xl">
                        <AlertTriangle className="text-red-500" size={32} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulation Controls Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md border border-slate-200 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex gap-8">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Target Geographic Node</label>
                      <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-transparent text-sm font-bold text-slate-900 outline-none">
                        <option>Suez Canal (EGY)</option>
                        <option>Panama Canal (PAN)</option>
                        <option>Strait of Malacca (SGP)</option>
                      </select>
                    </div>
                    <div className="border-l border-slate-100 pl-8">
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Inject Crisis Scenario</label>
                      <div className="flex gap-2">
                        {[
                          { id: 'STORM', icon: <Wind size={14}/>, label: 'Weather' },
                          { id: 'CONFLICT', icon: <ShieldAlert size={14}/>, label: 'War' },
                          { id: 'ACCIDENT', icon: <Zap size={14}/>, label: 'Accident' }
                        ].map(ev => (
                          <button key={ev.id} onClick={() => triggerSimulation(ev.id)}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-black transition-all flex items-center gap-2 ${simulationEvent === ev.id ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'}`}>
                            {ev.icon} {ev.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {simulationEvent && (
                    <button onClick={() => {setSimulationEvent(null); setSelectedRoute(null);}} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase underline">Reset System</button>
                  )}
                </div>
              </div>
            </div>

            {/* AI STRATEGY SIDEBAR */}
            <div className="col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[600px] flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-500 animate-ping' : 'bg-blue-600'}`}></div>
                <h3 className="font-black text-xs uppercase tracking-widest">Tactical AI Copilot</h3>
              </div>

              {!simulationEvent ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Lock size={20} className="text-slate-300"/></div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">System standby. Awaiting scenario injection to begin predictive risk modeling.</p>
                </div>
              ) : isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center"><Activity size={30} className="text-blue-600 animate-pulse mb-2"/><p className="text-xs font-bold text-slate-400">Analyzing Regional Impact...</p></div>
              ) : (
                <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-2 duration-500">
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-black text-red-600 uppercase mb-2">Simulation Result</h4>
                    <p className="text-xs text-red-900 leading-relaxed font-semibold italic">
                      "{simulationEvent} at {location} has identified 2 vessels in direct breach of schedule. Cascade delay: +192 Hours."
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Pivots</p>
                    {rerouteStrategies.map(r => (
                      <div key={r.id} onClick={() => setSelectedRoute(r)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedRoute?.id === r.id ? 'border-blue-600 bg-blue-50/20 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black">{r.name}</span>
                          <CheckCircle2 size={16} className={selectedRoute?.id === r.id ? 'text-blue-600' : 'text-slate-200'} />
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold">{r.eta} | {r.cost}</p>
                      </div>
                    ))}
                  </div>

                  {selectedRoute && (
                    <div className="mt-4 p-5 bg-white border border-blue-100 rounded-2xl shadow-inner overflow-y-auto max-h-[220px]">
                      <h5 className="text-[10px] font-black text-blue-600 uppercase mb-3 flex items-center gap-1 border-b pb-2"><Info size={14}/> AI Tactical Intelligence</h5>
                      <div className="space-y-4 text-[11px]">
                         <div>
                            <span className="block font-black text-slate-400 uppercase text-[9px]">Logistical Next Steps</span>
                            <p className="text-slate-900 leading-relaxed">{selectedRoute.intelligence.summary}</p>
                         </div>
                         <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                            <span className="block font-black text-emerald-600 uppercase text-[9px] mb-1">Border & Compliance</span>
                            <p className="text-emerald-900 font-bold leading-tight">{selectedRoute.intelligence.borderReq}</p>
                         </div>
                         <div>
                            <span className="block font-black text-slate-400 uppercase text-[9px] mb-2">Cost Analysis Breakdown</span>
                            {selectedRoute.intelligence.breakdown.map((item, i) => (
                              <div key={i} className="flex justify-between mb-2 border-b border-slate-50 pb-1 last:border-0">
                                <div className="pr-4">
                                  <p className="text-slate-900 font-bold">{item.item}</p>
                                  <p className="text-[9px] text-slate-500 leading-tight">{item.desc}</p>
                                </div>
                                <span className="text-blue-600 font-black">{item.cost}</span>
                              </div>
                            ))}
                          </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC LEDGER */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Regional Asset Ledger</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div><span className="text-[10px] font-bold">Safe: {simulationEvent ? '3' : '5'}</span></div>
                 {simulationEvent && <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div><span className="text-[10px] font-bold">At Risk: 2</span></div>}
              </div>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4">Serial ID</th>
                  <th className="px-8 py-4">Global Route</th>
                  <th className="px-8 py-4">Node Region</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Live Intelligence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {initialShipments.map((row, i) => {
                  // LOGIC: If a simulation is running, only show "AT RISK" for things in that region
                  const isAffected = simulationEvent && row.region === location;
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 font-bold text-blue-600">{row.id}</td>
                      <td className="px-8 py-4 font-bold text-slate-800">{row.route}</td>
                      <td className="px-8 py-4 text-slate-500 font-bold">{row.region}</td>
                      <td className="px-8 py-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${isAffected ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600'}`}>
                          {isAffected ? 'At Risk' : 'Optimal'}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <button className={`text-[10px] font-black uppercase transition-opacity ${isAffected ? 'text-blue-600 underline' : 'text-slate-300'}`}>
                          {isAffected ? 'Analyze Shockwave' : 'No Data'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmartChainFinalDemo;