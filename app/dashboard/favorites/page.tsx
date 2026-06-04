"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { AlertCircle, ArrowLeft, Heart, HeartOff, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FavoriteHeart } from "@/components/favorite-heart"
import { normalizeR2Url } from "@/lib/r2-storage"

interface FavoriteItem {
  id: string
  themeKey: string
  themeLabel: string
  favoritedAt: string
  design: {
    id: string
    title: string | null
    prompt: string | null
    roomType: string | null
    createdAt: string
  }
  images: string[]
}

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/designs/favorites", { credentials: "include" })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `Failed (${res.status})`)
      }
      setItems(json.items as FavoriteItem[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load favourites")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const removeFromList = (id: string) =>
    setItems((prev) => prev?.filter((f) => f.id !== id) ?? prev)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 max-w-6xl flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Favourites</h1>
            <p className="text-sm text-muted-foreground">
              Themes you&apos;ve saved across your generations.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle>Couldn&apos;t load favourites</CardTitle>
              <CardDescription className="text-destructive">{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : !items || items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center text-center py-16">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <HeartOff className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold mb-1">No favourites yet</h2>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Tap the heart on any generated theme to save it here for quick
                access later.
              </p>
              <Button asChild>
                <Link href="/dashboard">Generate a design</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((fav) => (
              <FavoriteCard key={fav.id} item={fav} onUnsave={() => removeFromList(fav.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FavoriteCard({ item, onUnsave }: { item: FavoriteItem; onUnsave: () => void }) {
  const previewImage = item.images[0] ? normalizeR2Url(item.images[0]) : null
  const prompt = item.design.prompt?.trim()
  const showPrompt = prompt ? prompt.slice(0, 110) + (prompt.length > 110 ? "…" : "") : "(no description)"

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-muted">
        {previewImage ? (
          <img
            src={previewImage}
            alt={`${item.themeLabel} preview`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            No preview
          </div>
        )}
        <div className="absolute top-2 right-2">
          <FavoriteHeart
            designId={item.design.id}
            themeKey={item.themeKey}
            initialFavorited
            size="md"
            onChange={(favorited) => {
              if (!favorited) onUnsave()
            }}
          />
        </div>
        {item.images.length > 1 && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-black/55 text-white border-0">
              {item.images.length} views
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {item.themeLabel}
          {item.design.roomType && (
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
              {item.design.roomType.replace(/_/g, " ")}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs">{showPrompt}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0 flex items-center justify-between text-xs text-muted-foreground">
        <span>Saved {format(new Date(item.favoritedAt), "MMM d, yyyy")}</span>
        <Link
          href={`/designs/${item.design.id}/history`}
          className="text-primary hover:underline"
        >
          Open design →
        </Link>
      </CardContent>
    </Card>
  )
}
