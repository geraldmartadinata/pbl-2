import { createContext, useContext, useState, useCallback } from 'react'
import { cn } from '../utils/cn'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-slide-in backdrop-blur-xl',
              t.type === 'success'
                ? 'bg-emerald-900/80 border-emerald-700/50 text-emerald-100'
                : 'bg-red-900/80 border-red-700/50 text-red-100'
            )}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <p className="text-sm flex-1">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be within ToastProvider')
  return {
    success: (msg) => ctx.add(msg, 'success'),
    error: (msg) => ctx.add(msg, 'error'),
  }
}
