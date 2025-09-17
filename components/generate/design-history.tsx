'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Search,
  Filter,
  CalendarDays,
  Eye,
  Star,
  Download,
  MoreHorizontal,
  Image as ImageIcon,
  Clock,
  DollarSign,
  Palette,
  Home,
  SortAsc,
  SortDesc
} from 'lucide-react'

import type { DesignWithRelations, DesignFilter } from '@/app/types/design'
import { ROOM_TYPES, STYLE_PREFERENCES } from '@/app/types/design'

interface DesignHistoryProps {
  designs: DesignWithRelations[]
  onDesignSelect: (design: DesignWithRelations) => void
  onFavorite?: (designId: string) => void
  onDownload?: (designId: string) => void
  onDelete?: (designId: string) => void
}

export function DesignHistory({
  designs,
  onDesignSelect,
  onFavorite,
  onDownload,
  onDelete
}: DesignHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roomFilter, setRoomFilter] = useState<string>('all')
  const [styleFilter, setStyleFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'cost'>('newest')

  // Filter and sort designs
  const filteredDesigns = useMemo(() => {
    let filtered = designs.filter(design => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesPrompt = design.input_prompt?.toLowerCase().includes(searchLower)
        const matchesRoom = design.preferences?.room_type?.toLowerCase().includes(searchLower)
        const matchesStyle = design.preferences?.style_preference?.toLowerCase().includes(searchLower)

        if (!matchesPrompt && !matchesRoom && !matchesStyle) {
          return false
        }
      }

      // Status filter
      if (statusFilter !== 'all' && design.status !== statusFilter) {
        return false
      }

      // Room filter
      if (roomFilter !== 'all' && design.preferences?.room_type !== roomFilter) {
        return false
      }

      // Style filter
      if (styleFilter !== 'all' && design.preferences?.style_preference !== styleFilter) {
        return false
      }

      return true
    })

    // Sort designs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'rating':
          const avgRatingA = a.feedback.length > 0
            ? a.feedback.reduce((sum, f) => sum + f.rating, 0) / a.feedback.length
            : 0
          const avgRatingB = b.feedback.length > 0
            ? b.feedback.reduce((sum, f) => sum + f.rating, 0) / b.feedback.length
            : 0
          return avgRatingB - avgRatingA
        case 'cost':
          // Assuming we have cost data in roi_calculation
          const costA = a.roi_calculation?.cost_breakdown?.total || 0
          const costB = b.roi_calculation?.cost_breakdown?.total || 0
          return costB - costA
        default:
          return 0
      }
    })

    return filtered
  }, [designs, searchQuery, statusFilter, roomFilter, styleFilter, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-primary/50/10 text-green-500 border-green-500/20'
      case 'GENERATING':
        return 'bg-primary/50/10 text-primary border-blue-500/20'
      case 'PENDING':
        return 'bg-accent/500/10 text-yellow-500 border-yellow-500/20'
      case 'FAILED':
        return 'bg-destructive/50/10 text-destructive border-red-500/20'
      default:
        return 'bg-muted0/10 text-muted-foreground border-gray-500/20'
    }
  }

  const getDesignThumbnail = (design: DesignWithRelations) => {
    if (design.design_outputs && design.design_outputs.length > 0) {
      return design.design_outputs[0].output_image_url
    }
    return null
  }

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
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search designs by prompt, room type, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="GENERATING">Generating</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {ROOM_TYPES.map(room => (
                <SelectItem key={room} value={room}>{room}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {STYLE_PREFERENCES.map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center space-x-2">
                  <SortDesc className="h-4 w-4" />
                  <span>Newest First</span>
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center space-x-2">
                  <SortAsc className="h-4 w-4" />
                  <span>Oldest First</span>
                </div>
              </SelectItem>
              <SelectItem value="rating">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Highest Rated</span>
                </div>
              </SelectItem>
              <SelectItem value="cost">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Highest Cost</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || statusFilter !== 'all' || roomFilter !== 'all' || styleFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setRoomFilter('all')
                setStyleFilter('all')
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredDesigns.length} of {designs.length} designs
        </div>
      </div>

      {/* Design List */}
      <ScrollArea className="h-[600px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredDesigns.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No designs found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || roomFilter !== 'all' || styleFilter !== 'all'
                    ? 'Try adjusting your filters or search terms'
                    : 'Start generating designs to see them here'
                  }
                </p>
              </motion.div>
            ) : (
              filteredDesigns.map((design) => (
                <motion.div
                  key={design.id}
                  variants={itemVariants}
                  layout
                  className="group"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4" onClick={() => onDesignSelect(design)}>
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {getDesignThumbnail(design) ? (
                            <img
                              src={getDesignThumbnail(design)!}
                              alt={`Design thumbnail`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="space-y-1">
                              <h4 className="font-medium truncate">
                                {design.input_prompt ?
                                  (design.input_prompt.length > 60
                                    ? `${design.input_prompt.substring(0, 60)}...`
                                    : design.input_prompt)
                                  : 'Untitled Design'
                                }
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <CalendarDays className="h-3 w-3" />
                                <span>{format(new Date(design.created_at), 'MMM d, yyyy')}</span>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                <span>{format(new Date(design.created_at), 'HH:mm')}</span>
                              </div>
                            </div>

                            <Badge
                              variant="outline"
                              className={getStatusColor(design.status)}
                            >
                              {design.status}
                            </Badge>
                          </div>

                          {/* Design Info */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {design.preferences?.room_type && (
                              <Badge variant="secondary" className="text-xs">
                                <Home className="h-3 w-3 mr-1" />
                                {design.preferences.room_type}
                              </Badge>
                            )}
                            {design.preferences?.style_preference && (
                              <Badge variant="secondary" className="text-xs">
                                <Palette className="h-3 w-3 mr-1" />
                                {design.preferences.style_preference}
                              </Badge>
                            )}
                            {design.ai_model_used && (
                              <Badge variant="outline" className="text-xs">
                                {design.ai_model_used}
                              </Badge>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <ImageIcon className="h-3 w-3" />
                                <span>{design.design_outputs.length} outputs</span>
                              </div>
                              {design.feedback.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3" />
                                  <span>
                                    {(design.feedback.reduce((sum, f) => sum + f.rating, 0) / design.feedback.length).toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {design.roi_calculation?.cost_breakdown?.total && (
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span>${design.roi_calculation.cost_breakdown.total.toFixed(2)}</span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDesignSelect(design)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {onFavorite && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onFavorite(design.id)
                                  }}
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                              )}
                              {onDownload && design.status === 'COMPLETED' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDownload(design.id)
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </div>
  )
}