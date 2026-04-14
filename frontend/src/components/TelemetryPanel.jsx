import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { api } from '../api/endpoints'
import { fmtSpeed } from '../utils/format'
import GlassCard from './GlassCard'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl p-2.5 text-xs shadow-float border border-white/40">
      {payload[0] && <div className="text-indigo-600 font-semibold">Risk: {payload[0].value}</div>}
      {payload[1] && <div className="text-teal-600 font-medium">Speed: {payload[1].value} km/h</div>}
    </div>
  )
}

export default function TelemetryPanel({ shipments }) {
  const [telemetry,  setTelemetry]  = useState(null)
  const [chartData,  setChartData]  = useState([])

  useEffect(() => {
    let mounted = true
    async function fetch() {
      try {
        const res = await api.getTelemetry()
        if (!mounted) return
        setTelemetry(res.data)
        if (res.data.tickHistory?.length) {
          setChartData(
            res.data.tickHistory.map((t, i) => ({ i, avgRisk: t.avgRisk, avgSpeed: t.avgSpeed }))
          )
        }
      } catch {}
    }
    fetch()
    const id = setInterval(fetch, 3000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  const active   = shipments.filter(s => s.active)
  const avgRisk  = telemetry?.avgRisk  ?? (shipments.length
    ? Math.round(shipments.reduce((a,s) => a + s.riskScore, 0) / shipments.length) : 0)
  const avgSpeed = telemetry?.avgSpeed ?? (active.length
    ? Math.round(active.reduce((a,s) => a + s.speedKmph * (s.speedFactor||1), 0) / active.length) : 0)
  const onTime   = telemetry?.onTimeProbability ?? 0

  const riskColor  = avgRisk >= 75 ? 'text-red-600' : avgRisk >= 40 ? 'text-amber-600' : 'text-indigo-600'
  const onTimeColor= onTime >= 80  ? 'text-emerald-600' : onTime >= 50  ? 'text-amber-600' : 'text-red-600'

  return (
    <GlassCard title="Live Telemetry" subtitle="Fleet-wide rolling metrics">
      {/* Metric pills */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Avg Risk',   value: `${avgRisk}`,  color: riskColor  },
          { label: 'Avg Speed',  value: fmtSpeed(avgSpeed), color: 'text-teal-600'  },
          { label: 'On-Time %',  value: `${onTime}%`,  color: onTimeColor },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/60 rounded-xl p-2.5 text-center border border-white/40">
            <div className={`text-xl font-extrabold ${color} leading-none`}>{value}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-32">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top:4, right:4, bottom:0, left:-24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="i" hide />
              <YAxis tick={{ fontSize:10, fill:'#94a3b8' }} domain={[0,100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgRisk"  stroke="#6366F1" strokeWidth={2} dot={false} activeDot={{ r:3 }} />
              <Line type="monotone" dataKey="avgSpeed" stroke="#0D9488" strokeWidth={2} dot={false} activeDot={{ r:3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-300 text-xs">
            Accumulating telemetry data...
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" />
          Avg Risk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-teal-500 inline-block rounded" />
          Avg Speed
        </span>
      </div>
    </GlassCard>
  )
}
