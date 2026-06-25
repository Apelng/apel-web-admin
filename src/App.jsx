import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import Login      from '@/pages/Login'
import Dashboard  from '@/pages/Dashboard'
import Settings   from '@/pages/Settings'
import BlogList   from '@/pages/sites/BlogList'
import BlogEditor from '@/pages/sites/BlogEditor'
import Gallery    from '@/pages/sites/Gallery'
import Pages      from '@/pages/sites/Pages'
import Team       from '@/pages/sites/Team'
import Popups     from '@/pages/sites/Popups'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <RequireAuth>
          <AppLayout />
        </RequireAuth>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings"  element={<Settings />} />

        <Route path="sites/:siteId">
          <Route path="blog"              element={<BlogList />} />
          <Route path="blog/new"          element={<BlogEditor />} />
          <Route path="blog/:postId/edit" element={<BlogEditor />} />
          <Route path="gallery"           element={<Gallery />} />
          <Route path="pages"             element={<Pages />} />
          <Route path="team"              element={<Team />} />
          <Route path="popups"            element={<Popups />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
