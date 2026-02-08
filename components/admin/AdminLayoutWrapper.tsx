'use client'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  // Removed forced dark mode to allow theme toggling
  
  return (
    <div className="min-h-screen w-full bg-background transition-colors duration-300">
      {children}
    </div>
  )
}
