import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { getBlogPost, createBlogPost, updateBlogPost } from '@/lib/firestore'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getSite } from '@/lib/sites'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { RichEditor } from '@/components/ui/RichEditor'
import { Card, CardBody } from '@/components/ui/Card'
import { Save, ArrowLeft, Upload } from 'lucide-react'

export default function BlogEditor() {
  const { siteId, postId } = useParams()
  const navigate = useNavigate()
  const site     = getSite(siteId)
  const isNew    = !postId

  const [content, setContent]           = useState('')
  const [coverImage, setCoverImage]     = useState('')
  const [coverUploading, setCoverUploading] = useState(false)
  const [saving, setSaving]             = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (!isNew) {
      getBlogPost(siteId, postId).then(post => {
        if (!post) return
        reset({
          title:   post.title,
          excerpt: post.excerpt,
          tags:    post.tags?.join(', '),
          status:  post.status,
        })
        setContent(post.content || '')
        setCoverImage(post.coverImage || '')
      })
    }
  }, [siteId, postId])

  async function uploadCover(e) {
    const file = e.target.files[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const res = await uploadToCloudinary(file, `apel-admin/${siteId}/blog-covers`)
      setCoverImage(res.secure_url)
    } finally {
      setCoverUploading(false)
    }
  }

  async function onSubmit(data) {
    setSaving(true)
    try {
      const payload = {
        title:      data.title,
        excerpt:    data.excerpt,
        tags:       data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        status:     data.status,
        content,
        coverImage,
        ...(data.status === 'published' && isNew && { publishedAt: new Date().toISOString() }),
      }
      if (isNew) {
        await createBlogPost(siteId, payload)
      } else {
        await updateBlogPost(siteId, postId, payload)
      }
      navigate(`/sites/${siteId}/blog`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={`${site?.name} — ${isNew ? 'New Post' : 'Edit Post'}`}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(`/sites/${siteId}/blog`)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>
              <Save className="h-4 w-4" /> Save Post
            </Button>
          </div>
        }
      />

      <div className="px-8 py-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Input
                label="Title"
                placeholder="Post title…"
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />
              <Textarea
                label="Excerpt / Summary"
                rows={3}
                placeholder="Brief summary shown in listing pages…"
                {...register('excerpt')}
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <label className="text-sm font-medium text-gray-700 block mb-2">Content</label>
              <RichEditor value={content} onChange={setContent} siteId={siteId} />
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Select label="Status" {...register('status')} defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
              <Input
                label="Tags (comma-separated)"
                placeholder="finance, investment, news"
                {...register('tags')}
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <label className="text-sm font-medium text-gray-700 block mb-2">Cover Image</label>
              {coverImage ? (
                <div className="relative">
                  <img src={coverImage} alt="Cover" className="w-full h-40 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md hover:bg-black/70"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-brand-400 transition-colors">
                  {coverUploading ? (
                    <svg className="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-sm text-gray-500">Click to upload cover image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={uploadCover} disabled={coverUploading} />
                </label>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
