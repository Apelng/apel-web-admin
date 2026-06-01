import { clsx } from 'clsx'

const variants = {
  published: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  draft:     'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  archived:  'bg-slate-100 text-slate-500 ring-1 ring-slate-600/10',
  default:   'bg-brand-50 text-brand-700 ring-1 ring-brand-600/20',
}

export function Badge({ children, variant = 'default', className }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
      variants[variant] ?? variants.default,
      className
    )}>
      {children}
    </span>
  )
}
