"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

/**
 * Shown when a guest has exhausted their free-trial prompts. Encourages signup
 * (primary) and offers login as a secondary option. The pending prompt is saved
 * by the caller before opening the modal, so the user can resume after auth.
 */
export function GuestLimitModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            You&apos;ve used your free prompts
          </DialogTitle>
          <DialogDescription className="text-center">
            Create a free account to keep generating designs. We&apos;ll save your
            last prompt so you can pick up right where you left off.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex !flex-col gap-2 sm:!flex-col sm:items-stretch">
          <Button asChild className="w-full">
            <Link href="/signup">Sign up &mdash; it&apos;s free</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">I already have an account</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
