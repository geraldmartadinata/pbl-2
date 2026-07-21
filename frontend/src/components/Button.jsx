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
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-white text-zinc-900 hover:bg-zinc-100 shadow-lg shadow-white/10 hover:shadow-white/20 active:scale-[0.97]',
    secondary:
      'bg-zinc-800/60 text-zinc-100 border border-white/10 hover:bg-zinc-700/60 hover:border-white/20 active:scale-[0.97]',
    ghost:
      'text-zinc-400 hover:text-white hover:bg-white/5',
    danger:
      'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20 active:scale-[0.97]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2',
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
