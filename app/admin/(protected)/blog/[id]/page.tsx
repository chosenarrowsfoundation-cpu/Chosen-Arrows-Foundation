import { getBlogPostById } from '@/app/actions/blog/get-post-by-slug'
import { notFound } from 'next/navigation'
import BlogPostEditor from '@/components/admin/BlogPostEditor'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(id)
  if (!post) notFound()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit post</h1>
        <p className="text-muted-foreground">
          Changes are reflected on the public blog when you save as published.
        </p>
      </div>
      <BlogPostEditor post={post} />
    </div>
  )
}
