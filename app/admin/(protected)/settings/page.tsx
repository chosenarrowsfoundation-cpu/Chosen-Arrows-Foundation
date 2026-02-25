import { getAllSettings } from '@/app/actions/settings/get-settings'
import { getIntegrationConfigForAdmin } from '@/lib/integration-config'
import SiteSettingsEditor from '@/components/admin/SiteSettingsEditor'
import IntegrationConfigEditor from '@/components/admin/IntegrationConfigEditor'

export default async function SettingsPage() {
  const [settings, integrationConfig] = await Promise.all([
    getAllSettings(),
    getIntegrationConfigForAdmin(),
  ])

  const settingsMap: Record<string, any> = {}
  settings.forEach(setting => {
    settingsMap[setting.setting_key] = setting.setting_value
  })

  return (
    <div className="space-y-8">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage site settings and API integrations
        </p>
      </div>

      <IntegrationConfigEditor initialConfig={integrationConfig} />

      <SiteSettingsEditor initialSettings={settingsMap} />
    </div>
  )
}
