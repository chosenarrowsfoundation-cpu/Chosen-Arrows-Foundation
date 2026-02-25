import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { redirect } from 'next/navigation'
import AuditLogViewer from '@/components/admin/AuditLogViewer'

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: { table?: string; user?: string; page?: string }
}) {
  const { user, error } = await checkAdminAuth()
  if (error || !user) {
    redirect('/admin/login')
  }

  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('content_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (searchParams.table) {
    query = query.eq('table_name', searchParams.table)
  }

  if (searchParams.user) {
    query = query.eq('user_id', searchParams.user)
  }

  const { data: logs, error: logsError } = await query

  // Get unique tables and users for filters
  const { data: allLogs } = await supabase
    .from('content_audit_log')
    .select('table_name, user_id')
    .limit(1000)

  const uniqueTables = Array.from(new Set(allLogs?.map(l => l.table_name) || []))
  const uniqueUserIds = Array.from(new Set(allLogs?.map(l => l.user_id).filter(Boolean) || []))

  // Get user info - we'll show user IDs for now
  // In production, you might want to create a database view or function
  // to join with auth.users to get emails
  const users = uniqueUserIds.map(id => ({ id, email: id.slice(0, 8) + '...' }))

  return (
    <div className="space-y-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Audit Log</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          View all content changes and modifications
        </p>
      </div>

      <AuditLogViewer
        initialLogs={logs || []}
        tables={uniqueTables}
        users={users || []}
        currentFilters={{
          table: searchParams.table,
          user: searchParams.user,
        }}
      />
    </div>
  )
}
