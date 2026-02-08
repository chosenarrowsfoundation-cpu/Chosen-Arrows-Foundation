'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Flag,
  Settings,
  LogOut,
  ExternalLink,
  BookOpen,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { adminLogout } from '@/app/actions/auth/admin-login'
import Image from 'next/image'
import logo from '@/assets/logo.jpg'

interface NavItem {
  name: string
  href: string
  icon: typeof LayoutDashboard
  external?: boolean
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/admin/campaigns', icon: Flag },
  { name: 'Mentor Applications', href: '/admin/mentors', icon: Users },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
  { name: 'View Site', href: '/', icon: ExternalLink, external: true },
]

const accountNavigation: NavItem[] = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const NavLink = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
    const Icon = item.icon
    
    return (
      <Link
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        className={cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5',
          'transition-colors duration-150',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary" />
        )}
        
        <Icon className={cn(
          'h-5 w-5 shrink-0',
          isActive ? 'text-primary' : 'text-sidebar-foreground/70'
        )} />
        
        <span className="text-sm font-medium">{item.name}</span>
        {item.external && (
          <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground/50" />
        )}
      </Link>
    )
  }

  return (
    <aside 
      className={cn(
        'hidden lg:flex lg:flex-col',
        'fixed inset-y-0 left-0',
        'bg-sidebar border-r border-sidebar-border',
        'transition-all duration-300 z-[100]',
        'h-screen overflow-y-auto',
        'w-[352px]',
        'shadow-sm',
        'sidebar-scrollbar'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-sidebar-border shrink-0">
        <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden">
          <Image
            src={logo}
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-sidebar-foreground truncate">
            Chosen Arrows
          </span>
          <span className="text-xs text-sidebar-foreground/60">
            Admin
          </span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (pathname?.startsWith(item.href + '/') && item.href !== '/')
            
            return <NavLink key={item.name} item={item} isActive={isActive} />
          })}
        </nav>

        {/* Account section */}
        <div className="border-t border-sidebar-border shrink-0">
          <div className="px-4 pt-4 pb-2">
            <span className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
              Account
            </span>
          </div>
          <nav className="px-3 pb-3 space-y-1">
            {accountNavigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return <NavLink key={item.name} item={item} isActive={isActive} />
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border shrink-0 space-y-2">
          <form action={adminLogout}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start h-10 px-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </aside>
  )
}
