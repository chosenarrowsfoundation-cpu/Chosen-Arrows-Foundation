import { getAllDocumentsForAdmin } from '@/app/actions/transparency/get-documents'
import TransparencyDocumentsManager from '@/components/admin/TransparencyDocumentsManager'

export default async function AdminTransparencyPage() {
  const documents = await getAllDocumentsForAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transparency Repository</h1>
        <p className="text-muted-foreground mt-1">
          Manage documents and reports shown on the public transparency page. Add, edit, remove, or reorder any item.
        </p>
      </div>

      <TransparencyDocumentsManager documents={documents} />
    </div>
  )
}
