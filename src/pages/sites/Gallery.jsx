import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getGallery, addGalleryImage, deleteGalleryImage, updateGalleryImage } from '@/lib/firestore'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getSite } from '@/lib/sites'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody } from '@/components/ui/Card'
import { Upload, Trash2, Pencil, X, Check } from 'lucide-react'

function GalleryCard({ image, siteId, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle]     = useState(image.title || '')
  const [saving, setSaving]   = useState(false)

  async function save() {
    setSaving(true)
    await updateGalleryImage(siteId, image.id, { title })
    onUpdate(image.id, { title })
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => setEditing(true)}
            className="p-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="p-2 bg-white/90 rounded-lg text-red-500 hover:bg-white transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="px-3 py-2">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-brand-500"
              autoFocus
            />
            <button onClick={save} disabled={saving} className="text-green-600 hover:text-green-700 disabled:opacity-50">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-700 truncate">{image.title || 'Untitled'}</p>
        )}
      </div>
    </div>
  )
}

export default function Gallery() {
  const { siteId }              = useParams()
  const site                    = getSite(siteId)
  const [images, setImages]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef                 = useRef()

  async function load() {
    setLoading(true)
    setImages(await getGallery(siteId))
    setLoading(false)
  }

  useEffect(() => { load() }, [siteId])

  async function handleFiles(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      await Promise.all(files.map(async (file, i) => {
        const res = await uploadToCloudinary(file, `apel-admin/${siteId}/gallery`)
        await addGalleryImage(siteId, {
          url:       res.secure_url,
          publicId:  res.public_id,
          title:     file.name.replace(/\.[^.]+$/, ''),
          order:     images.length + i,
        })
      }))
      await load()
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDelete(imageId) {
    if (!confirm('Remove this image from the gallery?')) return
    await deleteGalleryImage(siteId, imageId)
    setImages(imgs => imgs.filter(x => x.id !== imageId))
  }

  function handleUpdate(imageId, data) {
    setImages(imgs => imgs.map(x => x.id === imageId ? { ...x, ...data } : x))
  }

  return (
    <div>
      <PageHeader
        title={`${site?.name} — Gallery`}
        subtitle={`${images.length} image${images.length !== 1 ? 's' : ''}`}
        actions={
          <>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            <Button onClick={() => fileRef.current.click()} loading={uploading}>
              <Upload className="h-4 w-4" /> Upload Images
            </Button>
          </>
        }
      />

      <div className="px-8 py-6">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading gallery…</p>
        ) : images.length === 0 ? (
          <label className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl p-16 cursor-pointer hover:border-brand-400 transition-colors text-center">
            <Upload className="h-10 w-10 text-gray-300" />
            <div>
              <p className="font-medium text-gray-600">Upload your first images</p>
              <p className="text-sm text-gray-400 mt-1">Click to select multiple images at once</p>
            </div>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          </label>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map(img => (
              <GalleryCard
                key={img.id}
                image={img}
                siteId={siteId}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl aspect-video cursor-pointer hover:border-brand-400 transition-colors text-gray-400 hover:text-brand-500">
              <Upload className="h-6 w-6" />
              <span className="text-xs">Add more</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
