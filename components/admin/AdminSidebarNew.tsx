'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Flag,
  Settings,
  LogOut,
  ExternalLink,
  BookOpen,
  Users,
  ShieldCheck,
  LayoutTemplate,
  Image as ImageIcon,
} from 'lucide-react'
import { adminLogout } from '@/app/actions/auth/admin-login'
import logo from '@/assets/logo.jpg'

interface NavItem {
  name: string
  href: string
  icon: typeof LayoutDashboard
  external?: boolean
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Content', href: '/admin/content/sections', icon: LayoutTemplate },
  { name: 'Campaigns', href: '/admin/campaigns', icon: Flag },
  { name: 'Mentor Applications', href: '/admin/mentors', icon: Users },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
  { name: 'Transparency', href: '/admin/transparency', icon: ShieldCheck },
  { name: 'Media', href: '/admin/media', icon: ImageIcon },
  { name: 'View Site', href: '/', icon: ExternalLink, external: true },
]

const accountNavigation: NavItem[] = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebarNew() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" side="left" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden">
            <Image src={logo} alt="Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm text-sidebar-foreground truncate">
              Chosen Arrows
            </span>
            <span className="text-xs text-sidebar-foreground/60">Admin</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (pathname?.startsWith(item.href + '/') && item.href !== '/')

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{item.name}</span>
                        {item.external && (
                          <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground/50" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavigation.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href || pathname?.startsWith(item.href + '/')

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link href={item.href}>
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <form action={adminLogout} className="w-full">
          <button
            type="submit"
            className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>svg]:size-5 [&>svg]:shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
