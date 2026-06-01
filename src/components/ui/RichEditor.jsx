import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { uploadToCloudinary } from '@/lib/cloudinary'
import {
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo,
  Image as ImageIcon, Link as LinkIcon, Heading2, Heading3,
} from 'lucide-react'
import { useState } from 'react'

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-brand-100 text-brand-700' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  )
}

export function RichEditor({ value, onChange, siteId }) {
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your post content here…' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  async function insertImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files[0]
      if (!file) return
      setUploading(true)
      try {
        const res = await uploadToCloudinary(file, `apel-admin/${siteId}/blog`)
        editor.chain().focus().setImage({ src: res.secure_url, alt: file.name }).run()
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  function setLink() {
    const url = prompt('Enter URL:')
    if (!url) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote className="h-4 w-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Insert link">
          <LinkIcon className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={insertImage} title="Insert image">
          {uploading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="h-4 w-4" />
        </ToolbarBtn>
      </div>

      <EditorContent editor={editor} className="tiptap" />
    </div>
  )
}
