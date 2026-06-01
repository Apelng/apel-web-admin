import { clsx } from 'clsx'

const colors = {
  published: 'bg-green-100 text-green-700',
  draft:     'bg-yellow-100 text-yellow-700',
  archived:  'bg-gray-100 text-gray-600',
  default:   'bg-blue-100 text-blue-700',
}

export function Badge({ children, variant = 'default', className }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colors[variant] ?? colors.default, className)}>
      {children}
    </span>
  )
}
