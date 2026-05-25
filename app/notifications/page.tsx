"use client"

import Link from "next/link"
import { ArrowLeft, Home, Bell, BellOff, Settings } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
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
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Updates about your designs, account, and activity will show up here.
          </p>
        </div>

        {/* Empty state */}
        <Card>
          <CardContent className="flex flex-col items-center text-center py-14">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <BellOff className="w-6 h-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-1">You&apos;re all caught up</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              You have no notifications right now. When there&apos;s something new, you&apos;ll find it here.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Notification settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
