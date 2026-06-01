import { NavLink, useParams } from 'react-router-dom'
import { clsx } from 'clsx'
import { SITES } from '@/lib/sites'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, Image, FileText, Users, Settings,
  LogOut, ChevronDown, Globe,
} from 'lucide-react'
import { useState } from 'react'

const siteNav = [
  { to: 'blog',    label: 'Blog',    icon: FileText, feature: 'blog' },
  { to: 'gallery', label: 'Gallery', icon: Image,    feature: 'gallery' },
  { to: 'pages',   label: 'Pages',   icon: Globe,    feature: 'pages' },
  { to: 'team',    label: 'Team',    icon: Users,    feature: 'team' },
]

function SiteNav({ site }) {
  const [open, setOpen] = useState(false)
  const { siteId } = useParams()
  const active = siteId === site.id

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          active ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100'
        )}
      >
        <span className="text-base leading-none">{site.icon}</span>
        <span className="flex-1 text-left truncate">{site.name}</span>
        <ChevronDown className={clsx('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="ml-6 mt-1 flex flex-col gap-0.5">
          {siteNav
            .filter(n => site.features.includes(n.feature))
            .map(n => (
              <NavLink
                key={n.to}
                to={`/sites/${site.id}/${n.to}`}
                className={({ isActive }) => clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  isActive ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <n.icon className="h-4 w-4" />
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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Apel Admin</p>
            <p className="text-xs text-gray-500">apel.com.ng</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => clsx(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>

        <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Sites
        </p>

        {SITES.map(site => <SiteNav key={site.id} site={site} />)}

        <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Settings
        </p>
        <NavLink
          to="/settings"
          className={({ isActive }) => clsx(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-semibold">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
