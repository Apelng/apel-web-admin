import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { clsx } from 'clsx'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), [])

  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={clsx(
              'flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl text-sm font-medium pointer-events-auto animate-slide-up',
              'shadow-modal border',
              toast.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-slate-900 text-white border-slate-800'
            )}
          >
            {toast.type === 'error'
              ? <XCircle className="h-4 w-4 flex-shrink-0 text-red-200" />
              : <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            }
            <span>{toast.message}</span>
            <button
              onClick={() => remove(toast.id)}
              className="ml-1 p-0.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
