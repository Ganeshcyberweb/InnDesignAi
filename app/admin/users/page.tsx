"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import {
  Search,
  Loader2,
  MoreHorizontal,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  UserMinus,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatRole, type AppRole } from "@/lib/auth/roles"
import { useAuth } from "@/lib/auth/context"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface AdminUserRow {
  id: string
  userId: string
  name: string | null
  company: string | null
  role: AppRole
  rawRole: string
  avatarUrl: string | null
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  email: string | null
  emailVerified: boolean
}

type Action = "suspend" | "unsuspend" | "promote_admin" | "demote_to_user"

interface PendingAction {
  user: AdminUserRow
  action: Action
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
}

const ROLE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "All roles", value: "all" },
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
]

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
]

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const currentUserId = currentUser?.id ?? null
  const isSuperAdmin = currentUser?.profile?.role === "SUPER_ADMIN"

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const [role, setRole] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{
    users: AdminUserRow[]
    page: number
    pageSize: number
    total: number
    totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [actioning, setActioning] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim())
      if (role !== "all") params.set("role", role)
      if (status !== "all") params.set("status", status)
      params.set("page", String(page))

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: "include",
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `Failed (${res.status})`)
      }
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, role, status, page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Reset to page 1 whenever filters change.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, role, status])

  const runAction = async (target: PendingAction) => {
    setActioning(true)
    try {
      const res = await fetch(`/api/admin/users/${target.user.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: target.action }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `Failed (${res.status})`)
      }
      toast.success(`Done — ${target.title.toLowerCase()}`)
      setPending(null)
      await fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed")
    } finally {
      setActioning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and manage user accounts.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All users</CardTitle>
            <CardDescription>
              {data ? `${data.total} total` : "Loading…"}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-[220px]"
              />
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="px-6 py-12 text-center text-sm text-destructive">
              <AlertCircle className="mx-auto mb-2 h-6 w-6" />
              {error}
            </div>
          ) : loading && !data ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <UsersTable
              rows={data?.users ?? []}
              currentUserId={currentUserId}
              isSuperAdmin={!!isSuperAdmin}
              onAction={setPending}
              loading={loading}
            />
          )}
        </CardContent>
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-3 text-sm">
            <span className="text-muted-foreground">
              Page {data.page} of {data.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
            <AlertDialogDescription>{pending?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actioning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={actioning}
              className={cn(pending?.destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
              onClick={() => pending && runAction(pending)}
            >
              {actioning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {pending?.confirmLabel ?? "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function UsersTable({
  rows,
  currentUserId,
  isSuperAdmin,
  onAction,
  loading,
}: {
  rows: AdminUserRow[]
  currentUserId: string | null
  isSuperAdmin: boolean
  onAction: (action: PendingAction) => void
  loading: boolean
}) {
  if (rows.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-sm text-muted-foreground">
        No users match the current filters.
      </div>
    )
  }

  return (
    <div className={cn("overflow-x-auto", loading && "opacity-60")}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-6 py-3">User</th>
            <th className="px-3 py-3">Role</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Last login</th>
            <th className="px-3 py-3">Joined</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <UserRow
              key={u.userId}
              user={u}
              isSelf={u.userId === currentUserId}
              isSuperAdmin={isSuperAdmin}
              onAction={onAction}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UserRow({
  user,
  isSelf,
  isSuperAdmin,
  onAction,
}: {
  user: AdminUserRow
  isSelf: boolean
  isSuperAdmin: boolean
  onAction: (a: PendingAction) => void
}) {
  const displayName = user.name || user.email?.split("@")[0] || "(no name)"
  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const canSuspend = !isSelf && user.role !== "SUPER_ADMIN"
  const canPromote = isSuperAdmin && user.role === "USER"
  const canDemote = isSuperAdmin && user.role === "ADMIN"
  const hasAnyAction = canSuspend || canPromote || canDemote

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-6 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl || ""} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium">
              {displayName}
              {isSelf && <span className="ml-2 text-[10px] uppercase text-muted-foreground">you</span>}
            </div>
            <div className="truncate text-xs text-muted-foreground">{user.email || "—"}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
          {formatRole(user.role)}
        </span>
      </td>
      <td className="px-3 py-3">
        {user.isActive ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-xs">
            <ShieldCheck className="h-3 w-3" /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-xs">
            <ShieldOff className="h-3 w-3" /> Suspended
          </span>
        )}
      </td>
      <td className="px-3 py-3 text-xs text-muted-foreground">
        {user.lastLogin ? format(new Date(user.lastLogin), "MMM d, yyyy") : "—"}
      </td>
      <td className="px-3 py-3 text-xs text-muted-foreground">
        {format(new Date(user.createdAt), "MMM d, yyyy")}
      </td>
      <td className="px-6 py-3 text-right">
        {hasAnyAction ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {canSuspend && (user.isActive ? (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() =>
                    onAction({
                      user,
                      action: "suspend",
                      title: "Suspend user",
                      description: `Suspend ${displayName}? They won't be able to access the app until you unsuspend them.`,
                      confirmLabel: "Suspend",
                      destructive: true,
                    })
                  }
                >
                  <ShieldOff className="mr-2 h-4 w-4" /> Suspend
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() =>
                    onAction({
                      user,
                      action: "unsuspend",
                      title: "Restore access",
                      description: `Restore access for ${displayName}?`,
                      confirmLabel: "Restore",
                    })
                  }
                >
                  <ShieldCheck className="mr-2 h-4 w-4" /> Unsuspend
                </DropdownMenuItem>
              ))}
              {(canPromote || canDemote) && (canSuspend ? <DropdownMenuSeparator /> : null)}
              {canPromote && (
                <DropdownMenuItem
                  onClick={() =>
                    onAction({
                      user,
                      action: "promote_admin",
                      title: "Promote to Admin",
                      description: `Grant ${displayName} admin access? They'll be able to view analytics and manage users.`,
                      confirmLabel: "Promote",
                    })
                  }
                >
                  <UserCheck className="mr-2 h-4 w-4" /> Promote to admin
                </DropdownMenuItem>
              )}
              {canDemote && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() =>
                    onAction({
                      user,
                      action: "demote_to_user",
                      title: "Demote to User",
                      description: `Remove admin access from ${displayName}?`,
                      confirmLabel: "Demote",
                      destructive: true,
                    })
                  }
                >
                  <UserMinus className="mr-2 h-4 w-4" /> Demote to user
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  )
}
