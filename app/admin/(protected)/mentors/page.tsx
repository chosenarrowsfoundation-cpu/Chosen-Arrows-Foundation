import { getMentorApplications } from '@/app/actions/mentorship/get-applications'
import MentorApplicationsTable from './MentorApplicationsTable'
import { Suspense } from 'react'

export const metadata = {
  title: 'Mentor Applications | Admin',
  description: 'View mentor applications',
}

export default async function MentorApplicationsPage() {
  const { applications, error } = await getMentorApplications()

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="text-center py-12 text-muted-foreground">Loading applications...</div>
      }
    >
      <MentorApplicationsTable applications={applications} />
    </Suspense>
  )
}
