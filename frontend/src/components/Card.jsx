import { cn } from '../utils/cn'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[7%] bg-zinc-900/60 backdrop-blur-xl shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
