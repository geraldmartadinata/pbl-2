import { cn } from '../utils/cn'

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300',
    primary: 'bg-white/10 text-white',
    success: 'bg-emerald-500/10 text-emerald-300',
    warning: 'bg-amber-500/10 text-amber-300',
    danger: 'bg-red-500/10 text-red-300',
    info: 'bg-sky-500/10 text-sky-300',
    zinc: 'bg-zinc-800/80 text-zinc-400',
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
