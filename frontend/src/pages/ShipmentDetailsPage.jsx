import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Ship, Plane, Truck, Activity, Settings,
    Search, Bell, AlertCircle, TrendingUp, MapPin, Box, DollarSign,
    CheckCircle2, Bot, Send, MoreHorizontal, Map, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import useShipmentsStream from '../hooks/useShipmentsStream';
import { api } from '../api/endpoints';

const ShipmentDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const streamData = useShipmentsStream();
    const activeShipment = streamData.shipments?.find(s => s.id === id) || {
        id: id || "GLOBAL-CNTR-4112",
        source: "Shenzhen, CN",
        destination: "Rotterdam, NL",
        cargoType: "High-Density Semiconductors",
        value: "$1,240,000.00",
        status: "STALLED",
        riskScore: 85
    };

    const [aiData, setAiData] = useState(null);
    const [loadingAI, setLoadingAI] = useState(true);
    
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    const [selectedOption, setSelectedOption] = useState(1); // 0 = A, 1 = B
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoadingAI(true);
        api.getRerouteRecommendation(id)
            .then(res => {
                setAiData(res.data);
                if (res.data?.analysis) {
                    setChatHistory([{ sender: 'ai', text: res.data.analysis }]);
                }
            })
            .catch(err => console.error("Failed to load AI recommendation", err))
            .finally(() => setLoadingAI(false));
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleApprove = async () => {
        try {
            await api.reroute(id, { routeChoice: selectedOption === 0 ? 'A' : 'B' });
            setIsApproved(true);
            setTimeout(() => navigate('/dashboardpage'), 2000);
        } catch (e) {
            console.error("Reroute failed", e);
        }
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatLoading) return;
        
        const query = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { sender: 'user', text: query }]);
        setIsChatLoading(true);

        try {
            const res = await api.chat({ query, context: { shipmentId: id } });
            setChatHistory(prev => [...prev, { sender: 'ai', text: res.data.response }]);
        } catch (err) {
            setChatHistory(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const links = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboardpage' },
        { name: 'Map', icon: <Map size={18} />, path: '/maps' },
        { name: 'Shipments', icon: <Ship size={18} />, path: `/shipment/${activeShipment.id}`, active: true },
        { name: 'Simulation', icon: <Activity size={18} />, path: '#' },
    ];

    const optA = aiData?.options?.[0] || {
        name: "Option A: Current Plan",
        etaImpact: "+14 Days",
        costImpact: "Current",
        riskImpact: "High",
        confidence: "N/A"
    };

    const optB = aiData?.options?.[1] || {
        name: "Option B: AI Recommended",
        etaImpact: "-10 Days",
        costImpact: "+$950",
        riskImpact: "Low",
        confidence: "94%"
    };

    return (
        <div className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans overflow-hidden">
            {/* LEFT SIDEBAR */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">S</div>
                        <div className="leading-tight">
                            <h1 className="font-bold text-sm tracking-tight text-slate-800">SmartChain</h1>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Enterprise Control</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {links.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => {
                                    if (item.path !== '#') navigate(item.path);
                                }}
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
            <main className="flex-1 flex flex-col overflow-hidden bg-[#F9FAFB]">
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
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Title and Badges */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Reroute Simulation • Critical Alert</p>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Shipment ID {activeShipment.id}</h2>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 ${activeShipment.riskScore >= 75 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'} text-[10px] font-black uppercase rounded-full border`}>
                                {activeShipment.status} • Risk {activeShipment.riskScore}
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full border border-blue-100">Priority: HIGH</span>
                        </div>
                    </div>

                    {/* 3 COLUMNS GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch h-[550px]">
                        
                        {/* COLUMN 1: OPTION A */}
                        <div className={`rounded-2xl border-2 transition-all bg-[#F3F4F6] flex flex-col ${selectedOption === 0 ? 'border-blue-600 shadow-md' : 'border-transparent shadow-sm'}`}>
                            <div className="p-6 flex-1 flex flex-col relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-600 rounded-l-2xl"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
                                        <h3 className="font-bold text-lg">{optA.name}</h3>
                                    </div>
                                    <AlertCircle className="text-red-500" size={24} />
                                </div>

                                <div className="relative rounded-xl overflow-hidden mb-6 group cursor-pointer border border-slate-200" onClick={() => setSelectedOption(0)}>
                                    <img src="https://images.unsplash.com/photo-1494412552100-42e4e7a74ec6?auto=format&fit=crop&q=80&w=400" alt="Vessel" className="w-full h-36 object-cover grayscale" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-lg border border-red-200 flex items-center gap-2 shadow-sm">
                                            <AlertCircle className="text-red-500" size={14} />
                                            <span className="text-xs font-bold text-slate-800">Delay Warning</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">ETA Impact</span>
                                        <span className="font-bold text-red-600">{loadingAI ? '...' : optA.etaImpact}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Transport Mode</span>
                                        <span className="font-bold">Original</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Risk Impact</span>
                                        <span className="font-bold text-red-600">{loadingAI ? '...' : optA.riskImpact}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-200 flex justify-between items-center mt-4">
                                    <span className="text-slate-500 text-sm font-medium">Cost Impact</span>
                                    <span className="font-black text-slate-800 text-lg">{loadingAI ? '...' : optA.costImpact}</span>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: OPTION B (AI RECOMMENDED) */}
                        <div className={`rounded-2xl border-2 transition-all relative flex flex-col bg-white ${selectedOption === 1 ? 'border-blue-600 shadow-xl' : 'border-slate-200 shadow-sm'}`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase px-4 py-1 rounded-full border border-blue-500 tracking-[0.1em] z-10 shadow-sm">AI Recommended</div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4 pt-2">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Optimized Alternative</p>
                                        <h3 className="font-bold text-lg">{optB.name}</h3>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <TrendingUp size={16} />
                                    </div>
                                </div>

                                <div className="relative rounded-xl overflow-hidden mb-6 cursor-pointer border border-slate-100" onClick={() => setSelectedOption(1)}>
                                    <img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=400" alt="Transport" className="w-full h-36 object-cover" />
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">ETA Impact</span>
                                        <span className="font-bold text-blue-600">{loadingAI ? '...' : optB.etaImpact}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Risk Impact</span>
                                        <span className="font-bold text-right pl-4">{loadingAI ? '...' : optB.riskImpact}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Confidence Score</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600" style={{width: loadingAI ? '0%' : optB.confidence}}></div>
                                            </div>
                                            <span className="font-black text-blue-600">{loadingAI ? '...' : optB.confidence}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-between items-center">
                                    <span className="text-slate-500 text-sm font-medium">Adjusted Cost</span>
                                    <span className="font-black text-slate-800 text-lg">{loadingAI ? '...' : optB.costImpact}</span>
                                </div>

                                <button
                                    onClick={handleApprove}
                                    disabled={loadingAI || isApproved}
                                    className={`w-full py-3.5 mt-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${isApproved ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200'} disabled:opacity-50`}
                                >
                                    {isApproved ? (
                                        <span className="flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Route Approved</span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Approve & Deploy</span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* COLUMN 3: AI COPILOT ANALYSIS */}
                        <div className="rounded-2xl bg-[#EEF2F6] flex flex-col overflow-hidden border border-slate-200 shadow-sm relative">
                            <div className="px-6 py-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">AI Copilot Analysis</span>
                                </div>
                                <MoreHorizontal size={16} className="text-slate-400" />
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm flex flex-col">
                                {loadingAI ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                                        <Loader2 className="animate-spin text-blue-600" size={24} />
                                        <span className="text-[10px] uppercase font-bold tracking-widest">Synthesizing Logistics Data...</span>
                                    </div>
                                ) : (
                                    <>
                                        {chatHistory.map((msg, idx) => (
                                            <div key={idx} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                                {msg.sender === 'ai' && (
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                                                        <Bot size={16} />
                                                    </div>
                                                )}
                                                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed max-w-[85%] ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'}`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                        {isChatLoading && (
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                                                    <Bot size={16} />
                                                </div>
                                                <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm text-slate-400">
                                                    <Loader2 className="animate-spin" size={16} />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-slate-200">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask Copilot to simulate another route..." 
                                        disabled={loadingAI || isChatLoading}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                                    />
                                    <button type="submit" disabled={loadingAI || isChatLoading || !chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center transition-colors">
                                        <Send size={14} className="-ml-0.5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* BOTTOM SHIPMENT INFO STRIP */}
                    <div className="grid grid-cols-4 gap-6 pt-2">
                        {[
                            { label: 'Origin', value: activeShipment.source, icon: <MapPin size={20} /> },
                            { label: 'Destination', value: activeShipment.destination, icon: <MapPin size={20} /> },
                            { label: 'Payload', value: activeShipment.cargoType, icon: <Box size={20} /> },
                            { label: 'Status', value: activeShipment.status, icon: <Activity size={20} /> },
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#F3F4F6] border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-slate-200 rounded-xl text-slate-500">
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShipmentDetailsPage;
