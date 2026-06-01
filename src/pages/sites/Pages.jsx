import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPages, savePage } from '@/lib/firestore'
import { getSite } from '@/lib/sites'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Save, ChevronDown, ChevronUp } from 'lucide-react'

const PAGE_TEMPLATES = {
  home: [
    { key: 'hero_title',    label: 'Hero Title',    type: 'input' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
    { key: 'hero_cta',      label: 'Hero Button Text', type: 'input' },
    { key: 'about_title',   label: 'About Section Title', type: 'input' },
    { key: 'about_body',    label: 'About Section Body', type: 'textarea' },
  ],
  about: [
    { key: 'title',     label: 'Page Title',   type: 'input' },
    { key: 'body',      label: 'Main Content', type: 'textarea' },
    { key: 'mission',   label: 'Mission',      type: 'textarea' },
    { key: 'vision',    label: 'Vision',       type: 'textarea' },
  ],
  contact: [
    { key: 'address',   label: 'Office Address', type: 'textarea' },
    { key: 'phone',     label: 'Phone Number',   type: 'input' },
    { key: 'email',     label: 'Email Address',  type: 'input' },
    { key: 'map_embed', label: 'Google Maps Embed URL', type: 'input' },
  ],
  services: [
    { key: 'title', label: 'Section Title', type: 'input' },
    { key: 'intro', label: 'Introduction',  type: 'textarea' },
  ],
}

function PageSection({ pageId, fields, data, siteId, onSaved }) {
  const [values, setValues] = useState(
    Object.fromEntries(fields.map(f => [f.key, data?.[f.key] || '']))
  )
  const [saving, setSaving] = useState(false)
  const [open, setOpen]     = useState(false)

  async function save() {
    setSaving(true)
    await savePage(siteId, pageId, values)
    onSaved(pageId, values)
    setSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between"
        >
          <span className="font-medium text-gray-800 capitalize">{pageId} page</span>
          {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
      </CardHeader>
      {open && (
        <CardBody className="flex flex-col gap-4">
          {fields.map(f => (
            f.type === 'textarea' ? (
              <Textarea
                key={f.key}
                label={f.label}
                rows={4}
                value={values[f.key]}
                onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
              />
            ) : (
              <Input
                key={f.key}
                label={f.label}
                value={values[f.key]}
                onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
              />
            )
          ))}
          <div className="flex justify-end">
            <Button size="sm" onClick={save} loading={saving}>
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
        </CardBody>
      )}
    </Card>
  )
}

export default function Pages() {
  const { siteId } = useParams()
  const site        = getSite(siteId)
  const [pagesData, setPagesData] = useState({})

  useEffect(() => {
    getPages(siteId).then(pages => {
      const map = {}
      pages.forEach(p => { map[p.id] = p })
      setPagesData(map)
    })
  }, [siteId])

  function handleSaved(pageId, values) {
    setPagesData(d => ({ ...d, [pageId]: { ...d[pageId], ...values } }))
  }

  return (
    <div>
      <PageHeader
        title={`${site?.name} — Pages`}
        subtitle="Edit text content for each page"
      />

      <div className="px-8 py-6 flex flex-col gap-4 max-w-3xl">
        {Object.entries(PAGE_TEMPLATES).map(([pageId, fields]) => (
          <PageSection
            key={pageId}
            pageId={pageId}
            fields={fields}
            data={pagesData[pageId]}
            siteId={siteId}
            onSaved={handleSaved}
          />
        ))}
      </div>
    </div>
  )
}
