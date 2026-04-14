function KpiCard({ label, value, icon, color, sub }) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${color}`}>
          {icon}
        </div>
      </div>
      <span className="text-3xl font-extrabold text-slate-800 leading-none mt-1">{value}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  )
}

export default function KpiCards({ shipments }) {
  const total     = shipments.length
  const active    = shipments.filter(s => s.active).length
  const highRisk  = shipments.filter(s => s.riskScore >= 75).length
  const delayed   = shipments.filter(s => s.status === 'Delayed').length
  const delivered = shipments.filter(s => s.status === 'Delivered').length

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <KpiCard label="Total Shipments" value={total}     icon="📦" color="bg-indigo-500/10 text-indigo-600" sub="all routes" />
      <KpiCard label="Active Moving"   value={active}    icon="🚚" color="bg-teal-500/10 text-teal-600"     sub="in transit" />
      <KpiCard label="High Risk"       value={highRisk}  icon="⚠️" color="bg-red-500/10 text-red-600"       sub="score ≥ 75" />
      <KpiCard label="Delayed"         value={delayed}   icon="🕐" color="bg-amber-500/10 text-amber-600"   sub="needs action" />
      <KpiCard label="Delivered"       value={delivered} icon="✅" color="bg-emerald-500/10 text-emerald-600" sub="today" />
    </div>
  )
}
