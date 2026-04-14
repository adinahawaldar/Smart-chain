import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export function fmtEta(minutes) {
  if (!minutes || minutes >= 9000) return '—'
  if (minutes < 60) return `${Math.round(minutes)}m`
  const h = Math.floor(minutes / 60), m = Math.round(minutes % 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
export const fmtProgress  = pct  => `${Math.min(100, Math.max(0, Math.round(pct || 0)))}%`
export const fmtSpeed     = kmph => kmph ? `${Math.round(kmph)} km/h` : '0 km/h'
export const fmtTemp      = c    => (c === undefined || c === null) ? '—' : `${c.toFixed(1)}°C`
export const fmtTime      = iso  => iso ? dayjs(iso).fromNow() : '—'
export const fmtTimestamp = iso  => iso ? dayjs(iso).format('HH:mm:ss') : '—'
