'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { uploadVideo } from '@/app/actions/media/upload-video'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Save, Upload, Video } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { updateMultipleSettings } from '@/app/actions/settings/update-settings'

const settingsSchema = z.object({
  hero_stats: z.object({
    childrenSupported: z.number().min(0),
    activeMentors: z.number().min(0),
    fundsRaised: z.number().min(0),
  }).optional(),
  hero_video: z.object({
    url: z.string().optional(),
    posterUrl: z.string().optional(),
  }).optional(),
  community_video: z.object({
    url: z.string().optional(),
    posterUrl: z.string().optional(),
  }).optional(),
  impact_stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
    description: z.string(),
  })).optional(),
  community_stats: z.object({
    donorRetention: z.string(),
    avgRating: z.string(),
    transparency: z.string(),
  }).optional(),
  contact_info: z.object({
    emails: z.array(z.string().email()),
    phone: z.string(),
    address: z.string(),
    officeHours: z.object({
      monday: z.string(),
      saturday: z.string(),
      sunday: z.string(),
    }),
  }).optional(),
  social_links: z.object({
    facebook: z.string().url().optional().nullable(),
    twitter: z.string().url().optional().nullable(),
    instagram: z.string().url().optional().nullable(),
    linkedin: z.string().url().optional().nullable(),
  }).optional(),
  testimonials_config: z.object({
    enabled: z.boolean(),
    google_place_id: z.string().optional().nullable(),
  }).optional(),
  manual_payment_details: z.object({
    bank: z.object({
      bankName: z.string(),
      accountName: z.string(),
      accountNumber: z.string(),
      swiftCode: z.string(),
      currency: z.string(),
    }).optional(),
    mpesa: z.object({
      number: z.string(),
      name: z.string(),
      instructions: z.string(),
    }).optional(),
  }).optional(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

interface SiteSettingsEditorProps {
  initialSettings: Record<string, any>
}

const DEFAULT_HERO_VIDEO_URL = 'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4'

export default function SiteSettingsEditor({ initialSettings }: SiteSettingsEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [isUploadingCommunityVideo, setIsUploadingCommunityVideo] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const communityVideoInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      hero_stats: initialSettings.hero_stats || {
        childrenSupported: 45,
        activeMentors: 8,
        fundsRaised: 15000,
      },
      hero_video: initialSettings.hero_video || {
        url: '',
        posterUrl: '',
      },
      community_video: initialSettings.community_video || {
        url: '',
        posterUrl: '',
      },
      impact_stats: initialSettings.impact_stats || [],
      community_stats: initialSettings.community_stats || {
        donorRetention: '98%',
        avgRating: '4.9★',
        transparency: '100%',
      },
      contact_info: initialSettings.contact_info || {
        emails: ['info@chosenarrowsfoundation.org', 'support@chosenarrowsfoundation.org'],
        phone: '0798 213 309',
        address: 'Nanyuki, Marura Block 3\nSweet Water Road',
        officeHours: {
          monday: 'Monday - Friday: 9:00 AM - 5:00 PM',
          saturday: 'Saturday: 10:00 AM - 2:00 PM',
          sunday: 'Sunday: Closed',
        },
      },
      social_links: initialSettings.social_links || {
        facebook: null,
        twitter: 'https://x.com/ChosenArrows',
        instagram: null,
        linkedin: 'https://www.linkedin.com/company/chosen-arrows-foundation',
      },
      testimonials_config: initialSettings.testimonials_config || {
        enabled: false,
        google_place_id: null,
      },
      manual_payment_details: initialSettings.manual_payment_details || {
        bank: {
          bankName: '[BANK NAME]',
          accountName: 'Chosen Arrows Foundation',
          accountNumber: '[ACCOUNT NUMBER]',
          swiftCode: '[SWIFT CODE]',
          currency: 'USD / KES',
        },
        mpesa: {
          number: '[PHONE/PAYBILL NUMBER]',
          name: 'Chosen Arrows Foundation',
          instructions: 'Go to M-Pesa > Lipa na M-Pesa > Paybill/Buy Goods',
        },
      },
    },
  })

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingVideo(true)
    try {
      const result = await uploadVideo(file, 'hero')
      if (result.success) {
        form.setValue('hero_video.url', result.url)
        toast.success('Video uploaded', { description: 'Click Save All Settings to apply.' })
      } else {
        toast.error('Upload failed', { description: 'error' in result ? result.error : 'Please try again.' })
      }
    } catch (err) {
      toast.error('Upload failed', { description: 'Please try again.' })
    } finally {
      setIsUploadingVideo(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  const handleCommunityVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingCommunityVideo(true)
    try {
      const result = await uploadVideo(file, 'community')
      if (result.success) {
        form.setValue('community_video.url', result.url)
        toast.success('Community video uploaded', { description: 'Click Save All Settings to apply.' })
      } else {
        toast.error('Upload failed', { description: 'error' in result ? result.error : 'Please try again.' })
      }
    } catch (err) {
      toast.error('Upload failed', { description: 'Please try again.' })
    } finally {
      setIsUploadingCommunityVideo(false)
      if (communityVideoInputRef.current) communityVideoInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true)

    try {
      const settingsToUpdate = []

      if (data.hero_stats) {
        settingsToUpdate.push({
          key: 'hero_stats',
          value: data.hero_stats,
          description: 'Hero section statistics',
        })
      }

      if (data.hero_video) {
        settingsToUpdate.push({
          key: 'hero_video',
          value: data.hero_video,
          description: 'Hero section background video',
        })
      }

      if (data.community_video) {
        settingsToUpdate.push({
          key: 'community_video',
          value: data.community_video,
          description: 'Community section video',
        })
      }

      if (data.impact_stats) {
        settingsToUpdate.push({
          key: 'impact_stats',
          value: data.impact_stats,
          description: 'Impact section statistics',
        })
      }

      if (data.community_stats) {
        settingsToUpdate.push({
          key: 'community_stats',
          value: data.community_stats,
          description: 'Community section statistics',
        })
      }

      if (data.contact_info) {
        settingsToUpdate.push({
          key: 'contact_info',
          value: data.contact_info,
          description: 'Contact information',
        })
      }

      if (data.social_links) {
        settingsToUpdate.push({
          key: 'social_links',
          value: data.social_links,
          description: 'Social media links',
        })
      }

      if (data.testimonials_config) {
        settingsToUpdate.push({
          key: 'testimonials_config',
          value: data.testimonials_config,
          description: 'Testimonials from Google Business Profile',
        })
      }

      if (data.manual_payment_details) {
        settingsToUpdate.push({
          key: 'manual_payment_details',
          value: data.manual_payment_details,
          description: 'Bank transfer and M-Pesa manual payment details',
        })
      }

      const result = await updateMultipleSettings(settingsToUpdate)

      if (result.success) {
        toast.success('Settings saved', {
          description: 'All settings have been updated.',
        })
      } else {
        toast.error('Failed to save', {
          description: (result as { success: false; error: string }).error,
        })
      }
    } catch (error) {
      toast.error('An error occurred', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Configure global settings for your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="hero" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="hero">Hero Stats</TabsTrigger>
                <TabsTrigger value="community">Community Stats</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="social">Social Links</TabsTrigger>
                <TabsTrigger value="manual-payment">Manual Payment</TabsTrigger>
              </TabsList>

              {/* Hero Stats */}
              <TabsContent value="hero" className="space-y-4 mt-6">
                {/* Hero Background Video */}
                <div className="rounded-lg border border-border p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    <h4 className="font-medium">Hero Background Video</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload a video or paste a URL. Used as the homepage hero section background. MP4 or WebM, max 50MB.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <FormField
                      control={form.control}
                      name="hero_video.url"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder={DEFAULT_HERO_VIDEO_URL}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Leave empty to use the default video, or paste an external URL.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col justify-end gap-2">
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={isUploadingVideo}
                      >
                        {isUploadingVideo ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Video
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="hero_video.posterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poster Image URL (optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="/hero-poster.jpg"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Image shown before the video loads.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="hero_stats.childrenSupported"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Children Supported</FormLabel>
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
                    name="hero_stats.activeMentors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active Mentors</FormLabel>
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
                    name="hero_stats.fundsRaised"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funds Raised ($)</FormLabel>
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
                </div>
              </TabsContent>

              {/* Community Stats */}
              <TabsContent value="community" className="space-y-4 mt-6">
                {/* Community Section Video */}
                <div className="rounded-lg border border-border p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    <h4 className="font-medium">Community Section Video</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload a video or paste a URL. Shown in the community section on the homepage. MP4 or WebM, max 50MB.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <FormField
                      control={form.control}
                      name="community_video.url"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="/hero-background.mp4"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Leave empty to use the default video, or paste an external URL.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col justify-end gap-2">
                      <input
                        ref={communityVideoInputRef}
                        type="file"
                        accept="video/mp4,video/webm"
                        className="hidden"
                        onChange={handleCommunityVideoUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => communityVideoInputRef.current?.click()}
                        disabled={isUploadingCommunityVideo}
                      >
                        {isUploadingCommunityVideo ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Video
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="community_video.posterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poster Image URL (optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="/community-poster.jpg"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Image shown before the video loads.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="community_stats.donorRetention"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donor Retention</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="98%" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="community_stats.avgRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average Rating</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="4.9★" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="community_stats.transparency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transparency</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="100%" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Testimonials (Google Business Profile) */}
              <TabsContent value="testimonials" className="space-y-4 mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Testimonials are fetched from your Google Business Profile. Set the Place ID below and add your Google Places API key in the API & Integrations card above (or in environment variables).
                </p>
                <FormField
                  control={form.control}
                  name="testimonials_config.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable Google Business testimonials</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Show reviews from your Google Business Profile on the homepage
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="testimonials_config.google_place_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Place ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          placeholder="ChIJ..."
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Find your Place ID in Google Business Profile or via the Place ID Finder
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Contact Info */}
              <TabsContent value="contact" className="space-y-4 mt-6">
                <FormField
                  control={form.control}
                  name="contact_info.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+1 (555) 123-4567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_info.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-20"
                          placeholder="Nanyuki, Marura Block 3&#10;Sweet Water Road"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="contact_info.officeHours.monday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monday - Friday</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="9:00 AM - 5:00 PM" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_info.officeHours.saturday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saturday</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="10:00 AM - 2:00 PM" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_info.officeHours.sunday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sunday</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Closed" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Social Links */}
              <TabsContent value="social" className="space-y-4 mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="social_links.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value || null)}
                            placeholder="https://facebook.com/..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_links.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value || null)}
                            placeholder="https://x.com/..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_links.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value || null)}
                            placeholder="https://instagram.com/..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_links.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value || null)}
                            placeholder="https://linkedin.com/..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Manual Payment (Bank Transfer & M-Pesa) */}
              <TabsContent value="manual-payment" className="space-y-4 mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Shown on the donate page for donors who prefer bank transfer or manual M-Pesa.
                </p>
                <div className="space-y-6">
                  <div className="rounded-lg border border-border p-4 space-y-4">
                    <h4 className="font-medium text-sm">Bank Transfer</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="manual_payment_details.bank.bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="[BANK NAME]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="manual_payment_details.bank.accountName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Chosen Arrows Foundation" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="manual_payment_details.bank.accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="[ACCOUNT NUMBER]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="manual_payment_details.bank.swiftCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SWIFT Code</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="[SWIFT CODE]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="manual_payment_details.bank.currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="USD / KES" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-4 space-y-4">
                    <h4 className="font-medium text-sm">M-Pesa (Manual)</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="manual_payment_details.mpesa.number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Paybill / Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="[NUMBER]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="manual_payment_details.mpesa.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Chosen Arrows Foundation" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="manual_payment_details.mpesa.instructions"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Go to M-Pesa > Lipa na M-Pesa > Paybill/Buy Goods" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save All Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
