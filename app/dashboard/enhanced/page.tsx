'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/lib/auth/context'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import {
  BarChart3,
  Filter,
  Search,
  Plus,
  Sparkles,
  TrendingUp,
  Star,
  Download,
  Share2,
  Eye,
  Settings,
  Palette,
  Home
} from 'lucide-react'

import { DesignHistory } from '@/components/generate/design-history'
import { DesignFilters } from '@/components/generate/design-filters'
import { DesignSearch } from '@/components/generate/design-search'
import { DesignStats } from '@/components/generate/design-stats'
import { DesignGallery } from '@/components/generate/design-gallery'
import { ShareDesign } from '@/components/generate/share-design'

import type {
  DesignWithRelations,
  DesignFilter,
  DesignStats as StatsType,
  DesignShare
} from '@/app/types/design'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function EnhancedDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [designs, setDesigns] = useState<DesignWithRelations[]>([])
  const [filteredDesigns, setFilteredDesigns] = useState<DesignWithRelations[]>([])
  const [designStats, setDesignStats] = useState<StatsType | null>(null)
  const [filters, setFilters] = useState<DesignFilter>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDesign, setSelectedDesign] = useState<DesignWithRelations | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load user designs and stats
  useEffect(() => {
    if (!user) return

    const loadDashboardData = async () => {
      try {
        setLoading(true)

        // Load designs
        const designsResponse = await fetch('/api/designs')
        if (designsResponse.ok) {
          const designsData = await designsResponse.json()
          setDesigns(designsData.designs)
          setFilteredDesigns(designsData.designs)
        }

        // Load stats
        const statsResponse = await fetch('/api/user/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setDesignStats(statsData.stats)
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  // Apply filters and search
  useEffect(() => {
    let filtered = designs

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(design => {
        const promptMatch = design.input_prompt?.toLowerCase().includes(query)
        const roomMatch = design.preferences?.room_type?.toLowerCase().includes(query)
        const styleMatch = design.preferences?.style_preference?.toLowerCase().includes(query)
        return promptMatch || roomMatch || styleMatch
      })
    }

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(design => filters.status!.includes(design.status))
    }

    if (filters.room_type && filters.room_type.length > 0) {
      filtered = filtered.filter(design =>
        design.preferences?.room_type && filters.room_type!.includes(design.preferences.room_type)
      )
    }

    if (filters.style_preference && filters.style_preference.length > 0) {
      filtered = filtered.filter(design =>
        design.preferences?.style_preference && filters.style_preference!.includes(design.preferences.style_preference)
      )
    }

    if (filters.date_range) {
      filtered = filtered.filter(design => {
        const designDate = new Date(design.created_at)
        const start = filters.date_range!.start
        const end = filters.date_range!.end

        if (start && designDate < start) return false
        if (end && designDate > end) return false
        return true
      })
    }

    if (filters.budget_range) {
      filtered = filtered.filter(design => {
        const budget = design.preferences?.budget
        if (!budget) return true
        return budget >= filters.budget_range!.min && budget <= filters.budget_range!.max
      })
    }

    if (filters.rating_min) {
      filtered = filtered.filter(design => {
        if (design.feedback.length === 0) return false
        const avgRating = design.feedback.reduce((sum, f) => sum + f.rating, 0) / design.feedback.length
        return avgRating >= filters.rating_min!
      })
    }

    setFilteredDesigns(filtered)
  }, [designs, searchQuery, filters])

  const handleDesignSelect = (design: DesignWithRelations) => {
    setSelectedDesign(design)
    setActiveTab('gallery')
  }

  const handleShare = (design: DesignWithRelations) => {
    setSelectedDesign(design)
    setShowShareDialog(true)
  }

  const handleCreateShareLink = async (shareData: Partial<DesignShare>): Promise<DesignShare> => {
    const response = await fetch('/api/designs/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shareData)
    })

    if (!response.ok) {
      throw new Error('Failed to create share link')
    }

    return response.json()
  }

  const handleFavorite = async (designId: string) => {
    try {
      await fetch(`/api/designs/${designId}/favorite`, {
        method: 'POST'
      })
      // Refresh designs
    } catch (error) {
      console.error('Error favoriting design:', error)
    }
  }

  const handleDownload = async (designId: string) => {
    try {
      const response = await fetch(`/api/designs/${designId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `design-${designId}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading design:', error)
    }
  }

  const resetFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please sign in to view your dashboard.</p>
          <Button asChild>
            <a href="/auth/signin">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Palette className="h-8 w-8 text-primary" />
              <span>Design Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your AI-generated interior designs
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Button asChild>
              <a href="/generate" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Design</span>
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="space-y-4">
          <DesignSearch
            designs={designs}
            onSearch={setSearchQuery}
            onSuggestionSelect={(suggestion) => {
              setSearchQuery(suggestion.text)
            }}
            value={searchQuery}
          />

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <DesignFilters
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Designs</CardDescription>
                    <CardTitle className="text-3xl">{designs.length}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>+12% this month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Avg. Rating</CardDescription>
                    <CardTitle className="text-3xl">
                      {designStats?.average_rating?.toFixed(1) || '0.0'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(designStats?.average_rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Spent</CardDescription>
                    <CardTitle className="text-3xl">
                      ${designStats?.total_spent?.toFixed(2) || '0.00'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Budget tracking</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Designs */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Designs</CardTitle>
                  <CardDescription>Your latest AI-generated designs</CardDescription>
                </CardHeader>
                <CardContent>
                  <DesignGallery
                    designs={filteredDesigns.slice(0, 6)}
                    onDesignSelect={handleDesignSelect}
                    onRegenerate={() => {}}
                    onSave={handleFavorite}
                    onShare={handleShare}
                    layout="grid"
                    showMetadata={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Design Gallery</CardTitle>
                  <CardDescription>
                    All your designs ({filteredDesigns.length} of {designs.length})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDesign ? (
                    <DesignGallery
                      designs={[selectedDesign]}
                      onDesignSelect={handleDesignSelect}
                      onRegenerate={() => {}}
                      onSave={handleFavorite}
                      onShare={handleShare}
                      layout="detailed"
                      showMetadata={true}
                    />
                  ) : (
                    <DesignGallery
                      designs={filteredDesigns}
                      onDesignSelect={handleDesignSelect}
                      onRegenerate={() => {}}
                      onSave={handleFavorite}
                      onShare={handleShare}
                      layout="grid"
                      showMetadata={false}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Design History</CardTitle>
                  <CardDescription>
                    Chronological view of all your designs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DesignHistory
                    designs={filteredDesigns}
                    onDesignSelect={handleDesignSelect}
                    onFavorite={handleFavorite}
                    onDownload={handleDownload}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Insights</CardTitle>
                  <CardDescription>
                    Detailed statistics about your design usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {designStats ? (
                    <DesignStats stats={designStats} loading={false} />
                  ) : (
                    <DesignStats stats={{} as StatsType} loading={true} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Share Dialog */}
      {selectedDesign && (
        <ShareDesign
          design={selectedDesign}
          isOpen={showShareDialog}
          onClose={() => {
            setShowShareDialog(false)
            setSelectedDesign(null)
          }}
          onShareCreate={handleCreateShareLink}
        />
      )}
    </div>
  )
}