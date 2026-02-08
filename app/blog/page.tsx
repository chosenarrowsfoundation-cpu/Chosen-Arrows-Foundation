import { getBlogPosts } from '@/app/actions/blog/get-posts'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Stories and updates from Chosen Arrows Foundation',
}

export default async function BlogPage() {
  const posts = await getBlogPosts({ publishedOnly: true })

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Stories and updates from our foundation
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-8">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No posts yet. Check back soon.</p>
          ) : (
            posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20">
                  {post.cover_image_url && (
                    <div className="aspect-video w-full relative bg-muted">
                      <img
                        src={post.cover_image_url}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <time className="text-sm text-muted-foreground">
                      {post.published_at ? format(new Date(post.published_at), 'PPP') : ''}
                    </time>
                    <h2 className="text-2xl font-semibold mt-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                    {post.author_name && (
                      <p className="text-sm text-muted-foreground mt-3">{post.author_name}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
