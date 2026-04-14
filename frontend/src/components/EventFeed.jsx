import clsx from 'clsx'
import { getSeverityStyle } from '../utils/risk'
import { fmtTime } from '../utils/format'
import GlassCard from './GlassCard'

const TYPE_ICONS = {
  geofence:   '📍',
  risk:       '⚠️',
  delay:      '🕐',
  reroute:    '🔀',
  delivered:  '✅',
  status:     'ℹ️',
  simulation: '⚡',
  csv:        '📂',
}

export default function EventFeed({ events }) {
  const displayEvents = (events || []).slice(0, 25)

  return (
    <GlassCard title="Event Feed" subtitle="Live operational events">
      <div className="space-y-2 max-h-[370px] overflow-y-auto pr-0.5">
        {displayEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-300">
            <span className="text-3xl mb-2">📡</span>
            <span className="text-sm">Awaiting events...</span>
          </div>
        )}

        {displayEvents.map((ev, i) => {
          const style = getSeverityStyle(ev.severity)
          return (
            <div
              key={`${ev.timestamp}-${i}`}
              className={clsx(
                'flex items-start gap-2.5 p-2.5 rounded-xl border text-xs transition-all animate-fade-in',
                style.bg, style.border
              )}
            >
              <span className="text-sm mt-0.5 shrink-0">
                {TYPE_ICONS[ev.type] || 'ℹ️'}
              </span>
              <div className="flex-1 min-w-0">
                <p className={clsx('font-medium leading-snug break-words', style.text)}>
                  {ev.message}
                </p>
                {ev.shipmentId && (
                  <span className="text-slate-400 mt-0.5 block text-[11px]">
                    {ev.shipmentId}
                  </span>
                )}
              </div>
              <span className="text-slate-400 shrink-0 whitespace-nowrap text-[11px]">
                {fmtTime(ev.timestamp)}
              </span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
