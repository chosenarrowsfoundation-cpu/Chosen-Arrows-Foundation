import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminMainContent from '@/components/admin/AdminMainContent'
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper'
import { AdminLayoutProvider } from '@/contexts/AdminLayoutContext'

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
      <AdminLayoutProvider>
        <AdminSidebar />
        <AdminMainContent user={adminUser}>
          {children}
        </AdminMainContent>
      </AdminLayoutProvider>
    </AdminLayoutWrapper>
  )
}