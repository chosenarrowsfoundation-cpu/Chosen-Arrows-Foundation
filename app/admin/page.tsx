import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'

export default async function AdminPage() {
  const { user, error } = await checkAdminAuth()

  if (error || !user) {
    redirect('/admin/login')
  }

  redirect('/admin/dashboard')
}
