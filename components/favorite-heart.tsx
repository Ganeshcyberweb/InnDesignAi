"use client"

import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

interface FavoriteHeartProps {
  designId: string
  themeKey: string
  initialFavorited?: boolean
  className?: string
  /** Show as a small icon (default) or a chip with text. */
  size?: "sm" | "md"
  /** Fired after a successful toggle so the parent can update its cache. */
  onChange?: (favorited: boolean) => void
}

/**
 * Heart toggle for a (design, theme) favourite. Optimistic update — clicks
 * feel instant, server failures revert and surface a toast.
 */
export function FavoriteHeart({
  designId,
  themeKey,
  initialFavorited = false,
  className,
  size = "sm",
  onChange,
}: FavoriteHeartProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [pending, setPending] = useState(false)

  const toggle = async () => {
    if (pending) return
    const next = !favorited
    // Optimistic flip.
    setFavorited(next)
    setPending(true)
    try {
      const res = await fetch(`/api/designs/${designId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ themeKey, favorite: next }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `Failed (${res.status})`)
      }
      onChange?.(next)
    } catch (err) {
      // Revert on failure.
      setFavorited(!next)
      toast.error(err instanceof Error ? err.message : "Couldn't update favourite")
    } finally {
      setPending(false)
    }
  }

  const dims = size === "md" ? "h-9 w-9" : "h-7 w-7"
  const iconSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"

  return (
    <button
      type="button"
      aria-label={favorited ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={favorited}
      title={favorited ? "Saved to favourites" : "Save to favourites"}
      onClick={toggle}
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center rounded-full border bg-background/80 backdrop-blur transition-colors",
        "hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        favorited
          ? "border-rose-300 text-rose-500"
          : "border-border text-muted-foreground hover:text-foreground",
        dims,
        className
      )}
    >
      {pending ? (
        <Loader2 className={cn(iconSize, "animate-spin")} aria-hidden />
      ) : (
        <Heart
          className={cn(iconSize, favorited && "fill-current")}
          aria-hidden
        />
      )}
    </button>
  )
}
