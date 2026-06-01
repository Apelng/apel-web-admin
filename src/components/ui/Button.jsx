import { clsx } from 'clsx'

const variants = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
  danger:    'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  ghost:     'text-slate-600 hover:bg-slate-100',
  soft:      'bg-brand-50 text-brand-700 hover:bg-brand-100',
}

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-sm rounded-xl gap-2',
}

export function Button({ children, variant = 'primary', size = 'md', className, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        'inline-flex items-center font-medium transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        sizes[size],
        variants[variant],
        className
      )}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
