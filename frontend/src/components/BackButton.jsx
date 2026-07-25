import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function BackButton({ to = '/', label = 'Back' }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  )
}
