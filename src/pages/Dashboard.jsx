import { useNavigate } from 'react-router-dom'
import { SITES } from '@/lib/sites'
import { FileText, Image, Globe, Users, ExternalLink, ArrowRight, Layers } from 'lucide-react'

const features = [
  { key: 'blog',    label: 'Blog',    icon: FileText, bg: 'bg-violet-50',  text: 'text-violet-600' },
  { key: 'gallery', label: 'Gallery', icon: Image,    bg: 'bg-sky-50',     text: 'text-sky-600' },
  { key: 'pages',   label: 'Pages',   icon: Globe,    bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { key: 'team',    label: 'Team',    icon: Users,    bg: 'bg-orange-50',  text: 'text-orange-600' },
]


function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-5 py-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate      = useNavigate()
  const totalFeatures = SITES.reduce((acc, s) => acc + s.features.length, 0)

  return (
    <div>
      {/* Page header */}
      <div className="px-8 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage content across all Apel websites</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
            <Layers className="h-3.5 w-3.5" />
            Managing <span className="font-semibold text-slate-700 mx-1">{SITES.length} websites</span>
          </div>
        </div>
      </div>

      <div className="px-8 py-7 flex flex-col gap-8">
        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Websites"  value={SITES.length}    icon={Globe}    color="bg-brand-50 text-brand-600"   />
          <StatCard label="Sections"  value={totalFeatures}   icon={Layers}   color="bg-violet-50 text-violet-600" />
          <StatCard label="With Blog" value={SITES.filter(s => s.features.includes('blog')).length}    icon={FileText} color="bg-sky-50 text-sky-600"       />
          <StatCard label="With Gallery" value={SITES.filter(s => s.features.includes('gallery')).length} icon={Image} color="bg-emerald-50 text-emerald-600" />
        </div>

        {/* Sites grid */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Your Websites</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SITES.map(site => (
                <div key={site.id} className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-md transition-shadow group">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${site.iconBg} ${site.iconText} flex items-center justify-center flex-shrink-0`}>
                          <site.Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h2 className="font-semibold text-slate-900 text-sm leading-tight">{site.name}</h2>
                          <p className="text-xs text-slate-400 mt-0.5">{site.domain}</p>
                        </div>
                      </div>
                      <a
                        href={`https://${site.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                        title="Visit site"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {features
                        .filter(f => site.features.includes(f.key))
                        .map(f => (
                          <button
                            key={f.key}
                            onClick={() => navigate(`/sites/${site.id}/${f.key}`)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left group/btn border border-transparent hover:border-slate-100"
                          >
                            <span className={`w-6 h-6 rounded-lg ${f.bg} ${f.text} flex items-center justify-center flex-shrink-0`}>
                              <f.icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-xs font-medium text-slate-600 group-hover/btn:text-slate-900">{f.label}</span>
                            <ArrowRight className="h-3 w-3 text-slate-300 ml-auto opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
