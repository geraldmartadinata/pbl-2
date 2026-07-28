export default function Skeleton({ rows = 5, className = '' }) {
  return (
    <div className={`divide-y divide-white/[4%] ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5 animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 bg-zinc-800 rounded" />
            <div className="h-2.5 w-48 bg-zinc-800/60 rounded" />
          </div>
          <div className="h-3 w-20 bg-zinc-800 rounded hidden sm:block" />
          <div className="h-3 w-16 bg-zinc-800 rounded hidden md:block" />
          <div className="h-7 w-24 bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  )
}