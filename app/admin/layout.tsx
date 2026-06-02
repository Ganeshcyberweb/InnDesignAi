import { redirect } from "next/navigation"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import UserDropdown from "@/components/user-dropdown"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getAdminActor } from "@/lib/admin/guard"
import { formatRole } from "@/lib/auth/roles"

/**
 * Server-side gate for the whole /admin area. Middleware already protects
 * /admin* (admin/super_admin only) — this is the defense-in-depth layer that
 * also resolves the actor's role so the sidebar can render super-admin-only UI.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const actor = await getAdminActor()
  if (!actor) {
    // Should be unreachable because of middleware, but fail-closed.
    redirect("/dashboard")
  }

  return (
    <SidebarProvider>
      <AdminSidebar role={actor.role} />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 border-b">
          <SidebarTrigger className="-ms-2" />
          <div className="ml-2 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Admin</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-medium">
              {formatRole(actor.role)}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <UserDropdown />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
