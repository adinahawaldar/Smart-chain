function Skel({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200/70 rounded-xl ${className}`} />
}

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen p-5 space-y-4">
      <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between mb-4">
        <Skel className="h-7 w-40" />
        <Skel className="h-7 w-28" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => <Skel key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skel className="lg:col-span-2 h-[460px]" />
        <Skel className="h-[460px]" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Skel className="xl:col-span-3 h-64" />
        <div className="xl:col-span-2 space-y-4">
          <Skel className="h-44" />
          <Skel className="h-36" />
        </div>
      </div>
    </div>
  )
}
