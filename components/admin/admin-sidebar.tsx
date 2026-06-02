"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RiBarChart2Line,
  RiGroupLine,
  RiFileChart2Line,
  RiShieldCheckLine,
  RiHome5Line,
  RiArrowGoBackLine,
} from "@remixicon/react"

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
} from "@/components/ui/sidebar"
import { type AppRole, isSuperAdmin } from "@/lib/auth/roles"
import type { RemixiconComponentType } from "@remixicon/react"

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: AppRole
}

interface NavItem {
  title: string
  url: string
  icon: RemixiconComponentType
  /** When true, only match the exact pathname (no sub-routes). */
  exact?: boolean
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const ADMIN_NAV: NavGroup[] = [
  {
    title: "Admin",
    items: [
      { title: "Overview", url: "/admin", icon: RiBarChart2Line, exact: true },
      { title: "Users", url: "/admin/users", icon: RiGroupLine },
      { title: "Reports", url: "/admin/reports", icon: RiFileChart2Line },
      { title: "Audit log", url: "/admin/audit", icon: RiShieldCheckLine },
    ],
  },
  {
    title: "Back to app",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: RiArrowGoBackLine, exact: true },
      { title: "Home", url: "/", icon: RiHome5Line, exact: true },
    ],
  },
]

export function AdminSidebar({ role, ...props }: AdminSidebarProps) {
  const pathname = usePathname()
  const superAdmin = isSuperAdmin(role)

  return (
    <Sidebar {...props} className="dark border-sidebar-border bg-sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/admin"
              aria-label="InnDesign admin home"
              className="flex items-center gap-3 px-2 py-2 rounded-md transition-colors hover:bg-sidebar-accent/50"
            >
              <div className="flex aspect-square size-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
                ID
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="text-sm font-medium text-sidebar-foreground">
                  InnDesign Admin
                </span>
                <span className="text-[11px] text-sidebar-foreground/60">
                  {superAdmin ? "Super Admin" : "Administrator"}
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {ADMIN_NAV.slice(0, 1).map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.url
                    : pathname === item.url || pathname?.startsWith(`${item.url}/`)
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="group/menu-button font-medium gap-3 h-9 rounded-md text-sidebar-foreground data-[active=true]:hover:bg-transparent data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto data-[active=true]:text-white"
                      >
                        <Link href={item.url}>
                          <item.icon
                            className="text-sidebar-foreground/70 group-data-[active=true]/menu-button:text-white"
                            size={22}
                            aria-hidden="true"
                          />
                          <span className="group-data-[active=true]/menu-button:text-white">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {ADMIN_NAV.slice(1).map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      className="font-medium gap-3 h-9 rounded-md text-sidebar-foreground [&>svg]:size-auto"
                    >
                      <Link href={item.url}>
                        <item.icon
                          className="text-sidebar-foreground/70"
                          size={22}
                          aria-hidden="true"
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarFooter>
    </Sidebar>
  )
}
