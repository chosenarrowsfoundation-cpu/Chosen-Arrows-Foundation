'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Loader2, Save, Key, Shield } from 'lucide-react'
import { updateIntegrationConfig } from '@/app/actions/settings/update-integration-config'
import { INTEGRATION_KEYS } from '@/lib/integration-config-keys'

const MASK = '••••••••'

interface IntegrationConfigEditorProps {
  initialConfig: Record<string, string>
}

const keyLabels: Record<string, { label: string; placeholder: string; secret?: boolean }> = {
  [INTEGRATION_KEYS.paypal_client_id]: { label: 'PayPal Client ID', placeholder: 'AX...' },
  [INTEGRATION_KEYS.paypal_client_secret]: { label: 'PayPal Client Secret', placeholder: '••••••••', secret: true },
  [INTEGRATION_KEYS.paypal_api_base]: { label: 'PayPal API Base', placeholder: 'https://api-m.sandbox.paypal.com' },
  [INTEGRATION_KEYS.flutterwave_public_key]: { label: 'Flutterwave Public Key', placeholder: 'FLWPUBK_...' },
  [INTEGRATION_KEYS.stripe_publishable_key]: { label: 'Stripe Publishable Key', placeholder: 'pk_test_...' },
  [INTEGRATION_KEYS.stripe_secret_key]: { label: 'Stripe Secret Key', placeholder: '••••••••', secret: true },
  [INTEGRATION_KEYS.stripe_webhook_secret]: { label: 'Stripe Webhook Secret', placeholder: 'whsec_...', secret: true },
  [INTEGRATION_KEYS.google_places_api_key]: { label: 'Google Places API Key', placeholder: '••••••••', secret: true },
  [INTEGRATION_KEYS.resend_api_key]: { label: 'Resend API Key', placeholder: 're_...', secret: true },
  [INTEGRATION_KEYS.resend_from_domain]: { label: 'Resend From Domain', placeholder: 'onboarding@resend.dev' },
  [INTEGRATION_KEYS.resend_from_name]: { label: 'Resend From Name', placeholder: 'Chosen Arrows Foundation' },
  [INTEGRATION_KEYS.mentor_notification_email]: { label: 'Mentor Notification Email', placeholder: 'info@chosenarrows.org' },
}

export default function IntegrationConfigEditor({ initialConfig }: IntegrationConfigEditorProps) {
  const [config, setConfig] = useState<Record<string, string>>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const updates: Record<string, string> = {}
      for (const [key, value] of Object.entries(config)) {
        if (value === MASK) continue
        updates[key] = value
      }
      const result = await updateIntegrationConfig(updates)
      if (result.success) {
        toast.success('API & Integrations saved', {
          description: 'Configuration is secure and will be used by payments and notifications.',
        })
      } else {
        toast.error('Failed to save', { description: 'error' in result ? result.error : 'Unknown error' })
      }
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-muted-foreground" />
          <CardTitle>API & Integrations</CardTitle>
        </div>
        <CardDescription>
          Configure API keys and payment methods in one place. Values are stored securely and never exposed to the client except public keys (e.g. PayPal Client ID). Leave a field blank to keep the current value.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="payments" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>

            <TabsContent value="payments" className="space-y-4 mt-6">
              <div className="rounded-lg border border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/50 p-4 space-y-4">
                <h4 className="font-medium text-sm">PayPal</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={INTEGRATION_KEYS.paypal_client_id}>{keyLabels[INTEGRATION_KEYS.paypal_client_id].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.paypal_client_id}
                      value={config[INTEGRATION_KEYS.paypal_client_id] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.paypal_client_id, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.paypal_client_id].placeholder}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={INTEGRATION_KEYS.paypal_client_secret}>{keyLabels[INTEGRATION_KEYS.paypal_client_secret].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.paypal_client_secret}
                      type="password"
                      value={config[INTEGRATION_KEYS.paypal_client_secret] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.paypal_client_secret, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.paypal_client_secret].placeholder}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={INTEGRATION_KEYS.paypal_api_base}>{keyLabels[INTEGRATION_KEYS.paypal_api_base].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.paypal_api_base}
                      value={config[INTEGRATION_KEYS.paypal_api_base] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.paypal_api_base, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.paypal_api_base].placeholder}
                    />
                    <p className="text-xs text-muted-foreground">Use sandbox URL for testing, production URL for live.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-4">
                <h4 className="font-medium text-sm">Flutterwave (Card & M-Pesa)</h4>
                <div className="space-y-2">
                  <Label htmlFor={INTEGRATION_KEYS.flutterwave_public_key}>{keyLabels[INTEGRATION_KEYS.flutterwave_public_key].label}</Label>
                  <Input
                    id={INTEGRATION_KEYS.flutterwave_public_key}
                    value={config[INTEGRATION_KEYS.flutterwave_public_key] ?? ''}
                    onChange={(e) => handleChange(INTEGRATION_KEYS.flutterwave_public_key, e.target.value)}
                    placeholder={keyLabels[INTEGRATION_KEYS.flutterwave_public_key].placeholder}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-4">
                <h4 className="font-medium text-sm">Stripe (optional)</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={INTEGRATION_KEYS.stripe_publishable_key}>{keyLabels[INTEGRATION_KEYS.stripe_publishable_key].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.stripe_publishable_key}
                      value={config[INTEGRATION_KEYS.stripe_publishable_key] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.stripe_publishable_key, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.stripe_publishable_key].placeholder}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={INTEGRATION_KEYS.stripe_secret_key}>{keyLabels[INTEGRATION_KEYS.stripe_secret_key].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.stripe_secret_key}
                      type="password"
                      value={config[INTEGRATION_KEYS.stripe_secret_key] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.stripe_secret_key, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.stripe_secret_key].placeholder}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={INTEGRATION_KEYS.stripe_webhook_secret}>{keyLabels[INTEGRATION_KEYS.stripe_webhook_secret].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.stripe_webhook_secret}
                      type="password"
                      value={config[INTEGRATION_KEYS.stripe_webhook_secret] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.stripe_webhook_secret, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.stripe_webhook_secret].placeholder}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="google" className="space-y-4 mt-6">
              <div className="rounded-lg border border-border p-4 space-y-4">
                <h4 className="font-medium text-sm">Google Places API (testimonials)</h4>
                <p className="text-sm text-muted-foreground">
                  Used to fetch reviews from your Google Business Profile. Enable Places API (New) in Google Cloud Console.
                </p>
                <div className="space-y-2">
                  <Label htmlFor={INTEGRATION_KEYS.google_places_api_key}>{keyLabels[INTEGRATION_KEYS.google_places_api_key].label}</Label>
                  <Input
                    id={INTEGRATION_KEYS.google_places_api_key}
                    type="password"
                    value={config[INTEGRATION_KEYS.google_places_api_key] ?? ''}
                    onChange={(e) => handleChange(INTEGRATION_KEYS.google_places_api_key, e.target.value)}
                    placeholder={keyLabels[INTEGRATION_KEYS.google_places_api_key].placeholder}
                    autoComplete="new-password"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Also set Google Place ID in the Testimonials tab under Site Settings.</p>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 mt-6">
              <div className="rounded-lg border border-border p-4 space-y-4">
                <h4 className="font-medium text-sm">Resend (mentor application emails)</h4>
                <p className="text-sm text-muted-foreground">
                  Sends a notification when someone submits a mentor application.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={INTEGRATION_KEYS.resend_api_key}>{keyLabels[INTEGRATION_KEYS.resend_api_key].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.resend_api_key}
                      type="password"
                      value={config[INTEGRATION_KEYS.resend_api_key] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.resend_api_key, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.resend_api_key].placeholder}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={INTEGRATION_KEYS.mentor_notification_email}>{keyLabels[INTEGRATION_KEYS.mentor_notification_email].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.mentor_notification_email}
                      type="email"
                      value={config[INTEGRATION_KEYS.mentor_notification_email] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.mentor_notification_email, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.mentor_notification_email].placeholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={INTEGRATION_KEYS.resend_from_domain}>{keyLabels[INTEGRATION_KEYS.resend_from_domain].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.resend_from_domain}
                      value={config[INTEGRATION_KEYS.resend_from_domain] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.resend_from_domain, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.resend_from_domain].placeholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={INTEGRATION_KEYS.resend_from_name}>{keyLabels[INTEGRATION_KEYS.resend_from_name].label}</Label>
                    <Input
                      id={INTEGRATION_KEYS.resend_from_name}
                      value={config[INTEGRATION_KEYS.resend_from_name] ?? ''}
                      onChange={(e) => handleChange(INTEGRATION_KEYS.resend_from_name, e.target.value)}
                      placeholder={keyLabels[INTEGRATION_KEYS.resend_from_name].placeholder}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="help" className="space-y-4 mt-6">
              <div className="rounded-lg border border-muted bg-muted/30 p-4 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Security</p>
                    <p className="text-muted-foreground">
                      Secrets are stored in the database and only used on the server. Public keys (e.g. PayPal Client ID) are exposed to the donate page via a dedicated API; no secret keys are ever sent to the browser.
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  You can still use environment variables (.env.local). Values saved here override env for that key. Leave a field blank when editing to keep the current value (including masked secrets).
                </p>
                <p className="text-muted-foreground">
                  After saving, payment methods and notifications will use this configuration. No redeploy needed.
                </p>
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
                  Save API & Integrations
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
