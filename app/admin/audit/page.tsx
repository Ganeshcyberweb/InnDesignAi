"use client"

import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AuditEntry {
  id: string
  actorId: string | null
  actorRole: string | null
  actorEmail: string | null
  action: string
  entityType: string | null
  entityId: string | null
  before: unknown
  after: unknown
  ipAddress: string | null
  createdAt: string
}

interface AuditResponse {
  page: number
  pageSize: number
  total: number
  totalPages: number
  entries: AuditEntry[]
}

export default function AdminAuditPage() {
  const [action, setAction] = useState("")
  const [appliedAction, setAppliedAction] = useState("")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AuditResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAudit = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (appliedAction.trim()) params.set("action", appliedAction.trim())
      const res = await fetch(`/api/admin/audit?${params.toString()}`, { credentials: "include" })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `Failed (${res.status})`)
      }
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit log")
    } finally {
      setLoading(false)
    }
  }, [page, appliedAction])

  useEffect(() => {
    fetchAudit()
  }, [fetchAudit])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Audit log</h1>
        <p className="text-sm text-muted-foreground">
          Record of admin actions &mdash; role changes, suspensions, and more.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Activity</CardTitle>
            <CardDescription>{data ? `${data.total} entries` : "Loading…"}</CardDescription>
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              setPage(1)
              setAppliedAction(action)
            }}
          >
            <div className="space-y-1">
              <Label className="text-xs">Filter by action (e.g. user.suspend)</Label>
              <Input
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="user.suspend"
                className="w-[220px]"
              />
            </div>
            <Button type="submit" size="sm" variant="outline">Apply</Button>
            {appliedAction && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAction("")
                  setAppliedAction("")
                  setPage(1)
                }}
              >
                Clear
              </Button>
            )}
          </form>
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
          ) : data && data.entries.length > 0 ? (
            <div className={cn("overflow-x-auto", loading && "opacity-60")}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-6 py-3">When</th>
                    <th className="px-3 py-3">Actor</th>
                    <th className="px-3 py-3">Action</th>
                    <th className="px-3 py-3">Target</th>
                    <th className="px-3 py-3">Change</th>
                    <th className="px-3 py-3">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {data.entries.map((e) => (
                    <tr key={e.id} className="border-b last:border-b-0 align-top">
                      <td className="px-6 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(e.createdAt), "MMM d, yyyy HH:mm")}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium">{e.actorEmail || "—"}</div>
                        {e.actorRole && (
                          <div className="text-xs text-muted-foreground">{e.actorRole}</div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                          <ShieldCheck className="h-3 w-3" /> {e.action}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {e.entityType ? (
                          <>
                            <div>{e.entityType}</div>
                            {e.entityId && <div className="font-mono text-[11px]">{e.entityId.slice(0, 8)}…</div>}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-3 text-xs">
                        <ChangeCell before={e.before} after={e.after} />
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{e.ipAddress || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No audit entries yet. They&apos;ll appear here as admins make changes.
            </div>
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
    </div>
  )
}

function ChangeCell({ before, after }: { before: unknown; after: unknown }) {
  if (before == null && after == null) return <span className="text-muted-foreground">—</span>
  return (
    <pre className="whitespace-pre-wrap break-all rounded bg-muted px-2 py-1 text-[11px] leading-snug">
      {before != null ? `before: ${stringifyShort(before)}\n` : ""}
      {after != null ? `after:  ${stringifyShort(after)}` : ""}
    </pre>
  )
}

function stringifyShort(v: unknown): string {
  try {
    const s = JSON.stringify(v)
    return s.length > 160 ? `${s.slice(0, 160)}…` : s
  } catch {
    return String(v)
  }
}
