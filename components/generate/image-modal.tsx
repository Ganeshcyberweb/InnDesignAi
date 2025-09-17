'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Heart,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  Star,
  Clock,
  Palette,
  Home,
  DollarSign,
  Eye,
  Grid3X3
} from 'lucide-react'

import type { DesignWithRelations } from '@/app/types/design'

interface ImageModalProps {
  design: DesignWithRelations
  initialImageIndex: number
  onClose: () => void
  onSave: () => void
  onShare: () => void
  onRegenerate: () => void
}

export function ImageModal({
  design,
  initialImageIndex,
  onClose,
  onSave,
  onShare,
  onRegenerate
}: ImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex)
  const [zoom, setZoom] = useState(1)
  const [showInfo, setShowInfo] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(
    design.feedback.some(f => f.helpful === true)
  )

  const images = design.design_outputs
  const currentImage = images[currentImageIndex]
  const hasMultipleImages = images.length > 1

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          if (hasMultipleImages) {
            setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
          }
          break
        case 'ArrowRight':
          if (hasMultipleImages) {
            setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
          }
          break
        case '+':
        case '=':
          setZoom(prev => Math.min(prev + 0.25, 3))
          break
        case '-':
          setZoom(prev => Math.max(prev - 0.25, 0.5))
          break
        case '0':
          setZoom(1)
          break
        case 'i':
          setShowInfo(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [hasMultipleImages, images.length, onClose])

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
    setZoom(1)
    setImageLoading(true)
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
    setZoom(1)
    setImageLoading(true)
  }

  const handleSave = () => {
    setIsFavorited(!isFavorited)
    onSave()
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage.output_image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `inndesign-${design.id}-${currentImageIndex + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const averageRating = design.feedback.length > 0
    ? design.feedback.reduce((acc, f) => acc + f.rating, 0) / design.feedback.length
    : 0

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  }

  const infoVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex h-full relative"
        >
          {/* Main Image Area */}
          <div className="flex-1 relative overflow-hidden">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 left-4 z-10 h-8 w-8 p-0 bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/40 text-white"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 p-0 bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/40 text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 p-0 bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/40 text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Top Controls */}
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
              {/* Image Counter */}
              {hasMultipleImages && (
                <Badge variant="outline" className="bg-black/20 backdrop-blur-sm border-white/20 text-white">
                  {currentImageIndex + 1} of {images.length}
                </Badge>
              )}

              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded border border-white/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-white text-xs px-2 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Info Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="h-8 w-8 p-0 bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            {/* Image */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  src={currentImage?.output_image_url}
                  alt={`Design variation ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${zoom})` }}
                  onLoad={() => setImageLoading(false)}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Loading Overlay */}
              <AnimatePresence>
                {imageLoading && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20 p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="h-8 text-white hover:bg-white/20"
                >
                  <Heart className={`h-4 w-4 mr-1 ${isFavorited ? 'fill-current text-destructive' : ''}`} />
                  {isFavorited ? 'Saved' : 'Save'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  className="h-8 text-white hover:bg-white/20"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className="h-8 text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 right-4 z-10">
                <div className="flex space-x-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20 p-2">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex
                          ? 'border-white'
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img
                        src={image.output_image_url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {images.length > 4 && (
                    <div className="w-12 h-12 rounded bg-black/40 border-2 border-white/30 flex items-center justify-center">
                      <span className="text-white text-xs">+{images.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                variants={infoVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-80 bg-background border-l h-full overflow-y-auto"
              >
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Design Details</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInfo(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generated {formatTimeAgo(design.created_at)}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <Badge variant={design.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {design.status.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Rating</p>
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">
                          {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prompt */}
                  {design.input_prompt && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Original Prompt</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {design.input_prompt}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Preferences */}
                  {design.preferences && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Design Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{design.preferences.room_type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Palette className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{design.preferences.style_preference}</span>
                          </div>
                          {design.preferences.color_scheme && (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                              <span className="text-sm">{design.preferences.color_scheme}</span>
                            </div>
                          )}
                          {design.preferences.budget && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">${design.preferences.budget.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Current Image Info */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Current Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Variation:</span>
                        <span>{currentImage?.variation_name || `#${currentImageIndex + 1}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Model:</span>
                        <span>{design.ai_model_used}</span>
                      </div>
                      {currentImage?.generation_parameters && (
                        <div className="pt-2">
                          <p className="text-xs text-muted-foreground mb-2">Parameters:</p>
                          <div className="text-xs bg-muted/50 rounded p-2 font-mono">
                            {JSON.stringify(currentImage.generation_parameters, null, 2)}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* All Variations */}
                  {hasMultipleImages && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">All Variations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {images.map((image, index) => (
                            <button
                              key={image.id}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`aspect-square rounded overflow-hidden border-2 transition-colors ${
                                index === currentImageIndex
                                  ? 'border-primary'
                                  : 'border-muted hover:border-muted-foreground'
                              }`}
                            >
                              <img
                                src={image.output_image_url}
                                alt={`Variation ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* ROI Information */}
                  {design.roi_calculation && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">ROI Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estimated Cost:</span>
                          <span>${design.roi_calculation.estimated_cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">ROI:</span>
                          <span className="text-primary font-semibold">
                            {design.roi_calculation.roi_percentage}%
                          </span>
                        </div>
                        {design.roi_calculation.payback_timeline && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payback:</span>
                            <span>{design.roi_calculation.payback_timeline}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}