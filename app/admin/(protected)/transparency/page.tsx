import Link from 'next/link'
import { FileText, ExternalLink, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminTransparencyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transparency Repository</h1>
        <p className="text-muted-foreground mt-1">
          Manage and preview the public transparency page with reports, documents, and impact data
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Public Transparency Page</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            View the public-facing transparency repository that displays annual reports, financial statements, 
            project updates, and governance documents to visitors.
          </p>
          <Button asChild variant="default">
            <Link href="/transparency-repo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              View Transparency Page <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">Documents & Reports</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            The transparency page showcases Impact reports, Financial statements, Project updates, 
            and Governance documents. Document management can be added here in a future update.
          </p>
        </div>
      </div>
    </div>
  )
}
