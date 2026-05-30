"use client"

import { useEffect, useState } from "react"
import {
  Users,
  UserPlus,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  Coins,
  Loader2,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Overview {
  kpis: {
    totalUsers: number
    totalGuests: number
    generations7d: number
    signups7d: number
    failedSignins7d: number
    convertedGuests: number
    conversionPct: number
    tokens7d: number
  }
  series: {
    signups30d: Array<{ date: string; n: number }>
    generations30d: Array<{ date: string; n: number }>
  }
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n)
}

function shortDate(s: string): string {
  // YYYY-MM-DD -> "MMM D" (en-US, no year for chart density)
  const d = new Date(s + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch("/api/admin/overview", { credentials: "include" })
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok || !json.success) {
          throw new Error(json?.error || `Failed (${res.status})`)
        }
        return json as Overview & { success: true }
      })
      .then((json) => {
        if (cancelled) return
        setData({ kpis: json.kpis, series: json.series })
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load overview")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Activity across the platform &mdash; users, guests, generations, conversion.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle>Couldn&apos;t load overview</CardTitle>
            <CardDescription className="text-destructive">{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : data ? (
        <>
          <KpiGrid kpis={data.kpis} />
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Signups (last 30 days)"
              description={`${data.kpis.signups7d} in the past week`}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.series.signups30d}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={shortDate}
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                  <Tooltip
                    labelFormatter={shortDate}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="n"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="AI generations (last 30 days)"
              description={`${data.kpis.generations7d} successful in the past week`}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.series.generations30d}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={shortDate}
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                  <Tooltip
                    labelFormatter={shortDate}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="n" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      ) : null}
    </div>
  )
}

function KpiGrid({ kpis }: { kpis: Overview["kpis"] }) {
  const cards = [
    { label: "Total users", value: kpis.totalUsers, icon: Users, accent: "" },
    { label: "Guest sessions", value: kpis.totalGuests, icon: UserPlus, accent: "" },
    { label: "Generations (7d)", value: kpis.generations7d, icon: Sparkles, accent: "" },
    { label: "Signups (7d)", value: kpis.signups7d, icon: TrendingUp, accent: "" },
    {
      label: "Conversion",
      value: `${kpis.conversionPct}%`,
      icon: TrendingUp,
      accent: "",
      hint: `${kpis.convertedGuests} of ${kpis.totalGuests} guests converted`,
    },
    {
      label: "Tokens used (7d)",
      value: formatNumber(kpis.tokens7d),
      icon: Coins,
      accent: "",
    },
    {
      label: "Failed signins (7d)",
      value: kpis.failedSignins7d,
      icon: ShieldAlert,
      accent: kpis.failedSignins7d > 10 ? "text-destructive" : "",
    },
  ]
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {c.label}
            </CardTitle>
            <c.icon className={cn("h-4 w-4 text-muted-foreground", c.accent)} aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", c.accent)}>
              {typeof c.value === "number" ? formatNumber(c.value) : c.value}
            </div>
            {"hint" in c && c.hint ? (
              <p className="text-xs text-muted-foreground mt-1">{c.hint}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
