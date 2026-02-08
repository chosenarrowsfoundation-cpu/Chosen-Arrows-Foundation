'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { 
  Menu,
  X,
  LayoutDashboard,
  Flag,
  Settings,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import { adminLogout } from '@/app/actions/auth/admin-login'
import Image from 'next/image'
import logo from '@/assets/logo.jpg'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: typeof LayoutDashboard
  external?: boolean
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/admin/campaigns', icon: Flag },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
  { name: 'Media', href: '/admin/media', icon: ImageIcon },
  { name: 'View Site', href: '/', icon: ExternalLink, external: true },
]

const accountNavigation: NavItem[] = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className={cn(
          "p-0 w-[352px] sm:w-[374px]",
          "bg-sidebar border-r border-sidebar-border",
          "shadow-xl [&>button]:hidden"
        )}
      >
        <div className="flex flex-col h-full bg-sidebar overflow-hidden">
          <SheetHeader className="px-4 py-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={logo}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <SheetTitle className="text-sm font-semibold text-sidebar-foreground text-left">
                    Chosen Arrows
                  </SheetTitle>
                  <span className="text-xs text-muted-foreground">
                    Admin
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 sidebar-scrollbar">
            <nav className="px-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (pathname?.startsWith(item.href + '/') && item.href !== '/')
                
                return (
                  <SheetClose asChild key={item.name}>
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
                  </SheetClose>
                )
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-sidebar-border mx-3">
              <div className="px-3 pb-2">
                <span className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                  Account
                </span>
              </div>
              <nav className="space-y-1">
                {accountNavigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  
                  return (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
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
                      </Link>
                    </SheetClose>
                  )
                })}
              </nav>
            </div>
          </div>

          <div className="p-3 border-t border-sidebar-border">
            <form action={adminLogout}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start h-10 px-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
