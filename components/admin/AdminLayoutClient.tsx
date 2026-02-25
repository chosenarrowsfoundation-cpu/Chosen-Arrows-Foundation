'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AdminSidebarNew } from './AdminSidebarNew'
import AdminHeader from './AdminHeader'

interface AdminLayoutClientProps {
  user: { role: string; full_name: string | null }
  children: React.ReactNode
}

export function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  return (
    <SidebarProvider>
      <AdminSidebarNew />
      <SidebarInset>
        <AdminHeader user={user} />
        <div className="flex flex-1 flex-col min-h-0 min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10 bg-background overflow-y-auto overflow-x-hidden">
          <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full max-w-[1800px] mx-auto space-y-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
