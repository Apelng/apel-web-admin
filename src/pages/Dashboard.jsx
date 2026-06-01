import { useNavigate } from 'react-router-dom'
import { SITES } from '@/lib/sites'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { FileText, Image, Globe, Users, ArrowRight } from 'lucide-react'

const features = [
  { key: 'blog',    label: 'Blog',    icon: FileText, color: 'text-blue-600 bg-blue-50' },
  { key: 'gallery', label: 'Gallery', icon: Image,    color: 'text-purple-600 bg-purple-50' },
  { key: 'pages',   label: 'Pages',   icon: Globe,    color: 'text-green-600 bg-green-50' },
  { key: 'team',    label: 'Team',    icon: Users,    color: 'text-orange-600 bg-orange-50' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Manage content across all Apel websites"
      />

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {SITES.map(site => (
            <Card key={site.id} className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{site.icon}</span>
                    <div>
                      <h2 className="font-semibold text-gray-900">{site.name}</h2>
                      <p className="text-xs text-gray-400">{site.domain}</p>
                    </div>
                  </div>
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-600 hover:underline flex items-center gap-1"
                  >
                    Visit <ArrowRight className="h-3 w-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {features
                    .filter(f => site.features.includes(f.key))
                    .map(f => (
                      <button
                        key={f.key}
                        onClick={() => navigate(`/sites/${site.id}/${f.key}`)}
                        className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                      >
                        <span className={`p-1.5 rounded-md ${f.color}`}>
                          <f.icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{f.label}</span>
                      </button>
                    ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
