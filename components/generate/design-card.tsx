'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

import {
  Heart,
  Download,
  Share2,
  RotateCcw,
  Eye,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Zap,
  Palette,
  Home
} from 'lucide-react'

import type { DesignWithRelations } from '@/app/types/design'

interface DesignCardProps {
  design: DesignWithRelations
  onImageClick: (imageIndex: number) => void
  onSave: () => void
  onShare: () => void
  onRegenerate: () => void
  viewMode: 'grid' | 'masonry'
}

export function DesignCard({
  design,
  onImageClick,
  onSave,
  onShare,
  onRegenerate,
  viewMode
}: DesignCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(
    design.feedback.some(f => f.helpful === true)
  )

  const images = design.design_outputs
  const currentImage = images[currentImageIndex]
  const hasMultipleImages = images.length > 1

  const averageRating = design.feedback.length > 0
    ? design.feedback.reduce((acc, f) => acc + f.rating, 0) / design.feedback.length
    : 0

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    onSave()
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShare()
  }

  const handleRegenerate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRegenerate()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-primary/50'
      case 'PROCESSING':
        return 'bg-primary/50'
      case 'PENDING':
        return 'bg-accent/500'
      case 'FAILED':
        return 'bg-destructive/50'
      default:
        return 'bg-muted0'
    }
  }

  const cardVariants = {
    idle: {
      scale: 1,
      y: 0,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="idle"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card
        className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => onImageClick(currentImageIndex)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          {/* Main Image */}
          <motion.img
            src={currentImage?.output_image_url}
            alt={`Design variation ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onLoad={() => setImageLoading(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Loading Placeholder */}
          <AnimatePresence>
            {imageLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
              >
                <Palette className="h-8 w-8 text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={design.status === 'COMPLETED' ? 'default' : 'secondary'}
              className="text-xs"
            >
              <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(design.status)}`} />
              {design.status.toLowerCase()}
            </Badge>
          </div>

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="text-xs bg-black/20 backdrop-blur-sm border-white/20">
                {currentImageIndex + 1}/{images.length}
              </Badge>
            </div>
          )}

          {/* Navigation Arrows */}
          {hasMultipleImages && isHovered && (
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 flex items-center justify-between p-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousImage}
                className="h-8 w-8 p-0 bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/40 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextImage}
                className="h-8 w-8 p-0 bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/40 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Action Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
              >
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <Button
                    size="sm"
                    onClick={handleSave}
                    variant={isFavorited ? 'default' : 'secondary'}
                    className="h-8"
                  >
                    <Heart className={`h-3 w-3 mr-1 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Saved' : 'Save'}
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleShare}
                    variant="secondary"
                    className="h-8"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => onImageClick(currentImageIndex)}
                    variant="secondary"
                    className="h-8"
                  >
                    <Maximize2 className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Dots Indicator */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Home className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {design.preferences?.room_type || 'Unknown Room'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Palette className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {design.preferences?.style_preference || 'No style specified'}
                </span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(design.created_at)}
                </span>
              </div>
              {averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Prompt Preview */}
          {design.input_prompt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {design.input_prompt}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {design.ai_model_used && (
              <Badge variant="outline" className="text-xs">
                <Zap className="h-2 w-2 mr-1" />
                {design.ai_model_used}
              </Badge>
            )}
            {design.preferences?.color_scheme && (
              <Badge variant="outline" className="text-xs">
                {design.preferences.color_scheme}
              </Badge>
            )}
            {design.design_outputs.length > 1 && (
              <Badge variant="outline" className="text-xs">
                {design.design_outputs.length} variations
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              className="h-8 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle download
                }}
                className="h-8 w-8 p-0"
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0"
              >
                <Share2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-8 w-8 p-0"
              >
                <Heart className={`h-3 w-3 ${isFavorited ? 'fill-current text-destructive' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}