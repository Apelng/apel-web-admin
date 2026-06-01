import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { SITES } from '@/lib/sites'
import { ExternalLink } from 'lucide-react'

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Admin configuration" />
      <div className="px-8 py-6 max-w-2xl flex flex-col gap-5">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">Managed Sites</h2>
          </CardHeader>
          <CardBody>
            <div className="divide-y divide-gray-100">
              {SITES.map(site => (
                <div key={site.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="text-xl">{site.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{site.name}</p>
                    <p className="text-xs text-gray-400">{site.domain}</p>
                  </div>
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">Setup Instructions</h2>
          </CardHeader>
          <CardBody className="text-sm text-gray-600 flex flex-col gap-3">
            <p>To connect a website to this admin panel, add this snippet before the closing <code className="bg-gray-100 px-1 rounded">&lt;/body&gt;</code> tag in the site's HTML pages:</p>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs overflow-auto whitespace-pre-wrap">{`<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
  import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

  const app = initializeApp({ /* your firebase config */ });
  const db  = getFirestore(app);
  // e.g. read gallery:
  const snap = await getDocs(query(collection(db, "sites", "SITE_ID", "gallery"), orderBy("order")));
  snap.forEach(doc => console.log(doc.data()));
</script>`}</pre>
            <p>Replace <code className="bg-gray-100 px-1 rounded">SITE_ID</code> with one of: <code className="bg-gray-100 px-1 rounded">apel-group</code>, <code className="bg-gray-100 px-1 rounded">wealth</code>, <code className="bg-gray-100 px-1 rounded">registrars</code>, <code className="bg-gray-100 px-1 rounded">asset</code>, <code className="bg-gray-100 px-1 rounded">trust</code>.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
