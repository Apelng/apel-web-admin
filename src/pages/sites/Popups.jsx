import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPopups, addPopup, updatePopup, deletePopup, setActivePopup } from '@/lib/firestore'
import { getSite } from '@/lib/sites'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { clsx } from 'clsx'
import { Plus, Pencil, Trash2, X, Check, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react'

// ─── Add / Edit modal ─────────────────────────────────────────────────────────

function PopupModal({ popup, onClose, onSaved }) {
  const [form, setForm] = useState({
    title:    popup?.title    ?? '',
    imageUrl: popup?.imageUrl ?? '',
    linkUrl:  popup?.linkUrl  ?? '',
    delay:    popup?.delay    ?? 1,
    active:   popup?.active   ?? false,
  })
  const [saving, setSaving] = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function save() {
    if (!form.imageUrl.trim()) return
    setSaving(true)
    await onSaved(form)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-modal w-full max-w-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">{popup ? 'Edit popup' : 'New popup'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Title <span className="text-slate-300 font-normal normal-case">(internal label)</span>
            </label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Mutual Fund Promo"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Image URL <span className="text-red-400">*</span>
            </label>
            <input
              value={form.imageUrl}
              onChange={e => set('imageUrl', e.target.value)}
              placeholder="https://res.cloudinary.com/…"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            {form.imageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex items-center justify-center">
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="max-h-40 object-contain"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Click destination URL
            </label>
            <input
              value={form.linkUrl}
              onChange={e => set('linkUrl', e.target.value)}
              placeholder="https://mutualfund.apel.com.ng"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Delay + Active row */}
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Show after (seconds)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={form.delay}
                onChange={e => set('delay', Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Active
              </label>
              <button
                type="button"
                onClick={() => set('active', !form.active)}
                className={clsx(
                  'w-full flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all',
                  form.active
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-500'
                )}
              >
                {form.active
                  ? <><ToggleRight className="h-4 w-4 text-emerald-500" /> Live on site</>
                  : <><ToggleLeft  className="h-4 w-4 text-slate-400" />  Inactive</>
                }
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-5 flex justify-end gap-2.5 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={save} loading={saving} disabled={!form.imageUrl.trim()}>
            <Check className="h-4 w-4" /> {popup ? 'Save changes' : 'Create popup'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Popup card ───────────────────────────────────────────────────────────────

function PopupCard({ popup, siteId, onEdit, onDelete, onToggleActive }) {
  const [toggling, setToggling] = useState(false)

  async function toggle() {
    setToggling(true)
    await onToggleActive(popup.id, !popup.active)
    setToggling(false)
  }

  return (
    <div className={clsx(
      'bg-white rounded-2xl border overflow-hidden shadow-card transition-all',
      popup.active ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-slate-100'
    )}>
      {/* Image */}
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        {popup.imageUrl ? (
          <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No image</div>
        )}
        {popup.active && (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Live
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="font-semibold text-slate-800 text-sm truncate">{popup.title || 'Untitled popup'}</p>

        {popup.linkUrl && (
          <a
            href={popup.linkUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 mt-1 truncate"
          >
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
            {popup.linkUrl}
          </a>
        )}

        <p className="text-xs text-slate-400 mt-1">Shows after {popup.delay ?? 1}s</p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={toggle}
            disabled={toggling}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all border',
              popup.active
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            )}
          >
            {toggling
              ? <span className="animate-pulse">…</span>
              : popup.active
                ? <><ToggleRight className="h-3.5 w-3.5" /> Active</>
                : <><ToggleLeft  className="h-3.5 w-3.5" /> Inactive</>
            }
          </button>
          <button
            onClick={() => onEdit(popup)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(popup)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Popups() {
  const { siteId }                        = useParams()
  const site                              = getSite(siteId)
  const [popups, setPopups]               = useState([])
  const [loading, setLoading]             = useState(true)
  const [modal, setModal]                 = useState(null)   // null | 'new' | popup object
  const [confirmModal, setConfirmModal]   = useState(null)
  const toast                             = useToast()

  async function load() {
    setLoading(true)
    setPopups(await getPopups(siteId))
    setLoading(false)
  }

  useEffect(() => { load() }, [siteId])

  async function handleSave(form) {
    if (modal && modal.id) {
      await updatePopup(siteId, modal.id, form)
      toast('Popup updated')
    } else {
      await addPopup(siteId, form)
      toast('Popup created')
    }
    await load()
    setModal(null)
  }

  async function handleToggleActive(popupId, newActive) {
    if (newActive) {
      // deactivate all others, activate this one
      await setActivePopup(siteId, popupId)
      toast('Popup set as active — it will now show on the website')
    } else {
      await updatePopup(siteId, popupId, { active: false })
      toast('Popup deactivated')
    }
    await load()
  }

  function handleDelete(popup) {
    setConfirmModal({
      title: 'Delete popup',
      message: `"${popup.title || 'This popup'}" will be permanently deleted.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        await deletePopup(siteId, popup.id)
        setPopups(p => p.filter(x => x.id !== popup.id))
        setConfirmModal(null)
        toast('Popup deleted')
      },
    })
  }

  const activeCount = popups.filter(p => p.active).length

  return (
    <div>
      <PageHeader
        title={`${site?.name} — Popups`}
        subtitle={`${popups.length} popup${popups.length !== 1 ? 's' : ''}${activeCount ? ' · 1 live' : ' · none active'}`}
        actions={
          <Button onClick={() => setModal('new')}>
            <Plus className="h-4 w-4" /> New Popup
          </Button>
        }
      />

      <div className="px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="aspect-video rounded-2xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : popups.length === 0 ? (
          <button
            onClick={() => setModal('new')}
            className="w-full max-w-sm flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-slate-200 p-16 hover:border-brand-400 hover:bg-brand-50/30 transition-all text-center group"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
              <Plus className="h-7 w-7 text-slate-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-slate-600">No popups yet</p>
              <p className="text-sm text-slate-400 mt-1">Create your first popup</p>
            </div>
          </button>
        ) : (
          <>
            {activeCount === 0 && (
              <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
                <ToggleLeft className="h-4 w-4 flex-shrink-0" />
                No popup is currently active — toggle one to make it live on the website.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popups.map(p => (
                <PopupCard
                  key={p.id}
                  popup={p}
                  siteId={siteId}
                  onEdit={setModal}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {modal && (
        <PopupModal
          popup={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSave}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          danger={confirmModal.danger}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  )
}
