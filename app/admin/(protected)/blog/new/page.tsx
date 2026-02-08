import BlogPostEditor from '@/components/admin/BlogPostEditor'

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New post</h1>
        <p className="text-muted-foreground">Create a blog post with the editor below.</p>
      </div>
      <BlogPostEditor />
    </div>
  )
}
