import { getMentorApplications } from '@/app/actions/mentorship/get-applications'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Users, Mail, Phone, Briefcase, Calendar } from 'lucide-react'

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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7" />
            Mentor Applications
          </h1>
          <p className="text-muted-foreground">
            {applications.length} application{applications.length !== 1 ? 's' : ''} received
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No mentor applications yet.
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {app.first_name} {app.last_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Applied {format(new Date(app.created_at), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  <Badge variant={app.status === 'pending' ? 'secondary' : 'outline'}>
                    {app.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href={`mailto:${app.email}`}
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {app.email}
                  </a>
                  {app.phone && (
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {app.phone}
                    </span>
                  )}
                  {app.occupation && (
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {app.occupation}
                    </span>
                  )}
                </div>
                {app.why_mentor && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Why mentor?</p>
                    <p className="text-sm whitespace-pre-wrap">{app.why_mentor}</p>
                  </div>
                )}
                {app.skills_expertise && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Skills & expertise</p>
                    <p className="text-sm whitespace-pre-wrap">{app.skills_expertise}</p>
                  </div>
                )}
                {app.availability && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 shrink-0" />
                    <p className="text-sm whitespace-pre-wrap">{app.availability}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
