import React, { useState } from 'react';
import {
    LayoutDashboard, Ship, Plane, Truck, Activity, Settings,
    Search, Bell, Info, CheckCircle2, AlertCircle, ArrowRight,
    TrendingUp, MapPin, Box, DollarSign, TrainFront
} from 'lucide-react';

const ReRouting = () => {
    // Functional State for the specific shipment being analyzed
    const [shipmentData, setShipmentData] = useState({
        id: "#GLOBAL-CNTR-4112",
        origin: "Shenzhen, CN",
        destination: "Rotterdam, NL",
        payload: "High-Density Semiconductors",
        value: "$1,240,000.00",
        status: "STALLED: PORT CONGESTION"
    });

    const [selectedOption, setSelectedOption] = useState('B'); // B is AI recommended
    const [isApproved, setIsApproved] = useState(false);

    // Comparison Data Logic
    const options = {
        A: {
            title: "Option A: Sea Freight",
            image: "https://images.unsplash.com/photo-1494412552100-42e4e7a74ec6?auto=format&fit=crop&q=80&w=400",
            delay: "+14 Days",
            eta: "Oct 25, 2023",
            mode: "Deep Sea (Maersk Line)",
            risk: "High (Congestion)",
            cost: "$4,200.00",
            statusColor: "text-red-500"
        },
        B: {
            title: "Option B: Intermodal Shift",
            image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=400",
            delay: "-10d",
            eta: "Oct 15, 2023",
            mode: "Sea to Rail (Land Bridge)",
            confidence: "94%",
            cost: "$5,150.00",
            diff: "+$950",
            statusColor: "text-blue-600"
        }
    };

    return (
        <div className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans overflow-hidden">
            {/* LEFT SIDEBAR - Matches image_be093c.png */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">S</div>
                        <div className="leading-tight">
                            <h1 className="font-bold text-sm tracking-tight text-slate-800">SmartChain</h1>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Enterprise Control</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { name: 'Dashboard', icon: <LayoutDashboard size={18} />, active: false },
                            { name: 'Shipments', icon: <Ship size={18} />, active: true },
                            { name: 'Simulation', icon: <Activity size={18} />, active: false },
                            { name: 'Settings', icon: <Settings size={18} />, active: false },
                        ].map((item) => (
                            <button
                                key={item.name}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${item.active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {item.icon} {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-slate-100">
                    <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                        Predictive Insights
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header Search Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search shipments, routes, or assets..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Bell size={18} className="text-slate-400 cursor-pointer" />
                        <div className="w-8 h-8 bg-slate-800 rounded-full border border-slate-200"></div>
                    </div>
                </header>

                {/* SHIPMENT CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Title and Badges */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Reroute Simulation • Critical Alert</p>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Shipment ID {shipmentData.id}</h2>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-full border border-red-100">{shipmentData.status}</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full border border-blue-100">Priority: High</span>
                        </div>
                    </div>

                    {/* OPTIONS GRID */}
                    <div className="grid grid-cols-2 gap-8 items-stretch">
                        {/* OPTION A: Current Plan */}
                        <div className={`p-1 rounded-3xl border-2 transition-all ${selectedOption === 'A' ? 'border-blue-600' : 'border-transparent bg-white shadow-sm'}`}>
                            <div className="bg-white rounded-[22px] p-6 h-full flex flex-col border border-slate-100">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Current Plan</p>
                                        <h3 className="font-bold text-lg">{options.A.title}</h3>
                                    </div>
                                    <AlertCircle className="text-red-500" size={24} />
                                </div>

                                <div className="relative rounded-2xl overflow-hidden mb-6 group cursor-pointer" onClick={() => setSelectedOption('A')}>
                                    <img src={options.A.image} alt="Vessel" className="w-full h-48 object-cover grayscale" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-red-200 flex items-center gap-2">
                                            <AlertCircle className="text-red-500" size={14} />
                                            <span className="text-xs font-bold text-slate-800">Port Delay: {options.A.delay}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Estimated Arrival</span>
                                        <span className="font-bold text-red-500">{options.A.eta}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Transport Mode</span>
                                        <span className="font-bold">{options.A.mode}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Risk Factor</span>
                                        <span className="font-bold text-red-500">{options.A.risk}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-4 border-t border-slate-50">
                                        <span className="text-slate-400 font-medium">Current Cost</span>
                                        <span className="font-black text-slate-800 text-lg">{options.A.cost}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* OPTION B: AI Recommended */}
                        <div className={`p-1 rounded-3xl border-2 transition-all relative ${selectedOption === 'B' ? 'border-blue-600 bg-blue-600 shadow-xl' : 'border-transparent bg-white shadow-sm'}`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase px-4 py-1 rounded-full border border-blue-500 tracking-[0.1em] z-10">AI Recommended</div>

                            <div className="bg-white rounded-[22px] p-6 h-full flex flex-col border border-slate-100">
                                <div className="flex justify-between items-start mb-6 pt-2">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Optimized Alternative</p>
                                        <h3 className="font-bold text-lg">{options.B.title}</h3>
                                    </div>
                                    <TrendingUp className="text-blue-600" size={24} />
                                </div>

                                <div className="relative rounded-2xl overflow-hidden mb-6 cursor-pointer" onClick={() => setSelectedOption('B')}>
                                    <img src={options.B.image} alt="Train" className="w-full h-48 object-cover" />
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Estimated Arrival</span>
                                        <span className="font-bold text-blue-600">{options.B.eta} <span className="text-[10px] ml-1">({options.B.delay})</span></span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Transport Mode</span>
                                        <span className="font-bold">{options.B.mode}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-medium">Confidence Score</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 w-[94%]"></div>
                                            </div>
                                            <span className="font-black text-blue-600">{options.B.confidence}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm pt-4 border-t border-slate-50">
                                        <span className="text-slate-400 font-medium">Adjusted Cost</span>
                                        <span className="font-black text-slate-800 text-lg">{options.B.cost} <span className="text-[10px] text-red-500 ml-1">({options.B.diff})</span></span>
                                    </div>

                                    <button
                                        onClick={() => setIsApproved(true)}
                                        className={`w-full py-4 mt-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isApproved ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100'}`}
                                    >
                                        {isApproved ? (
                                            <span className="flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Stakeholders Notified</span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Approve & Notify Stakeholders</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM SHIPMENT INFO STRIP */}
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Origin', value: shipmentData.origin, icon: <MapPin size={18} /> },
                            { label: 'Destination', value: shipmentData.destination, icon: <MapPin size={18} /> },
                            { label: 'Payload', value: shipmentData.payload, icon: <Box size={18} /> },
                            { label: 'Value', value: shipmentData.value, icon: <DollarSign size={18} /> },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                                <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-sm font-bold text-slate-800">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReRouting;