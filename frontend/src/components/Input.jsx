import { cn } from '../utils/cn'

export default function Input({
  label,
  name,
  error,
  className,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={cn(
          'block w-full rounded-xl border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 shadow-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20',
          error
            ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/20'
            : 'border-zinc-700/60 hover:border-zinc-600',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
