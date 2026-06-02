"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Calendar, Download, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ReportType = "per_user" | "per_guest" | "ai_usage" | "conversion"

interface ReportResponse {
  type: ReportType
  from: string
  to: string
  rows: Array<Record<string, string | number>>
}

const REPORT_TYPES: Array<{ value: ReportType; label: string }> = [
  { value: "per_user", label: "Per-user activity (prompts, images, tokens)" },
  { value: "per_guest", label: "Per-guest sessions (usage, conversion)" },
  { value: "ai_usage", label: "AI usage by day (generations + tokens)" },
  { value: "conversion", label: "Guest -> user conversion by day" },
]

const PRESETS: Array<{ value: string; label: string; days: number | null }> = [
  { value: "today", label: "Today", days: 0 },
  { value: "yesterday", label: "Yesterday", days: -1 },
  { value: "7d", label: "Last 7 days", days: 6 },
  { value: "30d", label: "Last 30 days", days: 29 },
  { value: "90d", label: "Last 3 months", days: 89 },
  { value: "180d", label: "Last 6 months", days: 179 },
  { value: "365d", label: "Last year", days: 364 },
  { value: "custom", label: "Custom range", days: null },
]

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

function rangeForPreset(value: string): { from: string; to: string } {
  const today = todayIso()
  const preset = PRESETS.find((p) => p.value === value)
  if (!preset) return { from: isoDaysAgo(29), to: today }
  if (preset.value === "today") return { from: today, to: today }
  if (preset.value === "yesterday") {
    const y = isoDaysAgo(1)
    return { from: y, to: y }
  }
  if (preset.days === null) return { from: isoDaysAgo(29), to: today }
  return { from: isoDaysAgo(preset.days), to: today }
}

function toCsv(rows: Array<Record<string, string | number>>): string {
  if (rows.length === 0) return ""
  const headers = Object.keys(rows[0])
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const body = rows.map((r) => headers.map((h) => escape(r[h])).join(",")).join("\n")
  return `${headers.join(",")}\n${body}`
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function AdminReportsPage() {
  const [type, setType] = useState<ReportType>("per_user")
  const [preset, setPreset] = useState("30d")
  const [{ from, to }, setRange] = useState(rangeForPreset("30d"))
  const [data, setData] = useState<ReportResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // When the preset changes, snap the from/to to the preset's range.
  const onPresetChange = (val: string) => {
    setPreset(val)
    if (val !== "custom") setRange(rangeForPreset(val))
  }

  const fetchReport = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ type, from, to })
      const res = await fetch(`/api/admin/reports?${params.toString()}`, {
        credentials: "include",
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `Failed (${res.status})`)
      }
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run report")
    } finally {
      setLoading(false)
    }
  }, [type, from, to])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const headers = useMemo(() => (data && data.rows.length ? Object.keys(data.rows[0]) : []), [data])

  const onExport = () => {
    if (!data || data.rows.length === 0) {
      toast.error("Nothing to export yet")
      return
    }
    const csv = toCsv(data.rows)
    downloadCsv(`${data.type}_${data.from}_to_${data.to}.csv`, csv)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Date-ranged exports of activity, AI usage, and conversion.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <Label className="text-xs">Report</Label>
              <Select value={type} onValueChange={(v) => setType(v as ReportType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Date range</Label>
              <Select value={preset} onValueChange={onPresetChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">From</Label>
              <Input
                type="date"
                value={from}
                max={to}
                disabled={preset !== "custom"}
                onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To</Label>
              <Input
                type="date"
                value={to}
                min={from}
                max={todayIso()}
                disabled={preset !== "custom"}
                onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={onExport} variant="outline" size="sm" disabled={!data || data.rows.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
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
          ) : data && data.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    {headers.map((h) => (
                      <th key={h} className="px-6 py-3">{prettyHeader(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      {headers.map((h) => (
                        <td key={h} className="px-6 py-2 tabular-nums">
                          {row[h] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              <Calendar className="mx-auto mb-2 h-6 w-6" />
              No data in this range.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function prettyHeader(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}
