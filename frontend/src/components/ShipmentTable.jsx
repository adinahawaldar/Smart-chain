import React, { useState } from 'react'
import clsx from 'clsx'
import { getRiskBand } from '../utils/risk'
import { fmtEta, fmtProgress, fmtSpeed } from '../utils/format'
import { Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const STATUS_PILL = {
  'In Transit':       'bg-blue-100 text-blue-700 border-blue-200',
  'Near Destination': 'bg-teal-100 text-teal-700 border-teal-200',
  'Delayed':          'bg-red-100 text-red-700 border-red-200',
  'At Hub':           'bg-slate-100 text-slate-600 border-slate-200',
  'Delivered':        'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const FILTERS = ['all', 'In Transit', 'Near Destination', 'Delayed', 'At Hub', 'Delivered']

export default function ShipmentTable({ shipments, onReroute }) {
  const [sortCol, setSortCol]     = useState('riskScore')
  const [sortDir, setSortDir]     = useState('desc')
  const [filter,  setFilter]      = useState('all')
  const navigate = useNavigate()

  function toggleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const rows = [...shipments]
    .filter(s => filter === 'all' || s.status === filter)
    .sort((a, b) => {
      const va = a[sortCol], vb = b[sortCol]
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : (va || 0) - (vb || 0)
      return sortDir === 'asc' ? cmp : -cmp
    })

  function SortTh({ col, label }) {
    const active = sortCol === col
    return (
      <th
        className="pb-3 pr-4 cursor-pointer select-none hover:text-indigo-600 transition-colors"
        onClick={() => toggleSort(col)}
      >
        <span className="flex items-center gap-1">
          {label}
          <span className="text-slate-300 text-xs">
            {active ? (sortDir === 'asc' ? '↑' : '↓') : '⇅'}
          </span>
        </span>
      </th>
    )
  }

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'text-xs px-3 py-1 rounded-full border font-medium transition-all',
              filter === f
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white/60 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            )}
          >
            {f === 'all' ? 'All' : f}
            {f !== 'all' && (
              <span className="ml-1 opacity-60">
                {shipments.filter(s => s.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[700px]">
          <thead>
            <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200/60">
              <SortTh col="id"         label="ID"       />
              <th className="pb-3 pr-4">Route</th>
              <SortTh col="status"     label="Status"   />
              <SortTh col="riskScore"  label="Risk"     />
              <SortTh col="etaMinutes" label="ETA"      />
              <SortTh col="progressPct" label="Progress"/>
              <th className="pb-3 pr-4">Speed</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(s => {
              const band      = getRiskBand(s.riskScore)
              const effSpeed  = (s.speedKmph || 0) * (s.speedFactor || 1)
              const canReroute= s.riskScore >= 70 && s.active
              return (
                <tr
                  key={s.id}
                  className="border-b border-slate-100/60 hover:bg-white/50 transition-colors"
                >
                  {/* ID */}
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-slate-800">{s.id}</div>
                    <div className="text-[11px] text-slate-400">{s.vehicleId}</div>
                  </td>

                  {/* Route */}
                  <td className="py-3 pr-4">
                    <div className="text-slate-700 font-medium text-xs">{s.source}</div>
                    <div className="text-[11px] text-slate-400">→ {s.destination}</div>
                  </td>

                  {/* Status */}
                  <td className="py-3 pr-4">
                    <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full border', STATUS_PILL[s.status])}>
                      {s.status}
                    </span>
                  </td>

                  {/* Risk */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${s.riskScore}%`, background: band.color }}
                        />
                      </div>
                      <span className={clsx('text-xs font-bold px-1.5 py-0.5 rounded-md', band.bg, band.text)}>
                        {s.riskScore}
                      </span>
                    </div>
                  </td>

                  {/* ETA */}
                  <td className="py-3 pr-4 font-medium text-slate-700 text-xs">{fmtEta(s.etaMinutes)}</td>

                  {/* Progress */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, s.progressPct || 0)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{fmtProgress(s.progressPct)}</span>
                    </div>
                  </td>

                  {/* Speed */}
                  <td className="py-3 pr-4 text-xs text-slate-600">{fmtSpeed(effSpeed)}</td>

                  {/* Action */}
                  <td className="py-3">
                    {canReroute ? (
                      <button
                        onClick={() => navigate(`/shipment/${s.id}`)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                      >
                        <Zap size={12} />
                        Reroute
                      </button>
                    ) : s.status === 'Delivered' ? (
                      <span className="text-xs text-emerald-500 font-medium">✓ Done</span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              )
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400 text-sm">
                  No shipments match this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
