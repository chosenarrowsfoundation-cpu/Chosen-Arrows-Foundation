import CampaignEditor from '@/components/admin/CampaignEditor'

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Campaign</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the basics below. You can add images, updates, and other languages after saving.
        </p>
      </div>
      <CampaignEditor />
    </div>
  )
}
