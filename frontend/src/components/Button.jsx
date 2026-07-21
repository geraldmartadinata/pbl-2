import { cn } from '../utils/cn'
import { Loader2 } from 'lucide-react'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  disabled,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20',
    secondary:
      'bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700/80',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/60',
    danger:
      'bg-red-600/90 text-white hover:bg-red-500 shadow-lg shadow-red-600/20',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  return (
    <button
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
