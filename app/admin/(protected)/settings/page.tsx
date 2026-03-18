import { getAllSettings } from '@/app/actions/settings/get-settings'
import { getIntegrationConfigForAdmin } from '@/lib/integration-config'
import SiteSettingsEditor from '@/components/admin/SiteSettingsEditor'
import IntegrationConfigEditor from '@/components/admin/IntegrationConfigEditor'
import ManualPaymentEditor from '@/components/admin/ManualPaymentEditor'
import ChangeAdminPasswordForm from '@/components/admin/ChangeAdminPasswordForm'

export default async function SettingsPage() {
  const [settings, integrationConfig] = await Promise.all([
    getAllSettings(),
    getIntegrationConfigForAdmin(),
  ])

  const settingsMap: Record<string, any> = {}
  settings.forEach(setting => {
    settingsMap[setting.setting_key] = setting.setting_value
  })

  const manualPayment = settingsMap.manual_payment_details as { bank?: { bankName?: string; accountName?: string; accountNumber?: string; swiftCode?: string; currency?: string }; mpesa?: { number?: string; name?: string; instructions?: string } } | null

  return (
    <div className="space-y-8">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage site settings and API integrations
        </p>
      </div>

      <ChangeAdminPasswordForm />

      <IntegrationConfigEditor initialConfig={integrationConfig} />

      <ManualPaymentEditor
        initialData={
          manualPayment?.bank && manualPayment?.mpesa
            ? {
                bank: {
                  bankName: manualPayment.bank.bankName ?? '',
                  accountName: manualPayment.bank.accountName ?? '',
                  accountNumber: manualPayment.bank.accountNumber ?? '',
                  swiftCode: manualPayment.bank.swiftCode ?? '',
                  currency: manualPayment.bank.currency ?? '',
                },
                mpesa: {
                  number: manualPayment.mpesa.number ?? '',
                  name: manualPayment.mpesa.name ?? '',
                  instructions: manualPayment.mpesa.instructions ?? '',
                },
              }
            : null
        }
      />

      <SiteSettingsEditor initialSettings={settingsMap} />
    </div>
  )
}
