import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-white/[2%] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-zinc-700/[3%] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center px-4 animate-fade-in">
        <p className="text-[120px] sm:text-[160px] font-bold text-white leading-none tracking-tight">
          404
        </p>
        <p className="text-sm text-zinc-500 font-mono mb-6">
          Page not found
        </p>
        <p className="text-zinc-400 text-sm mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
