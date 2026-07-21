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
        <label htmlFor={name} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={cn(
          'block w-full rounded-lg border bg-slate-900/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
          error
            ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/40'
            : 'border-slate-700/60 hover:border-slate-600',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
