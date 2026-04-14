import GlassCard from './GlassCard'
import { fmtEta } from '../utils/format'
import clsx from 'clsx'

const PRIORITY_STYLES = {
  high:   'bg-red-50 border-red-200',
  medium: 'bg-amber-50 border-amber-200',
  low:    'bg-indigo-50 border-indigo-200',
}

function Insight({ icon, text, priority = 'low' }) {
  return (
    <div className={clsx('flex items-start gap-2.5 p-3 rounded-xl border text-xs', PRIORITY_STYLES[priority])}>
      <span className="text-base mt-0.5 shrink-0">{icon}</span>
      <p className="text-slate-700 leading-relaxed">{text}</p>
    </div>
  )
}

export default function AIInsightsPanel({ shipments }) {
  const insights = []
  const active   = shipments.filter(s => s.active)
  const highRisk = [...shipments.filter(s => s.riskScore >= 75)].sort((a,b) => b.riskScore - a.riskScore)
  const delayed  = shipments.filter(s => s.status === 'Delayed')

  if (highRisk.length > 0) {
    const top = highRisk[0]
    insights.push({
      icon: '🚨', priority: 'high',
      text: `${top.id} (${top.source}→${top.destination}) is critical at risk ${top.riskScore}/100. Express Corridor B recommended — reduces risk by ~22 pts.`,
    })
  }

  if (delayed.length > 0) {
    insights.push({
      icon: '⏱️', priority: 'high',
      text: `${delayed.length} shipment(s) delayed: ${delayed.map(s => s.id).join(', ')}. Aggregate schedule slip: ~${delayed.length * 2} hrs. Activate rerouting.`,
    })
  }

  const overheated = active.filter(s => s.temperatureC !== undefined && s.temperatureC > 30)
  if (overheated.length > 0) {
    insights.push({
      icon: '🌡️', priority: 'medium',
      text: `Temperature alert: ${overheated.map(s => `${s.id} (${s.temperatureC?.toFixed(1)}°C)`).join(', ')} exceeds safe threshold. Verify cargo integrity.`,
    })
  }

  const nearDest = active.filter(s => s.progressPct >= 85 && s.status === 'Near Destination')
  if (nearDest.length > 0) {
    insights.push({
      icon: '🏁', priority: 'low',
      text: `${nearDest.map(s => s.id).join(', ')} approaching destination. Notify receiving teams — ETA: ${nearDest.map(s => fmtEta(s.etaMinutes)).join(', ')}.`,
    })
  }

  if (active.length > 0) {
    const avgRisk = Math.round(active.reduce((a,s) => a + s.riskScore, 0) / active.length)
    const priority = avgRisk >= 70 ? 'high' : avgRisk >= 40 ? 'medium' : 'low'
    const tip = avgRisk < 40
      ? '✓ Fleet risk profile is healthy. Standard monitoring protocols apply.'
      : avgRisk < 70
      ? 'Moderate risk levels detected fleet-wide. Consider increasing check-in frequency to 30-minute intervals.'
      : 'Elevated fleet-wide risk. Consider activating contingency logistics protocols and notifying clients.'
    insights.push({ icon: '📊', priority, text: tip })
  }

  return (
    <GlassCard title="AI Insights" subtitle="Automated fleet intelligence">
      <div className="space-y-2">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-300">
            <span className="text-3xl mb-2">🤖</span>
            <span className="text-sm text-center">All systems nominal — no alerts at this time</span>
          </div>
        ) : (
          insights.map((ins, i) => <Insight key={i} {...ins} />)
        )}
      </div>
    </GlassCard>
  )
}
