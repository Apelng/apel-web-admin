import { clsx } from 'clsx'
import { forwardRef } from 'react'

export const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        {...props}
        className={clsx(
          'rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
          'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400',
          className
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ label, error, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        {...props}
        className={clsx(
          'rounded-lg border px-3 py-2 text-sm outline-none transition-colors resize-y',
          'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400',
          className
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
})

export const Select = forwardRef(function Select({ label, error, children, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        ref={ref}
        {...props}
        className={clsx(
          'rounded-lg border px-3 py-2 text-sm outline-none transition-colors bg-white',
          'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          error ? 'border-red-400' : 'border-gray-300 hover:border-gray-400',
          className
        )}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
})
