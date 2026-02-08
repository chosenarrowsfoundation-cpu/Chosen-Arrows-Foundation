import { getBlogPostBySlug } from '@/app/actions/blog/get-post-by-slug'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Post not found' }
  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || undefined
  const image = post.og_image_url || post.cover_image_url
  return {
    title,
    description,
    keywords: post.meta_keywords?.length ? post.meta_keywords : undefined,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {post.cover_image_url && (
            <div className="aspect-video w-full relative rounded-lg overflow-hidden bg-muted mb-8">
              <img
                src={post.cover_image_url}
                alt=""
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-muted-foreground">
              {post.published_at && (
                <time dateTime={post.published_at}>
                  {format(new Date(post.published_at), 'PPP')}
                </time>
              )}
              {post.author_name && <span>{post.author_name}</span>}
            </div>
          </header>
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </main>
  )
}
