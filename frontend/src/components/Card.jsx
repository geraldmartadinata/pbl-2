import { cn } from '../utils/cn'

export default function Card({ children, className, glass = true, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800/80',
        glass && 'bg-slate-900/60 backdrop-blur-xl',
        !glass && 'bg-slate-900',
        'shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
