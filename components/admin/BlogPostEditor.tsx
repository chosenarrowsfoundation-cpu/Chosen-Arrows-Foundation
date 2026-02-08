'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogEditor } from './BlogEditor'
import { createBlogPost } from '@/app/actions/blog/create-post'
import { updateBlogPost } from '@/app/actions/blog/update-post'
import { uploadImage } from '@/app/actions/media/upload-image'
import { toast } from 'sonner'
import { Loader2, Save, Upload, X } from 'lucide-react'
import type { BlogPostDetail } from '@/app/actions/blog/get-post-by-slug'

function slugify(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function BlogPostEditor({ post }: { post?: BlogPostDetail | null }) {
  const router = useRouter()
  const isEditing = !!post
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? '')
  const [authorName, setAuthorName] = useState(post?.author_name ?? '')
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status === 'published' ? 'published' : 'draft')
  const [content, setContent] = useState(post?.content ?? '')
  const [coverUploading, setCoverUploading] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isEditing && title && !slug) setSlug(slugify(title))
  }, [title, isEditing, slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    const finalSlug = slug.trim() || slugify(title)
    if (!finalSlug) {
      toast.error('Slug is required')
      return
    }
    setSaving(true)
    try {
      if (isEditing && post) {
        const result = await updateBlogPost(post.id, {
          slug: finalSlug,
          title: title.trim(),
          excerpt: excerpt.trim() || null,
          content: content || '',
          cover_image_url: coverImageUrl.trim() || null,
          author_name: authorName.trim() || null,
          status,
        })
        if ('error' in result) {
          toast.error(result.error)
          return
        }
        toast.success('Post updated')
        router.refresh()
      } else {
        const result = await createBlogPost({
          slug: finalSlug,
          title: title.trim(),
          excerpt: excerpt.trim() || null,
          content: content || '',
          cover_image_url: coverImageUrl.trim() || null,
          author_name: authorName.trim() || null,
          status,
        })
        if ('error' in result) {
          toast.error(result.error)
          return
        }
        toast.success('Post created')
        router.push(`/admin/blog/${result.id}`)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const result = await uploadImage(file, 'blog/covers')
      if (result.success) {
        setCoverImageUrl(result.url)
        toast.success('Cover image uploaded')
      } else {
        toast.error('error' in result ? result.error : 'Upload failed')
      }
    } finally {
      setCoverUploading(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-post-slug"
            />
            <p className="text-xs text-muted-foreground">Used in URL: /blog/{slug || '…'}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary" rows={2} />
          </div>
          <div className="grid gap-2">
            <Label>Cover image</Label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleCoverUpload}
            />
            {coverImageUrl ? (
              <div className="relative inline-block">
                <div className="relative w-full max-w-sm aspect-video rounded-md border bg-muted overflow-hidden">
                  <Image
                    src={coverImageUrl}
                    alt="Cover"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => setCoverImageUrl('')}
                  aria-label="Remove cover"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
            >
              {coverUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {coverUploading ? 'Uploading…' : 'Upload cover image'}
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author">Author name</Label>
            <Input id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Author" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="published" checked={status === 'published'} onCheckedChange={(checked) => setStatus(checked ? 'published' : 'draft')} />
            <Label htmlFor="published">Published (visible on public blog)</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <p className="text-sm text-muted-foreground">Use the toolbar for headings, lists, images, and links.</p>
        </CardHeader>
        <CardContent>
          <BlogEditor content={content} onChange={setContent} placeholder="Write your post…" />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? 'Saving…' : isEditing ? 'Update post' : 'Create post'}
        </Button>
      </div>
    </form>
  )
}
