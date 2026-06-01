import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTeam, addTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/firestore'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getSite } from '@/lib/sites'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card, CardBody } from '@/components/ui/Card'
import { Plus, Trash2, Save, Upload } from 'lucide-react'

function MemberCard({ member, siteId, onDelete, onUpdate }) {
  const [data, setData]       = useState({ name: member.name || '', role: member.role || '', bio: member.bio || '', photo: member.photo || '' })
  const [saving, setSaving]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef               = useRef()

  async function uploadPhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const res = await uploadToCloudinary(file, `apel-admin/${siteId}/team`)
    setData(d => ({ ...d, photo: res.secure_url }))
    setUploading(false)
  }

  async function save() {
    setSaving(true)
    await updateTeamMember(siteId, member.id, data)
    onUpdate(member.id, data)
    setSaving(false)
  }

  return (
    <Card>
      <CardBody className="flex gap-4">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div
            className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden cursor-pointer relative group"
            onClick={() => fileRef.current.click()}
          >
            {data.photo ? (
              <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Upload className="h-6 w-6" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
              {uploading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <Upload className="h-5 w-5 text-white" />
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
        </div>

        {/* Fields */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <Input
            label="Full Name"
            value={data.name}
            onChange={e => setData(d => ({ ...d, name: e.target.value }))}
          />
          <Input
            label="Role / Title"
            value={data.role}
            onChange={e => setData(d => ({ ...d, role: e.target.value }))}
          />
          <Textarea
            label="Short Bio"
            rows={2}
            className="col-span-2"
            value={data.bio}
            onChange={e => setData(d => ({ ...d, bio: e.target.value }))}
          />
          <div className="col-span-2 flex justify-end gap-2">
            <Button size="sm" variant="danger" onClick={() => onDelete(member.id)}>
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </Button>
            <Button size="sm" onClick={save} loading={saving}>
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default function Team() {
  const { siteId } = useParams()
  const site        = getSite(siteId)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding]   = useState(false)

  useEffect(() => {
    getTeam(siteId).then(m => { setMembers(m); setLoading(false) })
  }, [siteId])

  async function addMember() {
    setAdding(true)
    const ref = await addTeamMember(siteId, { name: '', role: '', bio: '', photo: '', order: members.length })
    setMembers(m => [...m, { id: ref.id, name: '', role: '', bio: '', photo: '', order: m.length }])
    setAdding(false)
  }

  async function handleDelete(memberId) {
    if (!confirm('Remove this team member?')) return
    await deleteTeamMember(siteId, memberId)
    setMembers(m => m.filter(x => x.id !== memberId))
  }

  function handleUpdate(memberId, data) {
    setMembers(m => m.map(x => x.id === memberId ? { ...x, ...data } : x))
  }

  return (
    <div>
      <PageHeader
        title={`${site?.name} — Team`}
        subtitle={`${members.length} member${members.length !== 1 ? 's' : ''}`}
        actions={
          <Button onClick={addMember} loading={adding}>
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        }
      />

      <div className="px-8 py-6 flex flex-col gap-4 max-w-3xl">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading team…</p>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="font-medium">No team members yet</p>
            <p className="text-sm mt-1">Click "Add Member" to get started</p>
          </div>
        ) : (
          members.map(m => (
            <MemberCard key={m.id} member={m} siteId={siteId} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))
        )}
      </div>
    </div>
  )
}
