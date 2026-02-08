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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Add and edit posts. Changes appear on the public blog immediately when published.
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
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
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1.5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {post.title}
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    /{post.slug}
                    {post.author_name && ` · ${post.author_name}`}
                    {' · '}
                    {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
