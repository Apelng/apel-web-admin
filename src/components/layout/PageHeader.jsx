export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between px-8 py-6 border-b border-gray-200 bg-white">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
