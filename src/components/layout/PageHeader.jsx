export function PageHeader({ title, subtitle, actions, tabs }) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="px-8 py-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900 leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
      {tabs && <div className="px-8">{tabs}</div>}
    </div>
  )
}
