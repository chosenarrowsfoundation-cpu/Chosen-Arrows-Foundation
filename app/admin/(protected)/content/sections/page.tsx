import Link from 'next/link'
import { getAllSections } from '@/app/actions/content/get-all-sections'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ChevronRight } from 'lucide-react'
import { languageNames } from '@/lib/constants'

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

export default async function ContentSectionsPage() {
  const sections = await getAllSections()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Sections</h1>
        <p className="text-muted-foreground mt-1">
          Edit homepage sections including the hero, values, impact, community, and CTA. Multi-language support.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const displayName = sectionDisplayNames[section.section_key] ?? section.section_key
          const translationCount = section.translations?.length ?? 0

          return (
            <Link key={section.id} href={`/admin/content/sections/${section.section_key}`}>
              <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">{displayName}</CardTitle>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>
                    {translationCount > 0 ? (
                      <span className="text-xs">
                        {section.translations.map((t) => languageNames[t.language_code] || t.language_code).join(', ')}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600">No translations yet</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="px-0 -ml-2">
                    Edit content
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {sections.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No content sections found. Run the database seed to create initial sections.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
