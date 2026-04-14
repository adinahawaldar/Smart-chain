import { useState } from 'react'
import useSimulation from '../hooks/useSimulation'
import GlassCard from './GlassCard'
import clsx from 'clsx'

const DISRUPTIONS = [
  {
    value:   'storm',
    label:   '🌩️ Storm',
    desc:    'Cyclonic weather — ~55% speed reduction, +35 risk',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    value:   'traffic',
    label:   '🚦 Traffic',
    desc:    'Urban congestion — ~28% speed reduction, +15 risk',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    value:   'strike',
    label:   '⚡ Strike',
    desc:    'Labour action — ~75% speed reduction, +40 risk',
    badgeColor: 'bg-red-100 text-red-700',
  },
]

export default function SimulationPanel({ onSimulated }) {
  const [disruption, setDisruption] = useState('storm')
  const { runSimulation, loading, lastResult } = useSimulation()

  async function handleRun() {
    const result = await runSimulation(disruption)
    if (result) onSimulated?.(result)
  }

  return (
    <GlassCard title="Simulation Engine" subtitle="Model disruption scenarios in real-time">
      <div className="space-y-2.5">
        {/* Radio options */}
        <div className="space-y-2">
          {DISRUPTIONS.map(d => (
            <label
              key={d.value}
              className={clsx(
                'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                disruption === d.value
                  ? 'border-indigo-400 bg-indigo-50/80'
                  : 'border-slate-200 bg-white/40 hover:border-indigo-200 hover:bg-white/60'
              )}
            >
              <input
                type="radio"
                name="disruption"
                value={d.value}
                checked={disruption === d.value}
                onChange={e => setDisruption(e.target.value)}
                className="accent-indigo-600"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-700">{d.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{d.desc}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={loading}
          className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running simulation...
            </>
          ) : (
            <>⚡ Run Simulation</>
          )}
        </button>

        {/* Last result */}
        {lastResult && (
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3 text-xs animate-fade-in">
            <div className="font-semibold text-indigo-700 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              Last Simulation Result
            </div>
            <p className="text-slate-600 leading-relaxed mb-2">{lastResult.insight}</p>
            <div className="flex gap-4 text-indigo-600 font-semibold">
              <span>Speed ×{lastResult.speedFactor?.toFixed(2)}</span>
              <span>{lastResult.affectedCount} affected</span>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
