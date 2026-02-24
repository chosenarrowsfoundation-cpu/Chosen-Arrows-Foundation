import { notFound } from 'next/navigation'
import { getContent } from '@/app/actions/content/get-content'
import ContentSectionEditor from '@/components/admin/ContentSectionEditor'
import { updateContent } from '@/app/actions/content/update-content'
import { languages } from '@/lib/constants'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const sectionDisplayNames: Record<string, string> = {
  hero: 'Hero Section',
  values: 'Values Section',
  impact: 'Impact Section',
  community: 'Community Section',
  cta: 'CTA Section',
  footer: 'Footer',
  navigation: 'Navigation',
  about: 'About Page',
  contact: 'Contact Page',
  mentorship: 'Mentorship Page',
  donate: 'Donate Page',
  'donate-form': 'Donate Form',
  'not-found': '404 Page',
}

interface PageProps {
  params: Promise<{ sectionKey: string }>
}

export default async function SectionEditorPage({ params }: PageProps) {
  const { sectionKey } = await params

  if (!/^[a-z0-9-]+$/.test(sectionKey)) {
    notFound()
  }

  // Fetch content for all languages in parallel
  const contentByLanguage = Object.fromEntries(
    await Promise.all(
      languages.map(async (lang) => {
        const content = await getContent(sectionKey, lang)
        return [lang, content] as const
      })
    )
  ) as Record<string, Record<string, any> | null>

  const displayName = sectionDisplayNames[sectionKey] ?? sectionKey

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/content/sections">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit {displayName}</h1>
          <p className="text-muted-foreground mt-1">
            Update the content for this section. Use the language tabs to edit translations.
          </p>
        </div>
      </div>

      <ContentSectionEditor
        sectionKey={sectionKey}
        sectionName={displayName}
        contentByLanguage={contentByLanguage}
        updateAction={updateContent}
      />
    </div>
  )
}
