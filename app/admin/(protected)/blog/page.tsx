import { getBlogPosts } from '@/app/actions/blog/get-posts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, FileText, Pencil, Eye, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import BlogPostActions from '@/components/admin/BlogPostActions'

export default async function AdminBlogPage() {
  const posts = await getBlogPosts({ admin: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Blog</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Add and edit posts. Changes appear on the public blog immediately when published.
          </p>
        </div>
        <Link href="/admin/blog/new" className="shrink-0">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Create your first blog post. Use the rich editor to add headings, images, and sections.
              </p>
              <Link href="/admin/blog/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <CardTitle className="text-lg flex flex-wrap items-center gap-2">
                    <span className="break-words">{post.title}</span>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="shrink-0">
                      {post.status}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground break-words">
                    /{post.slug}
                    {post.author_name && ` · ${post.author_name}`}
                    {' · '}
                    {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {post.status === 'published' && (
                    <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href={`/admin/blog/${post.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <BlogPostActions postId={post.id} postTitle={post.title} />
                </div>
              </CardHeader>
              {post.excerpt && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
