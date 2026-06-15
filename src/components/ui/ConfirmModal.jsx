import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from './Button'

export function ConfirmModal({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-sm animate-scale-in">
        <div className="p-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
            {danger
              ? <Trash2 className="h-5 w-5 text-red-500" />
              : <AlertTriangle className="h-5 w-5 text-amber-500" />
            }
          </div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {message && (
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{message}</p>
          )}
        </div>
        <div className="px-6 pb-6 flex justify-end gap-2.5">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={handleConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
