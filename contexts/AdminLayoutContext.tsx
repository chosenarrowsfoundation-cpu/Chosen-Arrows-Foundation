'use client'

import { createContext, useContext, ReactNode } from 'react'

interface AdminLayoutContextType {
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  mainContentClassName: string
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined)

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
  // Sidebar is always expanded (not collapsed)
  const isSidebarCollapsed = false
  const setSidebarCollapsed = () => {} // No-op

  // Sidebar width 352px (320 + 10%)
  const mainContentClassName = 'lg:pl-[352px]'

  return (
    <AdminLayoutContext.Provider value={{ 
      isSidebarCollapsed, 
      setSidebarCollapsed,
      mainContentClassName 
    }}>
      {children}
    </AdminLayoutContext.Provider>
  )
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext)
  if (context === undefined) {
    throw new Error('useAdminLayout must be used within an AdminLayoutProvider')
  }
  return context
}
