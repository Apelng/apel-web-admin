import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  getGallery, addGalleryImage, deleteGalleryImage,
  deleteGalleryImages, updateGalleryImage, renameCategoryImages,
} from '@/lib/firestore'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getSite } from '@/lib/sites'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { clsx } from 'clsx'
import {
  Upload, Trash2, Pencil, X, Check, FolderPlus,
  CheckSquare, Square, Layers, Image as ImageIcon,
} from 'lucide-react'

// ─── Category tabs bar ────────────────────────────────────────────────────────

function CategoryBar({ categories, active, onSelect, onRename }) {
  const [editing, setEditing]   = useState(null)   // category name being renamed
  const [draft, setDraft]       = useState('')
  const inputRef                = useRef()

  function startEdit(e, cat) {
    e.stopPropagation()
    setEditing(cat)
    setDraft(cat)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  async function commitRename() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== editing) await onRename(editing, trimmed)
    setEditing(null)
  }

  function keyDown(e) {
    if (e.key === 'Enter')  commitRename()
    if (e.key === 'Escape') setEditing(null)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-8 py-3 border-b border-slate-200 bg-white">
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
          active === null
            ? 'bg-brand-600 text-white shadow-sm'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
        )}
      >
        All images
      </button>

      {categories.map(cat => (
        <div key={cat} className="group flex items-center gap-1">
          {editing === cat ? (
            <div className="flex items-center gap-1 bg-white border border-brand-500 rounded-xl px-2 py-1 shadow-sm">
              <input
                ref={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={keyDown}
                className="text-xs font-semibold outline-none w-28 text-slate-800"
              />
              <button onClick={commitRename} className="text-emerald-600 hover:text-emerald-700">
                <Check className="h-3 w-3" />
              </button>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onSelect(cat)}
              className={clsx(
                'flex items-center gap-1.5 pl-3.5 pr-2 py-1.5 rounded-xl text-xs font-semibold transition-all',
                active === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              )}
            >
              {cat}
              <span
                onClick={e => startEdit(e, cat)}
                title="Rename"
                className={clsx(
                  'p-0.5 rounded-md transition-all',
                  active === cat
                    ? 'opacity-60 hover:opacity-100 hover:bg-white/20'
                    : 'opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-slate-300'
                )}
              >
                <Pencil className="h-2.5 w-2.5" />
              </span>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Individual image card ─────────────────────────────────────────────────────

function ImageCard({ image, siteId, selected, selectMode, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing]         = useState(false)
  const [description, setDescription] = useState(image.description || '')
  const [saving, setSaving]           = useState(false)
  const toast                         = useToast()

  async function saveDescription() {
    setSaving(true)
    await updateGalleryImage(siteId, image.id, { description })
    onUpdate(image.id, { description })
    setSaving(false)
    setEditing(false)
    toast('Description saved')
  }

  function handleCardClick() {
    if (selectMode) onToggle(image.id)
  }

  return (
    <div
      data-image-id={image.id}
      onClick={handleCardClick}
      className={clsx(
        'group relative bg-white rounded-2xl border overflow-hidden transition-all duration-150',
        selectMode ? 'cursor-pointer' : '',
        selected
          ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-md'
          : 'border-slate-100 shadow-card hover:shadow-md hover:border-slate-200'
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={image.url}
          alt={image.category || image.year || ''}
          className={clsx('w-full h-full object-cover transition-transform duration-300', !selectMode && 'group-hover:scale-105')}
        />

        {/* Select checkbox */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(image.id) }}
          className={clsx(
            'absolute top-2 left-2 transition-all duration-150',
            selected || selectMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          {selected
            ? <CheckSquare className="h-5 w-5 text-brand-600 drop-shadow-sm" />
            : <Square className="h-5 w-5 text-white drop-shadow-sm" />
          }
        </button>

        {/* Year + category chips */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {image.year && (
            <span className="bg-brand-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {image.year}
            </span>
          )}
          {image.category && (
            <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              {image.category}
            </span>
          )}
        </div>

        {/* Hover actions — pointer-events-none so the overlay doesn't block the checkbox */}
        {!selectMode && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 gap-1.5 pointer-events-none">
            <button
              onClick={e => { e.stopPropagation(); setEditing(true) }}
              className="pointer-events-auto p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-slate-700 hover:bg-white transition-colors shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete(image.id) }}
              className="pointer-events-auto p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 hover:bg-white transition-colors shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="px-3 py-2.5 min-h-[36px]">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveDescription(); if (e.key === 'Escape') setEditing(false) }}
              placeholder="Add a description…"
              className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              autoFocus
            />
            <button onClick={saveDescription} disabled={saving} className="text-emerald-600 hover:text-emerald-700 disabled:opacity-40">
              <Check className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-xs truncate">
            {image.description
              ? <span className="text-slate-600 font-medium">{image.description}</span>
              : <span className="text-slate-300 italic">Click ✎ to add description</span>
            }
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Upload modal ─────────────────────────────────────────────────────────────

function UploadModal({ siteId, categories, onClose, onUploaded }) {
  const [files, setFiles]             = useState([])
  const [category, setCategory]       = useState(categories[0] || '')
  const [newCategory, setNewCategory] = useState('')
  const [useNew, setUseNew]           = useState(categories.length === 0)
  const [year, setYear]               = useState(String(new Date().getFullYear()))
  const [uploading, setUploading]     = useState(false)
  const [progress, setProgress]       = useState([])
  const [errors, setErrors]           = useState([])
  const [dragging, setDragging]       = useState(false)
  const fileRef                       = useRef()
  const toast                         = useToast()

  const finalCategory = useNew ? newCategory.trim() : category

  function applyFiles(picked) {
    setFiles(picked)
    setProgress(picked.map(() => 'pending'))
    setErrors(picked.map(() => ''))
  }

  function handleFileInput(e) { applyFiles(Array.from(e.target.files)) }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (dropped.length) applyFiles(dropped)
  }

  async function upload() {
    if (!files.length || !finalCategory) return
    setUploading(true)
    let doneCount = 0

    for (let i = 0; i < files.length; i++) {
      setProgress(p => p.map((s, idx) => idx === i ? 'uploading' : s))
      try {
        const res = await uploadToCloudinary(
          files[i],
          `apel-admin/${siteId}/gallery/${finalCategory.toLowerCase().replace(/\s+/g, '-')}`
        )
        try {
          await addGalleryImage(siteId, {
            url:         res.secure_url,
            publicId:    res.public_id,
            description: '',
            category:    finalCategory,
            year:        year.trim() || String(new Date().getFullYear()),
            order:       Date.now() + i,
          })
          setProgress(p => p.map((s, idx) => idx === i ? 'done' : s))
          doneCount++
        } catch (fsErr) {
          console.error('Firestore write failed:', fsErr)
          const msg = fsErr.code === 'permission-denied'
            ? 'Permission denied — check Firestore rules'
            : fsErr.message || 'Firestore write failed'
          setProgress(p => p.map((s, idx) => idx === i ? 'error' : s))
          setErrors(e => e.map((v, idx) => idx === i ? msg : v))
        }
      } catch (cdnErr) {
        console.error('Cloudinary upload failed:', cdnErr)
        setProgress(p => p.map((s, idx) => idx === i ? 'error' : s))
        setErrors(e => e.map((v, idx) => idx === i ? 'Upload failed' : v))
      }
    }

    setUploading(false)
    if (doneCount === files.length) {
      toast(`${doneCount} image${doneCount > 1 ? 's' : ''} added to "${finalCategory}"`)
      onUploaded()
      onClose()
    } else if (doneCount > 0) {
      toast(`${doneCount}/${files.length} uploaded — see errors below`, 'error')
      onUploaded()
    } else {
      toast('Upload failed — check errors below', 'error')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-modal w-full max-w-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-900">Upload Images</h2>
            <p className="text-xs text-slate-400 mt-0.5">Images are saved to Cloudinary and indexed in Firestore</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Category <span className="text-slate-300 font-normal normal-case">(becomes a tab on the website)</span>
            </label>
            {!useNew && categories.length > 0 ? (
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <button
                  onClick={() => setUseNew(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <FolderPlus className="h-4 w-4" /> New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="e.g. Customer Service Week, Awards…"
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  autoFocus
                />
                {categories.length > 0 && (
                  <button
                    onClick={() => setUseNew(false)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Existing
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Year */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Year <span className="text-slate-300 font-normal normal-case">(groups photos into year albums on the website)</span>
            </label>
            <div className="flex gap-2">
              {[String(new Date().getFullYear()), String(new Date().getFullYear() - 1), String(new Date().getFullYear() - 2)].map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-sm font-semibold border transition-all',
                    year === y
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  )}
                >
                  {y}
                </button>
              ))}
              <input
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="Other…"
                className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-center font-semibold"
              />
            </div>
          </div>

          {/* Drop zone */}
          <label
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={clsx(
              'flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all',
              dragging
                ? 'border-brand-500 bg-brand-50'
                : files.length
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50'
            )}
          >
            <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center', files.length ? 'bg-emerald-100' : 'bg-slate-100')}>
              {files.length
                ? <Layers className="h-6 w-6 text-emerald-600" />
                : <ImageIcon className="h-6 w-6 text-slate-400" />
              }
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                {files.length ? `${files.length} image${files.length > 1 ? 's' : ''} selected` : 'Drop images here or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">{files.length ? 'Click to change selection' : 'PNG, JPG, WebP — multiple files OK'}</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
          </label>

          {/* Progress list */}
          {files.length > 0 && (
            <ul className="flex flex-col gap-1.5 max-h-44 overflow-y-auto -mx-1 px-1">
              {files.map((f, i) => (
                <li key={i}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50">
                    <span className={clsx(
                      'w-2 h-2 rounded-full flex-shrink-0 transition-colors',
                      progress[i] === 'done'      && 'bg-emerald-500',
                      progress[i] === 'uploading' && 'bg-brand-500 animate-pulse',
                      progress[i] === 'error'     && 'bg-red-500',
                      progress[i] === 'pending'   && 'bg-slate-300',
                    )} />
                    <span className="text-xs text-slate-700 truncate flex-1">{f.name}</span>
                    {progress[i] === 'uploading' && <span className="text-[10px] text-brand-600 font-medium">uploading…</span>}
                    {progress[i] === 'done'      && <span className="text-[10px] text-emerald-600 font-medium">done</span>}
                  </div>
                  {errors[i] && <p className="text-xs text-red-500 px-3 pt-1">{errors[i]}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-6 pb-5 flex justify-end gap-2.5 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button onClick={upload} loading={uploading} disabled={!files.length || !finalCategory}>
            <Upload className="h-4 w-4" />
            Upload{files.length > 0 ? ` ${files.length} image${files.length > 1 ? 's' : ''}` : ''}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Gallery page ────────────────────────────────────────────────────────

export default function Gallery() {
  const { siteId }                          = useParams()
  const site                                = getSite(siteId)
  const [images, setImages]                 = useState([])
  const [loading, setLoading]               = useState(true)
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeYear, setActiveYear]         = useState(null)
  const [showUpload, setShowUpload]         = useState(false)
  const [selected, setSelected]             = useState(new Set())
  const [bulkDeleting, setBulkDeleting]     = useState(false)
  const [confirmModal, setConfirmModal]     = useState(null)
  const [selBox, setSelBox]                 = useState(null)
  const toast                               = useToast()
  const gridRef                             = useRef()
  const dragRef                             = useRef({ active: false, startX: 0, startY: 0 })

  const load = useCallback(async () => {
    setLoading(true)
    setImages(await getGallery(siteId))
    setLoading(false)
  }, [siteId])

  useEffect(() => { load() }, [load])

  // Drag-to-select: document-level move/up so drag works outside the grid
  useEffect(() => {
    function onMouseMove(e) {
      const d = dragRef.current
      if (!d.active) return
      const x = Math.min(d.startX, e.clientX)
      const y = Math.min(d.startY, e.clientY)
      const w = Math.abs(e.clientX - d.startX)
      const h = Math.abs(e.clientY - d.startY)
      setSelBox({ x, y, w, h })
      if (w < 5 || h < 5) return
      const sel = new Set()
      gridRef.current?.querySelectorAll('[data-image-id]').forEach(el => {
        const r = el.getBoundingClientRect()
        if (r.left < x + w && r.right > x && r.top < y + h && r.bottom > y) {
          sel.add(el.dataset.imageId)
        }
      })
      setSelected(sel)
    }
    function onMouseUp() {
      if (!dragRef.current.active) return
      dragRef.current.active = false
      setSelBox(null)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [setSelected])

  const categories     = [...new Set(images.map(i => i.category).filter(Boolean))].sort()
  const byCat          = activeCategory ? images.filter(i => i.category === activeCategory) : images
  const availableYears = [...new Set(byCat.map(i => i.year).filter(Boolean))].sort((a, b) => b - a)
  const filtered       = activeYear ? byCat.filter(i => i.year === activeYear) : byCat
  const selectMode     = selected.size > 0

  function toggleSelect(id) {
    setSelected(s => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAll()   { setSelected(new Set(filtered.map(i => i.id))) }
  function clearSelect() { setSelected(new Set()) }

  function onGridMouseDown(e) {
    if (e.button !== 0) return
    if (e.target.closest('[data-image-id]')) return  // let card handle its own clicks
    e.preventDefault()
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY }
    setSelBox({ x: e.clientX, y: e.clientY, w: 0, h: 0 })
    setSelected(new Set())  // clear existing selection on new drag
  }

  function handleDelete(imageId) {
    setConfirmModal({
      title: 'Remove image',
      message: 'This image will be removed from the gallery. This cannot be undone.',
      confirmLabel: 'Remove',
      danger: true,
      onConfirm: async () => {
        await deleteGalleryImage(siteId, imageId)
        setImages(imgs => imgs.filter(x => x.id !== imageId))
        selected.has(imageId) && setSelected(s => { const n = new Set(s); n.delete(imageId); return n })
        setConfirmModal(null)
        toast('Image removed')
      },
    })
  }

  function handleBulkDelete() {
    const ids = Array.from(selected)
    setConfirmModal({
      title: `Delete ${ids.length} image${ids.length > 1 ? 's' : ''}`,
      message: `You're about to permanently delete ${ids.length} image${ids.length > 1 ? 's' : ''}. This cannot be undone.`,
      confirmLabel: `Delete ${ids.length}`,
      danger: true,
      onConfirm: async () => {
        setBulkDeleting(true)
        await deleteGalleryImages(siteId, ids)
        setImages(imgs => imgs.filter(x => !selected.has(x.id)))
        setSelected(new Set())
        setBulkDeleting(false)
        setConfirmModal(null)
        toast(`${ids.length} image${ids.length > 1 ? 's' : ''} deleted`)
      },
    })
  }

  function handleUpdate(imageId, data) {
    setImages(imgs => imgs.map(x => x.id === imageId ? { ...x, ...data } : x))
  }

  async function handleRenameCategory(oldName, newName) {
    await renameCategoryImages(siteId, oldName, newName)
    setImages(imgs => imgs.map(x => x.category === oldName ? { ...x, category: newName } : x))
    if (activeCategory === oldName) setActiveCategory(newName)
    toast(`Category renamed to "${newName}"`)
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={`${site?.name} — Gallery`}
        subtitle={`${images.length} image${images.length !== 1 ? 's' : ''} total${categories.length ? ` · ${categories.length} ${categories.length === 1 ? 'category' : 'categories'}` : ''}`}
        actions={
          <div className="flex items-center gap-2">
            {selectMode ? (
              <>
                <span className="text-xs text-slate-500 font-medium">{selected.size} of {filtered.length} selected</span>
                {selected.size < filtered.length && (
                  <Button size="sm" variant="secondary" onClick={selectAll}>
                    <CheckSquare className="h-3.5 w-3.5" /> Select all
                  </Button>
                )}
                <Button size="sm" variant="secondary" onClick={clearSelect}>Deselect</Button>
                <Button size="sm" variant="danger" onClick={handleBulkDelete} loading={bulkDeleting}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete {selected.size}
                </Button>
              </>
            ) : (
              <>
                {filtered.length > 0 && (
                  <Button size="sm" variant="secondary" onClick={selectAll}>
                    <CheckSquare className="h-3.5 w-3.5" /> Select all
                  </Button>
                )}
                <Button onClick={() => setShowUpload(true)}>
                  <Upload className="h-4 w-4" /> Upload
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Category tabs */}
      {categories.length > 0 && (
        <CategoryBar
          categories={categories}
          active={activeCategory}
          onSelect={cat => { setActiveCategory(cat); setActiveYear(null) }}
          onRename={handleRenameCategory}
        />
      )}

      {/* Year sub-tabs */}
      {availableYears.length > 0 && (
        <div className="flex items-center gap-1.5 px-8 py-2 bg-slate-50 border-b border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Year</span>
          <button
            onClick={() => setActiveYear(null)}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-semibold transition-all',
              activeYear === null ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            )}
          >
            All
          </button>
          {availableYears.map(y => (
            <button
              key={y}
              onClick={() => setActiveYear(y)}
              className={clsx(
                'px-3 py-1 rounded-full text-xs font-semibold transition-all',
                activeYear === y ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              )}
            >
              {y}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-slate-400">{filtered.length} image{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Grid */}
      <div className="px-8 py-6 flex-1">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <button
            onClick={() => setShowUpload(true)}
            className="w-full flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-slate-200 p-16 hover:border-brand-400 hover:bg-brand-50/30 transition-all text-center group"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
              <Upload className="h-7 w-7 text-slate-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-slate-600">No images yet</p>
              <p className="text-sm text-slate-400 mt-1">Click to upload your first images</p>
            </div>
          </button>
        ) : (
          <div
            ref={gridRef}
            onMouseDown={onGridMouseDown}
            className={clsx(
              'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4',
              selBox && 'select-none'
            )}
          >
            {filtered.map(img => (
              <ImageCard
                key={img.id}
                image={img}
                siteId={siteId}
                selected={selected.has(img.id)}
                selectMode={selectMode}
                onToggle={toggleSelect}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
            {/* Add more tile */}
            {!selectMode && (
              <button
                onClick={() => setShowUpload(true)}
                className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 text-slate-300 hover:border-brand-400 hover:text-brand-400 hover:bg-brand-50/30 transition-all"
              >
                <Upload className="h-5 w-5" />
                <span className="text-xs font-medium">Add more</span>
              </button>
            )}
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          siteId={siteId}
          categories={categories}
          onClose={() => setShowUpload(false)}
          onUploaded={load}
        />
      )}

      {/* Drag selection rubber-band box */}
      {selBox && selBox.w > 5 && selBox.h > 5 && (
        <div
          style={{
            position: 'fixed',
            left: selBox.x,
            top:  selBox.y,
            width:  selBox.w,
            height: selBox.h,
            pointerEvents: 'none',
            zIndex: 40,
            border: '1.5px solid #6366f1',
            background: 'rgba(99,102,241,0.08)',
            borderRadius: 4,
          }}
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
