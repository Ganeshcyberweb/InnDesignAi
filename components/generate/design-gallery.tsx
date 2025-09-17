'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

import {
  Heart,
  Download,
  Share2,
  RotateCcw,
  Eye,
  Grid3X3,
  LayoutGrid,
  Filter,
  SortDesc,
  ChevronDown,
  Star,
  Clock,
  Palette,
  Info
} from 'lucide-react'

import { DesignCard } from './design-card'
import { ImageModal } from './image-modal'
import { ShareDesign } from './share-design'
import { RegenerationModal } from './regeneration-modal'

import type { DesignWithRelations, GenerationRequest } from '@/app/types/design'

interface DesignGalleryProps {
  designs: DesignWithRelations[]
  onRegenerate: (request: GenerationRequest) => void
  onSave: (designId: string) => void
  onShare: (designId: string) => void
  loading?: boolean
}

export function DesignGallery({
  designs,
  onRegenerate,
  onSave,
  onShare,
  loading = false
}: DesignGalleryProps) {
  const [selectedDesign, setSelectedDesign] = useState<DesignWithRelations | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest')
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'recent'>('all')
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [shareDesignId, setShareDesignId] = useState<string | null>(null)
  const [regenerateDesign, setRegenerateDesign] = useState<DesignWithRelations | null>(null)

  const handleImageClick = (design: DesignWithRelations, imageIndex: number = 0) => {
    setSelectedDesign(design)
    setSelectedImageIndex(imageIndex)
  }

  const handleShare = (designId: string) => {
    setShareDesignId(designId)
    setShowShareDialog(true)
    onShare(designId)
  }

  const handleRegenerate = (design: DesignWithRelations) => {
    setRegenerateDesign(design)
    setShowRegenerateDialog(true)
  }

  const handleRegenerateSubmit = (request: GenerationRequest) => {
    onRegenerate(request)
    setShowRegenerateDialog(false)
    setRegenerateDesign(null)
  }

  // Filter and sort designs
  const processedDesigns = designs
    .filter(design => {
      switch (filterBy) {
        case 'favorites':
          return design.feedback.some(f => f.helpful === true)
        case 'recent':
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          return new Date(design.created_at) > oneDayAgo
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'rating':
          const aRating = a.feedback.reduce((acc, f) => acc + f.rating, 0) / (a.feedback.length || 1)
          const bRating = b.feedback.reduce((acc, f) => acc + f.rating, 0) / (b.feedback.length || 1)
          return bRating - aRating
        default: // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="aspect-square">
              <CardContent className="p-0 h-full">
                <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (designs.length === 0) {
    return (
      <div className="text-center py-12">
        <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No designs yet</h3>
        <p className="text-muted-foreground mb-6">
          Generate your first AI-powered interior design to see results here
        </p>
        <Button onClick={() => window.history.back()}>
          <Star className="h-4 w-4 mr-2" />
          Start Generating
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Gallery Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-primary" />
            <span className="font-semibold">
              {processedDesigns.length} Design{processedDesigns.length !== 1 ? 's' : ''}
            </span>
          </div>

          {processedDesigns.length !== designs.length && (
            <Badge variant="outline" className="text-xs">
              {designs.length - processedDesigns.length} filtered
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter */}
          <div className="flex items-center space-x-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="text-sm border rounded px-2 py-1 bg-background"
            >
              <option value="all">All</option>
              <option value="favorites">Favorites</option>
              <option value="recent">Recent</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-1">
            <SortDesc className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border rounded px-2 py-1 bg-background"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center border rounded">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-2"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'masonry' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('masonry')}
              className="h-8 px-2"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Design Grid */}
      <motion.div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'columns-1 md:columns-2 lg:columns-3'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {processedDesigns.map((design) => (
            <motion.div
              key={design.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}
            >
              <DesignCard
                design={design}
                onImageClick={(imageIndex) => handleImageClick(design, imageIndex)}
                onSave={() => onSave(design.id)}
                onShare={() => handleShare(design.id)}
                onRegenerate={() => handleRegenerate(design)}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More */}
      {processedDesigns.length > 12 && (
        <div className="text-center">
          <Button variant="outline">
            <ChevronDown className="h-4 w-4 mr-2" />
            Load More Designs
          </Button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedDesign && (
          <ImageModal
            design={selectedDesign}
            initialImageIndex={selectedImageIndex}
            onClose={() => setSelectedDesign(null)}
            onSave={() => onSave(selectedDesign.id)}
            onShare={() => handleShare(selectedDesign.id)}
            onRegenerate={() => handleRegenerate(selectedDesign)}
          />
        )}
      </AnimatePresence>

      <ShareDesign
        isOpen={showShareDialog}
        onClose={() => {
          setShowShareDialog(false)
          setShareDesignId(null)
        }}
        design={shareDesignId ? designs.find(d => d.id === shareDesignId) || null : null}
      />

      <RegenerationModal
        isOpen={showRegenerateDialog}
        onClose={() => {
          setShowRegenerateDialog(false)
          setRegenerateDesign(null)
        }}
        design={regenerateDesign}
        onRegenerate={handleRegenerateSubmit}
      />

      {/* Gallery Stats */}
      {processedDesigns.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <div className="flex items-center justify-between">
              <span>
                Total: {designs.length} designs •
                Images: {designs.reduce((acc, d) => acc + d.design_outputs.length, 0)} •
                Avg. rating: {(
                  designs.reduce((acc, d) =>
                    acc + (d.feedback.reduce((sum, f) => sum + f.rating, 0) / (d.feedback.length || 1))
                  , 0) / designs.length
                ).toFixed(1)}/5
              </span>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last updated: {new Date(designs[0]?.updated_at || '').toLocaleDateString()}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  )
}