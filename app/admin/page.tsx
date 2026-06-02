"use client"

import { useEffect, useState } from "react"
import {
  Users,
  UserPlus,
  Sparkles,
  TrendingUp,
  Coins,
  Activity,
  Hash,
  AlertCircle,
  Percent,
  Loader2,
  MessageSquare,
  DollarSign,
  ShieldAlert,
  ArrowRightCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// ----- API payload shapes (mirror app/api/admin/overview/route.ts) -----------

interface OverviewKpis {
  totalUsers: number
  totalInteractions: number
  totalTokens: number
  avgTokensPerUser: number
  dau: number
  signups7d: number
}

interface SeriesPoint {
  date: string
  n: number
}

interface OverviewSection {
  kpis: OverviewKpis
  series: { signups30d: SeriesPoint[]; generations30d: SeriesPoint[] }
}

interface TopUserRow {
  name: string
  email: string | null
  role: string
  prompts: number
  successful_generations: number
  images: number
  tokens: number
  last_active: string | null
}

interface UsersSection {
  topUsers: TopUserRow[]
}

interface GuestKpis {
  totalGuests: number
  active24h: number
  conversions: number
  conversionRate: number // percentage with 1 decimal
  avgPrompts: number
  atLimit: number
  promptLimit: number
}

interface ConversionRow {
  email: string | null
  converted_at: string | null
  prompts_used: number
}

interface GuestsSection {
  kpis: GuestKpis
  recentConversions: ConversionRow[]
}

interface OverviewPayload {
  overview: OverviewSection
  users: UsersSection
  guests: GuestsSection
}

// ----- Formatting helpers ----------------------------------------------------

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n)
}

function shortDate(s: string): string {
  // YYYY-MM-DD -> "Mon D"
  const d = new Date(s + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ----- Page ------------------------------------------------------------------

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewPayload | null>(null)
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
        return json as OverviewPayload & { success: true }
      })
      .then((json) => {
        if (cancelled) return
        setData({ overview: json.overview, users: json.users, guests: json.guests })
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Activity across the platform &mdash; switch tabs for user and guest analytics.
        </p>
      </div>

      {loading && !data ? (
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
        <Tabs defaultValue="overview">
          <TabsList className="bg-muted/60 p-1 h-11 gap-1">
            <TabsTrigger
              value="overview"
              className="px-5 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="px-5 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="guests"
              className="px-5 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Guests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <OverviewTab section={data.overview} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <UsersTab overview={data.overview} users={data.users} />
          </TabsContent>

          <TabsContent value="guests" className="space-y-6 mt-6">
            <GuestsTab section={data.guests} />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  )
}

// ----- Tabs ------------------------------------------------------------------

function OverviewTab({ section }: { section: OverviewSection }) {
  const k = section.kpis
  return (
    <>
      <KpiGrid
        cols={5}
        cards={[
          { label: "Total Users", value: k.totalUsers, icon: Users, hint: "Registered users" },
          { label: "Total Interactions", value: k.totalInteractions, icon: MessageSquare, hint: "AI conversations" },
          { label: "Total Tokens", value: k.totalTokens, icon: DollarSign, hint: "API usage" },
          { label: "Avg. Tokens/User", value: k.avgTokensPerUser, icon: TrendingUp, hint: "Per user average" },
          { label: "Daily Active Users", value: k.dau, icon: Activity, hint: "Last 24 hours" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Signups (last 30 days)"
          description={`${k.signups7d} in the past week`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={section.series.signups30d}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
              <Tooltip labelFormatter={shortDate} contentStyle={{ fontSize: 12 }} />
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

        <ChartCard title="AI generations (last 30 days)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={section.series.generations30d}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
              <Tooltip labelFormatter={shortDate} contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="n" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}

function UsersTab({ overview, users }: { overview: OverviewSection; users: UsersSection }) {
  const k = overview.kpis
  return (
    <>
      <KpiGrid
        cols={4}
        cards={[
          { label: "Total Users", value: k.totalUsers, icon: Users, hint: "Registered users" },
          { label: "Daily Active", value: k.dau, icon: Activity, hint: "Last 24 hours" },
          { label: "Signups (7d)", value: k.signups7d, icon: UserPlus, hint: "Past week" },
          { label: "Total Interactions", value: k.totalInteractions, icon: MessageSquare, hint: "Across all users" },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Most active users (last 30 days)</CardTitle>
          <CardDescription>Ranked by prompt count.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {users.topUsers.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No user activity in the last 30 days yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-6 py-3">User</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3 text-right">Prompts</th>
                    <th className="px-3 py-3 text-right">Successful</th>
                    <th className="px-3 py-3 text-right">Images</th>
                    <th className="px-3 py-3 text-right">Tokens</th>
                    <th className="px-6 py-3">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {users.topUsers.map((u, i) => (
                    <tr key={`${u.email ?? u.name}-${i}`} className="border-b last:border-b-0">
                      <td className="px-6 py-3">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email ?? "—"}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatNumber(u.prompts)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatNumber(u.successful_generations)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatNumber(u.images)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatNumber(u.tokens)}</td>
                      <td className="px-6 py-3 text-xs text-muted-foreground">{u.last_active ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function GuestsTab({ section }: { section: GuestsSection }) {
  const k = section.kpis
  return (
    <>
      <KpiGrid
        cols={6}
        cards={[
          { label: "Total Guests", value: k.totalGuests, icon: Users, hint: "All-time guest sessions" },
          { label: "Active (24h)", value: k.active24h, icon: Activity, hint: "Seen in the last 24h" },
          { label: "Conversions", value: k.conversions, icon: UserPlus, hint: "Guests who signed up" },
          {
            label: "Conversion Rate",
            value: `${k.conversionRate}%`,
            icon: Percent,
            hint: "Signups / total guests",
          },
          { label: "Avg. Prompts", value: k.avgPrompts, icon: Hash, hint: "Per guest session" },
          {
            label: "At Limit",
            value: k.atLimit,
            icon: ShieldAlert,
            hint: `Hit the ${k.promptLimit}-prompt cap`,
            accent: k.atLimit > 0 ? "" : "",
          },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversions ({section.recentConversions.length})</CardTitle>
          <CardDescription>The last 10 guest sessions that signed up.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {section.recentConversions.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No guest conversions yet. They&apos;ll appear here when a guest signs up.
            </div>
          ) : (
            <ul className="divide-y">
              {section.recentConversions.map((c, i) => (
                <li key={`${c.email}-${i}`} className="flex items-center justify-between gap-3 px-6 py-3">
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ArrowRightCircle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{c.email ?? "(unknown)"}</div>
                      <div className="text-xs text-muted-foreground">
                        Used {c.prompts_used} {c.prompts_used === 1 ? "prompt" : "prompts"} as a guest
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {c.converted_at ?? "—"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  )
}

// ----- Shared widgets --------------------------------------------------------

interface KpiCard {
  label: string
  value: number | string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  hint?: string
  accent?: string
}

function KpiGrid({ cols, cards }: { cols: 4 | 5 | 6; cards: KpiCard[] }) {
  const gridCols = {
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  }[cols]

  return (
    <div className={cn("grid gap-4", gridCols)}>
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
            <c.icon className={cn("h-4 w-4 text-muted-foreground", c.accent)} aria-hidden />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", c.accent)}>
              {typeof c.value === "number" ? formatNumber(c.value) : c.value}
            </div>
            {c.hint ? <p className="text-xs text-muted-foreground mt-1">{c.hint}</p> : null}
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
