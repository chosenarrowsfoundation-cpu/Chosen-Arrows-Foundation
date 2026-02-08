'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { languages, languageNames } from '@/lib/constants'
import { toast } from 'sonner'
import { Loader2, Save, Copy, CheckCircle2, ChevronDown } from 'lucide-react'
import { createCampaign, type CampaignInput } from '@/app/actions/campaigns/create-campaign'
import { updateCampaign } from '@/app/actions/campaigns/update-campaign'
import type { Campaign } from '@/app/actions/campaigns/get-campaigns'
import CampaignImageManager from './CampaignImageManager'
import CampaignUpdatesManager from './CampaignUpdatesManager'

const campaignSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  status: z.enum(['draft', 'active', 'completed', 'archived']),
  goal_amount: z.number().min(1, 'Goal amount must be at least $1'),
  raised_amount: z.number().min(0, 'Raised amount cannot be negative'),
  donor_count: z.number().min(0, 'Donor count cannot be negative'),
  days_left: z.number().nullable(),
  category: z.string().nullable(),
  featured: z.boolean(),
  translations: z.array(z.object({
    language_code: z.string(),
    title: z.string().min(1, 'Title is required'),
    story: z.string().min(1, 'Story is required'),
    full_story: z.string().nullable(),
    child_name: z.string().nullable(),
    child_age: z.number().nullable(),
    location: z.string().nullable(),
  })),
})

type CampaignFormValues = z.infer<typeof campaignSchema>

interface CampaignEditorProps {
  campaign?: Campaign & {
    translationsByLanguage?: Record<string, Campaign['translation']>
    images?: Array<{
      id: string
      image_url: string
      image_alt: string | null
      is_primary: boolean
      display_order: number
    }>
  }
}

export default function CampaignEditor({ campaign }: CampaignEditorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  const [activeLanguage, setActiveLanguage] = useState<string>(languages[0])
  const [isSaving, setIsSaving] = useState(false)
  const [copiedLanguage, setCopiedLanguage] = useState<string | null>(null)

  const isEditing = !!campaign

  // Initialize translations for all languages
  const initializeTranslations = (): CampaignFormValues['translations'] => {
    if (campaign) {
      // Load existing translations from all languages
      return languages.map(lang => {
        const translation = campaign.translationsByLanguage?.[lang] || campaign.translation
        return {
          language_code: lang,
          title: translation?.title || '',
          story: translation?.story || '',
          full_story: translation?.full_story || null,
          child_name: translation?.child_name || null,
          child_age: translation?.child_age || null,
          location: translation?.location || null,
        }
      })
    }
    return languages.map(lang => ({
      language_code: lang,
      title: '',
      story: '',
      full_story: null,
      child_name: null,
      child_age: null,
      location: null,
    }))
  }

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      slug: campaign?.slug || '',
      status: (campaign?.status as any) || 'draft',
      goal_amount: campaign?.goal_amount || 0,
      raised_amount: campaign?.raised_amount || 0,
      donor_count: campaign?.donor_count || 0,
      days_left: campaign?.days_left,
      category: campaign?.category || null,
      featured: campaign?.featured || false,
      translations: initializeTranslations(),
    },
  })

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Auto-generate slug when title changes
  const handleTitleChange = (value: string, language: string) => {
    if (language === 'en' && !isEditing) {
      const slug = generateSlug(value)
      form.setValue('slug', slug, { shouldValidate: true })
    }
    const translations = form.getValues('translations')
    const index = translations.findIndex(t => t.language_code === language)
    if (index >= 0) {
      translations[index].title = value
      form.setValue('translations', translations)
    }
  }

  const handleCopyFromEnglish = () => {
    const translations = form.getValues('translations')
    const english = translations.find(t => t.language_code === 'en')
    if (english) {
      const index = translations.findIndex(t => t.language_code === activeLanguage)
      if (index >= 0) {
        translations[index] = { ...english, language_code: activeLanguage }
        form.setValue('translations', translations)
        setCopiedLanguage(activeLanguage)
        setTimeout(() => setCopiedLanguage(null), 2000)
        toast.success('Copied from English', {
          description: 'Remember to translate the content!',
        })
      }
    }
  }

  const onSubmit = async (data: CampaignFormValues) => {
    setIsSaving(true)

    try {
      if (isEditing && campaign) {
        const result = await updateCampaign(campaign.id, data)
        if (result.success) {
          toast.success('Campaign updated', {
            description: 'Your changes have been saved.',
          })
          router.refresh()
        } else {
          toast.error('Failed to update', {
            description: (result as { success: false; error: string }).error,
          })
        }
      } else {
        const result = await createCampaign(data as CampaignInput)
        if (result.success) {
          toast.success('Campaign created', {
            description: 'Redirecting to campaign page...',
          })
          router.push(`/admin/campaigns/${result.campaignId}`)
          router.refresh()
        } else {
          toast.error('Failed to create', {
            description: (result as { success: false; error: string }).error,
          })
        }
      }
    } catch (error) {
      toast.error('An error occurred', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const currentTranslation = form.watch('translations').find(t => t.language_code === activeLanguage) || {
    language_code: activeLanguage,
    title: '',
    story: '',
    full_story: null,
    child_name: null,
    child_age: null,
    location: null,
  }

  const enIndex = form.watch('translations').findIndex(t => t.language_code === 'en')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Campaign' : 'Create Campaign'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            {!isEditing ? (
              /* Simplified create flow: single form, no tabs */
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name={`translations.${enIndex}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleTitleChange(e.target.value, 'en')
                          }}
                          placeholder="e.g. Support Maria's Education"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`translations.${enIndex}.story`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short story</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ''}
                          className="min-h-24"
                          placeholder="Brief description for campaign cards..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="goal_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            min="1"
                            step="0.01"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  URL slug: <span className="font-mono">{form.watch('slug') || '—'}</span>
                </p>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="sr-only">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                      <ChevronDown className="h-4 w-4" />
                      Optional settings
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="raised_amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Raised ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="donor_count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Donor count</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                min="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="days_left"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days left</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                min="0"
                                placeholder="Optional"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Optional" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Skills">Skills</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Featured on homepage</FormLabel>
                            <p className="text-xs text-muted-foreground">Show this campaign on the homepage</p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab - form fields only, no nested form in sibling tabs */}
              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="campaign-slug" />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          URL-friendly identifier (auto-generated from title)
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Skills">Skills</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Show on homepage
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="goal_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="raised_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raised Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="donor_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donor Count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="days_left"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days Left</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            min="0"
                            placeholder="Leave empty if no deadline"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Add campaign content in multiple languages
                  </p>
                  {activeLanguage !== 'en' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyFromEnglish}
                    >
                      {copiedLanguage === activeLanguage ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy from English
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
                  <TabsList className="grid w-full grid-cols-3">
                    {languages.map((lang) => (
                      <TabsTrigger key={lang} value={lang}>
                        {languageNames[lang]}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {languages.map((lang) => {
                    const translationIndex = form.watch('translations').findIndex(t => t.language_code === lang)
                    const translation = form.watch('translations')[translationIndex]

                    return (
                      <TabsContent key={lang} value={lang} className="space-y-4 mt-6">
                        <FormField
                          control={form.control}
                          name={`translations.${translationIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Title</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e)
                                    handleTitleChange(e.target.value, lang)
                                  }}
                                  placeholder="Enter campaign title"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name={`translations.${translationIndex}.child_name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Child Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value={field.value || ''}
                                    placeholder="Child's name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`translations.${translationIndex}.child_age`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Child Age</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                    min="0"
                                    max="18"
                                    placeholder="Age"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`translations.${translationIndex}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ''}
                                  placeholder="e.g., Nairobi, Kenya"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`translations.${translationIndex}.story`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Short Story (for list view)</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  value={field.value || ''}
                                  className="min-h-24"
                                  placeholder="Brief description shown in campaign cards..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`translations.${translationIndex}.full_story`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Story (for detail page)</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  value={field.value || ''}
                                  className="min-h-40"
                                  placeholder="Detailed story shown on campaign detail page..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    )
                  })}
                </Tabs>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-4 mt-6">
                {isEditing && campaign ? (
                  <CampaignImageManager
                    campaignId={campaign.id}
                    images={campaign.images || []}
                  />
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      Save the campaign first to upload images
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Create the campaign, then come back to add images
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Updates Tab */}
              <TabsContent value="updates" className="space-y-4 mt-6">
                {campaign ? (
                  <CampaignUpdatesManager campaignId={campaign.id} />
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      Save the campaign first to add updates
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Create the campaign, then come back to add progress updates
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Update Campaign' : 'Create Campaign'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
