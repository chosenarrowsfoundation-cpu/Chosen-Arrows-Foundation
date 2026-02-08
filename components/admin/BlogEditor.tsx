'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])
  const setLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Link URL:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null
  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2 rounded-t-lg">
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo className="h-4 w-4" />
      </Button>
      <span className="w-px h-6 bg-border mx-1" />
      <Button type="button" variant="ghost" size="icon" className={cn('h-8 w-8', editor.isActive('bold') && 'bg-muted')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={cn('h-8 w-8', editor.isActive('italic') && 'bg-muted')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </Button>
      <span className="w-px h-6 bg-border mx-1" />
      <Button type="button" variant="ghost" size="icon" className={cn('h-8 w-8', editor.isActive('heading', { level: 2 }) && 'bg-muted')} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={cn('h-8 w-8', editor.isActive('heading', { level: 3 }) && 'bg-muted')} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={cn('h-8 w-8', editor.isActive('bulletList') && 'bg-muted')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={cn('h-8 w-8', editor.isActive('orderedList') && 'bg-muted')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={cn('h-8 w-8', editor.isActive('blockquote') && 'bg-muted')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </Button>
      <span className="w-px h-6 bg-border mx-1" />
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={addImage}>
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className={cn('h-8 w-8', editor.isActive('link') && 'bg-muted')} onClick={setLink}>
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function BlogEditor({ content, onChange, placeholder = 'Write your post…', className }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener' } }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[280px] px-4 py-3 focus:outline-none',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  }, [])

  useEffect(() => {
    if (!editor) return
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false)
    }
  }, [content, editor])

  return (
    <div className={cn('border rounded-lg overflow-hidden bg-background', className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
