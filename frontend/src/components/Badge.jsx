import { cn } from '../utils/cn'

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-800 text-slate-300',
    primary: 'bg-blue-500/15 text-blue-400',
    success: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-amber-500/15 text-amber-400',
    danger: 'bg-red-500/15 text-red-400',
    info: 'bg-cyan-500/15 text-cyan-400',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
