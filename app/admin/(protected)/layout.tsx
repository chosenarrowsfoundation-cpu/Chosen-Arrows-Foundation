import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user: adminUser, error } = await checkAdminAuth()

  if (error || !adminUser) {
    redirect('/admin/login')
  }

  return (
    <AdminLayoutWrapper>
      <AdminLayoutClient user={adminUser}>{children}</AdminLayoutClient>
    </AdminLayoutWrapper>
  )
}