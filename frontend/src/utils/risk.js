export function getRiskBand(score) {
  if (score >= 75) return { label:'High',   color:'#EF4444', bg:'bg-red-100',    text:'text-red-700',    border:'border-red-200'    }
  if (score >= 40) return { label:'Medium', color:'#F59E0B', bg:'bg-amber-100',  text:'text-amber-700',  border:'border-amber-200'  }
  return                   { label:'Low',   color:'#6366F1', bg:'bg-indigo-100', text:'text-indigo-700', border:'border-indigo-200' }
}
export const getRiskPolylineColor = score => score >= 75 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#6366F1'
export function getSeverityStyle(severity) {
  const map = {
    danger:  { bg:'bg-red-50',     border:'border-red-200',     text:'text-red-700',     dot:'bg-red-500'     },
    warning: { bg:'bg-amber-50',   border:'border-amber-200',   text:'text-amber-700',   dot:'bg-amber-500'   },
    success: { bg:'bg-emerald-50', border:'border-emerald-200', text:'text-emerald-700', dot:'bg-emerald-500' },
    info:    { bg:'bg-blue-50',    border:'border-blue-200',    text:'text-blue-700',    dot:'bg-blue-400'    },
  }
  return map[severity] || map.info
}
