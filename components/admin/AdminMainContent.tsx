'use client'

import AdminHeader from './AdminHeader'
import { useAdminLayout } from '@/contexts/AdminLayoutContext'

interface AdminMainContentProps {
  children: React.ReactNode
  user: { role: string; full_name: string | null }
}

export default function AdminMainContent({ children, user }: AdminMainContentProps) {
  const { mainContentClassName } = useAdminLayout()
  
  return (
    <main className={`flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out ${mainContentClassName}`}>
      <AdminHeader user={user} />
      <div className="flex-1 w-full p-6 lg:p-8 xl:p-10 bg-background">
        <div className="w-full max-w-[1800px] mx-auto space-y-8">
          {children}
        </div>
      </div>
    </main>
  )
}
