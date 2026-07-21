import { useToast } from '../contexts/ToastContext'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (!toasts.length) return null

  const typeStyles = {
    success: 'bg-green-600',
    error: 'bg-coral-500',
    info: 'bg-himti-600',
    warning: 'bg-yellow-500 text-yellow-900',
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${typeStyles[t.type] || typeStyles.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 animate-slide-in`}
        >
          <p className="text-sm">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="text-white/70 hover:text-white shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
