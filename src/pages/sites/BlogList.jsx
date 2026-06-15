import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlogPosts, deleteBlogPost, updateBlogPost } from '@/lib/firestore'
import { getSite } from '@/lib/sites'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

export default function BlogList() {
  const { siteId } = useParams()
  const navigate    = useNavigate()
  const site        = getSite(siteId)
  const [posts, setPosts]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [deleting, setDeleting]     = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)

  async function load() {
    setLoading(true)
    setPosts(await getBlogPosts(siteId))
    setLoading(false)
  }

  useEffect(() => { load() }, [siteId])

  async function toggleStatus(post) {
    const next = post.status === 'published' ? 'draft' : 'published'
    await updateBlogPost(siteId, post.id, {
      status: next,
      ...(next === 'published' && { publishedAt: new Date().toISOString() }),
    })
    load()
  }

  function handleDelete(post) {
    setConfirmModal({
      title: 'Delete post',
      message: `"${post.title}" will be permanently deleted.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        setDeleting(post.id)
        await deleteBlogPost(siteId, post.id)
        setPosts(p => p.filter(x => x.id !== post.id))
        setDeleting(null)
        setConfirmModal(null)
      },
    })
  }

  return (
    <div>
      <PageHeader
        title={`${site?.name} — Blog`}
        subtitle={`${posts.length} post${posts.length !== 1 ? 's' : ''}`}
        actions={
          <Button onClick={() => navigate(`/sites/${siteId}/blog/new`)}>
            <Plus className="h-4 w-4" /> New Post
          </Button>
        }
      />

      <div className="px-8 py-6">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading posts…</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm mt-1">Create your first blog post for {site?.name}</p>
          </div>
        ) : (
          <Card>
            <div className="divide-y divide-gray-100">
              {posts.map(post => (
                <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{post.excerpt}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {post.createdAt?.toDate ? format(post.createdAt.toDate(), 'dd MMM yyyy') : ''}
                    </p>
                  </div>
                  <Badge variant={post.status}>{post.status}</Badge>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(post)}
                      title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => navigate(`/sites/${siteId}/blog/${post.id}/edit`)}
                      className="p-1.5 text-gray-400 hover:text-brand-600 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      disabled={deleting === post.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

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
