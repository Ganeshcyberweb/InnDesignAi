'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'

import {
  ArrowLeftRight,
  RotateCcw,
  Download,
  Heart,
  Share2,
  Maximize2,
  Grid3X3,
  SplitSquareHorizontal,
  Eye,
  EyeOff
} from 'lucide-react'

import type { DesignOutput } from '@/app/types/design'

interface ImageComparisonProps {
  images: DesignOutput[]
  onSave?: (imageId: string) => void
  onShare?: (imageId: string) => void
  onDownload?: (imageId: string) => void
  className?: string
}

export function ImageComparison({
  images,
  onSave,
  onShare,
  onDownload,
  className = ''
}: ImageComparisonProps) {
  const [selectedImages, setSelectedImages] = useState<[number, number]>([0, 1])
  const [comparisonMode, setComparisonMode] = useState<'split' | 'overlay' | 'grid'>('split')
  const [splitPosition, setSplitPosition] = useState(50)
  const [overlayOpacity, setOverlayOpacity] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        const rect = containerRef.current!.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }

      updateSize()
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }
  }, [])

  const handleDrag = (event: any, info: PanInfo) => {
    if (comparisonMode === 'split') {
      const containerWidth = containerSize.width
      const newPosition = Math.max(0, Math.min(100, (info.point.x / containerWidth) * 100))
      setSplitPosition(newPosition)
    }
  }

  const handleImageSelect = (index: number, position: 'left' | 'right') => {
    const newSelection = [...selectedImages] as [number, number]
    if (position === 'left') {
      newSelection[0] = index
    } else {
      newSelection[1] = index
    }
    setSelectedImages(newSelection)
  }

  const getImageActions = (imageIndex: number) => (
    <div className="flex items-center space-x-1">
      {onSave && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSave(images[imageIndex].id)}
          className="h-8 w-8 p-0"
        >
          <Heart className="h-4 w-4" />
        </Button>
      )}
      {onShare && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare(images[imageIndex].id)}
          className="h-8 w-8 p-0"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      )}
      {onDownload && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDownload(images[imageIndex].id)}
          className="h-8 w-8 p-0"
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
    </div>
  )

  const renderSplitView = () => (
    <div className="relative w-full h-96 overflow-hidden rounded-lg bg-muted">
      {/* Left Image */}
      <div className="absolute inset-0">
        <img
          src={images[selectedImages[0]]?.output_image_url}
          alt={`Design variation ${selectedImages[0] + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Image */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
      >
        <img
          src={images[selectedImages[1]]?.output_image_url}
          alt={`Design variation ${selectedImages[1] + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Split Line */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
        style={{ left: `${splitPosition}%` }}
        drag="x"
        dragConstraints={{ left: 0, right: containerSize.width }}
        dragElastic={0}
        onDrag={handleDrag}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileHover={{ scale: 1.2 }}
        whileDrag={{ scale: 1.2 }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white rounded-full p-2 shadow-md">
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-black/50 text-white">
          {images[selectedImages[0]]?.variation_name || `Variation ${selectedImages[0] + 1}`}
        </Badge>
      </div>
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-black/50 text-white">
          {images[selectedImages[1]]?.variation_name || `Variation ${selectedImages[1] + 1}`}
        </Badge>
      </div>
    </div>
  )

  const renderOverlayView = () => (
    <div className="relative w-full h-96 overflow-hidden rounded-lg bg-muted">
      {/* Base Image */}
      <div className="absolute inset-0">
        <img
          src={images[selectedImages[0]]?.output_image_url}
          alt={`Design variation ${selectedImages[0] + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay Image */}
      <div
        className="absolute inset-0"
        style={{ opacity: overlayOpacity / 100 }}
      >
        <img
          src={images[selectedImages[1]]?.output_image_url}
          alt={`Design variation ${selectedImages[1] + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Opacity Control */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/70 rounded-lg p-3 min-w-[200px]">
          <Slider
            value={[overlayOpacity]}
            onValueChange={(value) => setOverlayOpacity(value[0])}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white mt-1">
            <span>Base</span>
            <span>{overlayOpacity}%</span>
            <span>Overlay</span>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-black/50 text-white">
          Base: {images[selectedImages[0]]?.variation_name || `Variation ${selectedImages[0] + 1}`}
        </Badge>
      </div>
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-black/50 text-white">
          Overlay: {images[selectedImages[1]]?.variation_name || `Variation ${selectedImages[1] + 1}`}
        </Badge>
      </div>
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-2 gap-4 h-96">
      <div className="relative group overflow-hidden rounded-lg bg-muted">
        <img
          src={images[selectedImages[0]]?.output_image_url}
          alt={`Design variation ${selectedImages[0] + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-black/50 text-white">
            {images[selectedImages[0]]?.variation_name || `Variation ${selectedImages[0] + 1}`}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {getImageActions(selectedImages[0])}
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-lg bg-muted">
        <img
          src={images[selectedImages[1]]?.output_image_url}
          alt={`Design variation ${selectedImages[1] + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-black/50 text-white">
            {images[selectedImages[1]]?.variation_name || `Variation ${selectedImages[1] + 1}`}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {getImageActions(selectedImages[1])}
        </div>
      </div>
    </div>
  )

  if (images.length < 2) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            Need at least 2 images to compare
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${className}`}
    >
      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Mode Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={comparisonMode === 'split' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setComparisonMode('split')}
                  className="h-8"
                >
                  <SplitSquareHorizontal className="h-3 w-3 mr-1" />
                  Split
                </Button>
                <Button
                  variant={comparisonMode === 'overlay' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setComparisonMode('overlay')}
                  className="h-8"
                >
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Overlay
                </Button>
                <Button
                  variant={comparisonMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setComparisonMode('grid')}
                  className="h-8"
                >
                  <Grid3X3 className="h-3 w-3 mr-1" />
                  Grid
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowControls(!showControls)}
                  className="h-8"
                >
                  {showControls ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSplitPosition(50)
                    setOverlayOpacity(50)
                  }}
                  className="h-8"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Image Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Left/Base Image</p>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => handleImageSelect(index, 'left')}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImages[0] === index
                          ? 'border-primary'
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      <img
                        src={image.output_image_url}
                        alt={`Variation ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImages[0] === index && (
                        <div className="absolute inset-0 bg-primary/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Right/Overlay Image</p>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => handleImageSelect(index, 'right')}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImages[1] === index
                          ? 'border-primary'
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      <img
                        src={image.output_image_url}
                        alt={`Variation ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImages[1] === index && (
                        <div className="absolute inset-0 bg-primary/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison View */}
      <div ref={containerRef} className="relative">
        {comparisonMode === 'split' && renderSplitView()}
        {comparisonMode === 'overlay' && renderOverlayView()}
        {comparisonMode === 'grid' && renderGridView()}
      </div>

      {/* Quick Actions */}
      {comparisonMode !== 'grid' && (
        <div className="flex justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Left/Base:</span>
            {getImageActions(selectedImages[0])}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Right/Overlay:</span>
            {getImageActions(selectedImages[1])}
          </div>
        </div>
      )}
    </motion.div>
  )
}