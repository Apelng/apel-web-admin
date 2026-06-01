import { clsx } from 'clsx'

export function Card({ children, className, ...props }) {
  return (
    <div
      {...props}
      className={clsx('bg-white rounded-2xl border border-slate-100 shadow-card', className)}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('px-6 py-4 border-b border-slate-100', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }) {
  return <div className={clsx('px-6 py-5', className)}>{children}</div>
}
