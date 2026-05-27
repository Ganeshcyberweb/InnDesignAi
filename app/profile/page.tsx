"use client"

import Link from "next/link"
import { format } from "date-fns"
import {
  ArrowLeft,
  Home,
  Mail,
  Building2,
  Shield,
  User as UserIcon,
  CalendarDays,
  BadgeCheck,
  Settings,
  Loader2,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth/context"
import { normalizeRole, formatRole } from "@/lib/auth/roles"

function roleIcon(role?: string) {
  switch (normalizeRole(role)) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return <Shield className="h-3.5 w-3.5" />
    default:
      return <UserIcon className="h-3.5 w-3.5" />
  }
}

function safeFormatDate(value?: string) {
  if (!value) return "—"
  const date = new Date(value)
  return isNaN(date.getTime()) ? "—" : format(date, "MMMM d, yyyy")
}

export default function ProfilePage() {
  const { user, loading } = useAuth()

  const profile = user?.profile
  const displayName = profile?.name || user?.email?.split("@")[0] || "User"
  const avatarFallback = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>You&apos;re signed out</CardTitle>
              <CardDescription>Sign in to view your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || ""} alt={displayName} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-medium">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold truncate">{displayName}</h1>
                <p className="text-muted-foreground truncate">{user.email}</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-medium">
                  {roleIcon(profile?.role)}
                  {formatRole(profile?.role)}
                </span>
              </div>
              <Button asChild variant="outline">
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit profile
                </Link>
              </Button>
            </div>

            {/* Account details */}
            <Card>
              <CardHeader>
                <CardTitle>Account details</CardTitle>
                <CardDescription>Your personal information and account status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow icon={<UserIcon className="h-4 w-4" />} label="Full name" value={profile?.name || "Not set"} />
                <Separator />
                <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email || "—"} />
                <Separator />
                <DetailRow
                  icon={<Building2 className="h-4 w-4" />}
                  label="Company"
                  value={profile?.company || "Not set"}
                />
                <Separator />
                <DetailRow
                  icon={<Shield className="h-4 w-4" />}
                  label="Role"
                  value={formatRole(profile?.role)}
                />
                <Separator />
                <DetailRow
                  icon={<BadgeCheck className="h-4 w-4" />}
                  label="Email verified"
                  value={user.email_verified ? "Verified" : "Not verified"}
                />
                <Separator />
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Member since"
                  value={safeFormatDate(user.created_at)}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground text-right truncate max-w-[60%]">{value}</span>
    </div>
  )
}
