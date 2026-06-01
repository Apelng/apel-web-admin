import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { SITES } from '@/lib/sites'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, Image, FileText, Users, Settings,
  LogOut, ChevronRight, Globe, ExternalLink,
} from 'lucide-react'
import { useState } from 'react'

const siteNav = [
  { to: 'blog',    label: 'Blog',    icon: FileText, feature: 'blog' },
  { to: 'gallery', label: 'Gallery', icon: Image,    feature: 'gallery' },
  { to: 'pages',   label: 'Pages',   icon: Globe,    feature: 'pages' },
  { to: 'team',    label: 'Team',    icon: Users,    feature: 'team' },
]

function SiteSection({ site }) {
  const { siteId }  = useParams()
  const isActive    = siteId === site.id
  const [open, setOpen] = useState(isActive)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        )}
      >
        <site.Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left truncate">{site.name}</span>
        <ChevronRight className={clsx('h-3.5 w-3.5 transition-transform duration-200 flex-shrink-0', open && 'rotate-90')} />
      </button>

      {open && (
        <div className="mt-0.5 ml-3 pl-3 border-l border-white/10 flex flex-col gap-0.5 py-0.5">
          {siteNav
            .filter(n => site.features.includes(n.feature))
            .map(n => (
              <NavLink
                key={n.to}
                to={`/sites/${site.id}/${n.to}`}
                className={({ isActive }) => clsx(
                  'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                )}
              >
                <n.icon className="h-3.5 w-3.5 flex-shrink-0" />
                {n.label}
              </NavLink>
            ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { logout, user } = useAuth()

  return (
    <aside className="w-[240px] bg-sidebar-bg flex flex-col min-h-screen flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 p-1">
            <img src="https://res.cloudinary.com/dfbyxhi5n/image/upload/v1780271656/favicon_cpxutb.png" alt="Apel" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-none">Apel Admin</p>
            <p className="text-xs text-slate-500 mt-0.5">Content Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => clsx(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
            isActive
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          )}
        >
          <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
          Dashboard
        </NavLink>

        <p className="px-3 pt-5 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          Websites
        </p>

        {SITES.map(site => <SiteSection key={site.id} site={site} />)}

        <div className="mt-auto pt-3">
          <NavLink
            to="/settings"
            className={({ isActive }) => clsx(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            )}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            Settings
          </NavLink>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-bold flex-shrink-0">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">{user?.email}</p>
            <p className="text-[10px] text-slate-600">Administrator</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
