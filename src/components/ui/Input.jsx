import { clsx } from 'clsx'
import { forwardRef } from 'react'

const base = 'w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400'
const normal = 'border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
const errored = 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

export const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>}
      <input
        ref={ref}
        {...props}
        className={clsx(base, error ? errored : normal, className)}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ label, error, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>}
      <textarea
        ref={ref}
        {...props}
        className={clsx(base, 'resize-y', error ? errored : normal, className)}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

export const Select = forwardRef(function Select({ label, error, children, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>}
      <select
        ref={ref}
        {...props}
        className={clsx(base, error ? errored : normal, 'cursor-pointer', className)}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})
