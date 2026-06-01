import { clsx } from 'clsx'

export function Card({ children, className, ...props }) {
  return (
    <div {...props} className={clsx('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }) {
  return <div className={clsx('px-6 py-5', className)}>{children}</div>
}
