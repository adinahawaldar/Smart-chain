import { useState } from 'react'
import { api } from '../api/endpoints'
import toast from 'react-hot-toast'
import { fmtEta } from '../utils/format'
import { getRiskBand } from '../utils/risk'
import clsx from 'clsx'

const ROUTES = [
  {
    id:        'A',
    icon:      '🛣️',
    label:     'Alternate Route A',
    desc:      'Longer inland highway, avoids high-risk zones.',
    etaDelta:  +110,
    costDelta: -6200,
    riskDelta: -15,
  },
  {
    id:        'B',
    icon:      '🚀',
    label:     'Express Corridor B',
    desc:      'Premium toll expressway — fastest available path.',
    etaDelta:  -25,
    costDelta: +18400,
    riskDelta: -22,
  },
]

export default function ReroutingModal({ shipment, onClose, onSuccess }) {
  const [selected, setSelected] = useState('B')
  const [loading,  setLoading]  = useState(false)

  if (!shipment) return null
  const band = getRiskBand(shipment.riskScore)

  async function handleApprove() {
    setLoading(true)
    try {
      await api.reroute(shipment.id, { routeChoice: selected })
      const routeLabel = ROUTES.find(r => r.id === selected)?.label
      toast.success(`${shipment.id} rerouted via ${routeLabel}`)
      onSuccess?.()
      onClose()
    } catch {
      toast.error('Rerouting failed — check backend connection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative glass rounded-2xl p-6 w-full max-w-md shadow-float animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Reroute Shipment</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {shipment.id} · {shipment.source} → {shipment.destination}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Current state */}
        <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200 rounded-xl p-3 mb-5">
          <span className="text-2xl">⚠️</span>
          <div className="text-sm">
            <div className="font-semibold text-slate-700">
              Current Risk:{' '}
              <span className={band.text}>{shipment.riskScore}/100 ({band.label})</span>
            </div>
            <div className="text-slate-500 text-xs mt-0.5">
              ETA: {fmtEta(shipment.etaMinutes)} · Status: {shipment.status}
            </div>
          </div>
        </div>

        {/* Route options */}
        <div className="space-y-3 mb-5">
          {ROUTES.map(route => (
            <label
              key={route.id}
              className={clsx(
                'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all',
                selected === route.id
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 bg-white/50 hover:border-indigo-200'
              )}
            >
              <input
                type="radio"
                name="routeChoice"
                value={route.id}
                checked={selected === route.id}
                onChange={() => setSelected(route.id)}
                className="accent-indigo-600 mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-slate-700 text-sm">
                    {route.icon} {route.label}
                  </span>
                  <span className={clsx('text-xs font-bold', route.costDelta > 0 ? 'text-amber-600' : 'text-emerald-600')}>
                    {route.costDelta > 0 ? '+' : ''}₹{Math.abs(route.costDelta / 100).toFixed(0)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{route.desc}</p>
                <div className="flex gap-4 mt-2 text-xs font-medium">
                  <span className={route.etaDelta < 0 ? 'text-emerald-600' : 'text-amber-600'}>
                    {route.etaDelta < 0 ? '−' : '+'}ETA {Math.abs(route.etaDelta)} min
                  </span>
                  <span className="text-indigo-600">
                    Risk {route.riskDelta > 0 ? '+' : ''}{route.riskDelta} pts
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-ghost justify-center">
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 btn-primary justify-center disabled:opacity-60"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : '✓ Approve Reroute'
            }
          </button>
        </div>
      </div>
    </div>
  )
}
