"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, UserCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/context"
import { GUEST_PROMPT_LIMIT } from "@/lib/guest/constants"

/**
 * Renders the "Continue as guest" CTA shown beneath the login & signup forms.
 *
 * Starts a server-tracked guest session (httpOnly cookie + DB row) and routes
 * the user into the app so they can try the AI generation for a limited number
 * of free prompts. If a pending design was saved from the home page, the
 * dashboard's existing auto-trigger will pick it up on arrival.
 */
export function ContinueAsGuestButton({
  redirectTo = "/dashboard",
}: {
  redirectTo?: string
}) {
  const { startGuestSession } = useAuth()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <div className="space-y-3">
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={async () => {
          setPending(true)
          const { error } = await startGuestSession()
          if (error) {
            toast.error(error.message)
            setPending(false)
            return
          }
          router.push(redirectTo)
        }}
      >
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UserCircle2 className="mr-2 h-4 w-4" />
        )}
        Continue as guest
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Try {GUEST_PROMPT_LIMIT} free prompts &mdash; no account needed.
      </p>
    </div>
  )
}
