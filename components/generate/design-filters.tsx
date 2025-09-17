'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import type { DesignFilter } from '@/app/types/design'
import { ROOM_TYPES, STYLE_PREFERENCES } from '@/app/types/design'

interface DesignFiltersProps {
  filters: DesignFilter
  onChange: (filters: DesignFilter) => void
  onReset: () => void
}

export function DesignFilters({ filters, onChange, onReset }: DesignFiltersProps) {
  const [dateFromOpen, setDateFromOpen] = useState(false)
  const [dateToOpen, setDateToOpen] = useState(false)

  const updateFilter = (key: keyof DesignFilter, value: any) => {
    onChange({
      ...filters,
      [key]: value
    })
  }

  const toggleArrayFilter = (key: 'status' | 'room_type' | 'style_preference' | 'ai_model', value: string) => {
    const currentArray = filters[key] as string[] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]

    updateFilter(key, newArray.length > 0 ? newArray : undefined)
  }

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object' && value !== null) return true
    return value !== undefined && value !== ''
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-4 border rounded-lg bg-card"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset}>
            Clear All
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Status</Label>
        <div className="flex flex-wrap gap-2">
          {['PENDING', 'GENERATING', 'COMPLETED', 'FAILED'].map(status => (
            <Badge
              key={status}
              variant={filters.status?.includes(status) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleArrayFilter('status', status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Room Type Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Room Type</Label>
        <Select
          value={filters.room_type?.[0] || ''}
          onValueChange={(value) => updateFilter('room_type', value ? [value] : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All room types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All room types</SelectItem>
            {ROOM_TYPES.map(room => (
              <SelectItem key={room} value={room}>{room}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Style Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Style Preference</Label>
        <Select
          value={filters.style_preference?.[0] || ''}
          onValueChange={(value) => updateFilter('style_preference', value ? [value] : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All styles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All styles</SelectItem>
            {STYLE_PREFERENCES.map(style => (
              <SelectItem key={style} value={style}>{style}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Date Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Date Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date_range?.start ? (
                  format(filters.date_range.start, 'MMM d, yyyy')
                ) : (
                  <span>From date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date_range?.start}
                onSelect={(date) => {
                  updateFilter('date_range', {
                    ...filters.date_range,
                    start: date || new Date()
                  })
                  setDateFromOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date_range?.end ? (
                  format(filters.date_range.end, 'MMM d, yyyy')
                ) : (
                  <span>To date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date_range?.end}
                onSelect={(date) => {
                  updateFilter('date_range', {
                    ...filters.date_range,
                    end: date || new Date()
                  })
                  setDateToOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Budget Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Budget Range</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Min: ${filters.budget_range?.min || 0}</span>
              <span>Max: ${filters.budget_range?.max || 50000}</span>
            </div>
            <Slider
              min={0}
              max={50000}
              step={1000}
              value={[
                filters.budget_range?.min || 0,
                filters.budget_range?.max || 50000
              ]}
              onValueChange={([min, max]) => {
                updateFilter('budget_range', { min, max })
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Rating: {filters.rating_min || 0}+ stars</span>
          </div>
          <Slider
            min={0}
            max={5}
            step={0.5}
            value={[filters.rating_min || 0]}
            onValueChange={([rating]) => {
              updateFilter('rating_min', rating)
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* AI Model Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">AI Model</Label>
        <div className="flex flex-wrap gap-2">
          {['DALL-E', 'Midjourney', 'Stable Diffusion', 'Replicate'].map(model => (
            <Badge
              key={model}
              variant={filters.ai_model?.includes(model) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleArrayFilter('ai_model', model)}
            >
              {model}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">Active filters:</div>
          <div className="flex flex-wrap gap-1">
            {filters.status?.map(status => (
              <Badge key={status} variant="secondary" className="text-xs">
                Status: {status}
              </Badge>
            ))}
            {filters.room_type?.map(room => (
              <Badge key={room} variant="secondary" className="text-xs">
                Room: {room}
              </Badge>
            ))}
            {filters.style_preference?.map(style => (
              <Badge key={style} variant="secondary" className="text-xs">
                Style: {style}
              </Badge>
            ))}
            {filters.date_range && (
              <Badge variant="secondary" className="text-xs">
                Date Range
              </Badge>
            )}
            {filters.budget_range && (
              <Badge variant="secondary" className="text-xs">
                Budget: ${filters.budget_range.min}-${filters.budget_range.max}
              </Badge>
            )}
            {filters.rating_min && (
              <Badge variant="secondary" className="text-xs">
                Rating: {filters.rating_min}+
              </Badge>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}