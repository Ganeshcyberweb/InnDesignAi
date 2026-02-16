"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings as SettingsIcon, User, Lock, Palette, Loader2, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface UserProfile {
  name: string | null
  company: string | null
  email: string
}

interface UserPreferences {
  defaultStyle?: string
  defaultViews?: number
  defaultRoomType?: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({ name: "", company: "", email: "" })
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultStyle: "modern",
    defaultViews: 2,
    defaultRoomType: "living-room"
  })
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      setLoading(true)

      // Get current user from Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        toast.error("Failed to load user data")
        return
      }

      // Get profile from database
      const response = await fetch("/api/user/profile")
      const data = await response.json()

      if (data.profile) {
        setProfile({
          name: data.profile.name || "",
          company: data.profile.company || "",
          email: user.email || ""
        })

        // Load preferences if they exist
        if (data.profile.preferences) {
          setPreferences(prev => ({ ...prev, ...data.profile.preferences }))
        }
      } else {
        setProfile({
          name: user.user_metadata?.name || "",
          company: "",
          email: user.email || ""
        })
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveProfile() {
    try {
      setSaving(true)

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          company: profile.company
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePreferences() {
    try {
      setSaving(true)

      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update preferences")
      }

      toast.success("Preferences saved successfully")
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    // Validate passwords
    if (!passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields")
      return
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match")
      return
    }

    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    try {
      setChangingPassword(true)

      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) {
        throw error
      }

      toast.success("Password changed successfully")
      setPasswords({ current: "", new: "", confirm: "" })
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error(error instanceof Error ? error.message : "Failed to change password")
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
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

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <SettingsIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Account Settings</CardTitle>
              </div>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={profile.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  type="text"
                  value={profile.company || ""}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Account Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  variant="outline"
                  className="gap-2"
                >
                  {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Design Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <CardTitle>Design Preferences</CardTitle>
              </div>
              <CardDescription>
                Set default values for new design generations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-style">Default Design Style</Label>
                <Select
                  value={preferences.defaultStyle}
                  onValueChange={(value) => setPreferences({ ...preferences, defaultStyle: value })}
                >
                  <SelectTrigger id="default-style">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="contemporary">Contemporary</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="scandinavian">Scandinavian</SelectItem>
                    <SelectItem value="bohemian">Bohemian</SelectItem>
                    <SelectItem value="traditional">Traditional</SelectItem>
                    <SelectItem value="rustic">Rustic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-views">Number of Views to Generate</Label>
                <Select
                  value={preferences.defaultViews?.toString()}
                  onValueChange={(value) => setPreferences({ ...preferences, defaultViews: parseInt(value) })}
                >
                  <SelectTrigger id="default-views">
                    <SelectValue placeholder="Select number of views" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 views</SelectItem>
                    <SelectItem value="3">3 views</SelectItem>
                    <SelectItem value="4">4 views</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-room">Default Room Type</Label>
                <Select
                  value={preferences.defaultRoomType}
                  onValueChange={(value) => setPreferences({ ...preferences, defaultRoomType: value })}
                >
                  <SelectTrigger id="default-room">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="living-room">Living Room</SelectItem>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="dining-room">Dining Room</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="outdoor">Outdoor Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Need to delete your account? Contact our support team for assistance.
              </p>
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
