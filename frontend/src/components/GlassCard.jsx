import clsx from 'clsx'

export default function GlassCard({ children, className = '', title, subtitle, action }) {
  return (
    <div className={clsx('glass rounded-2xl overflow-hidden', className)}>
      {(title || action) && (
        <div className="flex items-start justify-between px-5 pt-4 pb-2">
          <div>
            {title    && <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="ml-4 shrink-0">{action}</div>}
        </div>
      )}
      <div className={clsx('px-5 pb-5', title || action ? 'pt-1' : 'pt-5')}>
        {children}
      </div>
    </div>
  )
}
