"use client"

import Link from "next/link"
import { Sparkles, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/context"

/**
 * Compact badge that shows how many free guest prompts are left, plus a quick
 * "Sign up" link. Renders nothing for authenticated users.
 */
export function GuestPromptsBadge({ className }: { className?: string }) {
  const { isGuest, guest } = useAuth()
  if (!isGuest || !guest) return null

  const exhausted = guest.promptsRemaining <= 0

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        exhausted
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-primary/20 bg-primary/10 text-primary",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {exhausted ? (
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span>
        {exhausted
          ? "Free prompts used up"
          : `${guest.promptsRemaining} of ${guest.promptLimit} free prompts left`}
      </span>
      <Link
        href="/signup"
        className="ml-1 underline-offset-2 hover:underline"
      >
        Sign up
      </Link>
    </div>
  )
}
