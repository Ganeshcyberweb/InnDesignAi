'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Upload,
  Wand2,
  RefreshCw,
  Settings as SettingsIcon,
  Image as ImageIcon
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function DesignStudio() {
  const [selectedStyle, setSelectedStyle] = useState('B')

  const styleOptions = ['A', 'B', 'C']

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Design Studio
        </h1>
      </div>

      {/* AI Generated Designs Section */}
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          {/* Header and Style Tabs */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-foreground">AI Generated Designs</h2>
            <div className="flex space-x-1">
              {styleOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedStyle === style
                      ? 'bg-black text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Style {style}
                </button>
              ))}
            </div>
          </div>

          {/* Main Design View */}
          <div className="bg-muted rounded-lg border-2 border-dashed border-border mb-6 min-h-[400px] flex flex-col items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Main Design View
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              AI-generated room design will appear here
            </p>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-foreground mb-6">Project Details</h3>

          {/* Prompt */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="prompt" className="text-sm font-medium text-foreground">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe specific requirements, furniture preferences, or design elements..."
              rows={3}
              className="resize-none bg-background border-border"
            />
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="room-type" className="text-sm font-medium text-foreground">Room Type</Label>
              <Select defaultValue="living-room">
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="living-room">Living Room</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                  <SelectItem value="dining-room">Dining Room</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-size" className="text-sm font-medium text-foreground">Room Size (sq ft)</Label>
              <Input
                id="room-size"
                placeholder="250"
                defaultValue="250"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="style-preference" className="text-sm font-medium text-foreground">Style Preference</Label>
              <Select defaultValue="modern">
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="scandinavian">Scandinavian</SelectItem>
                  <SelectItem value="bohemian">Bohemian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-range" className="text-sm font-medium text-foreground">Budget Range</Label>
              <Select defaultValue="1000-5000">
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1000">Under $1,000</SelectItem>
                  <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                  <SelectItem value="over-25000">Over $25,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-2 mb-6">
            <Label className="text-sm font-medium text-foreground">Color Palette</Label>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-black rounded-full border border-border"></div>
              <div className="w-8 h-8 bg-black/60 rounded-full border border-border"></div>
              <div className="w-8 h-8 bg-black/30 rounded-full border border-border"></div>
            </div>
          </div>

          {/* Upload Reference */}
          <div className="space-y-2 mb-6">
            <Label className="text-sm font-medium text-foreground">Upload Reference</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-border/80 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop to upload
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button className="bg-black hover:bg-black/90 text-white">
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Design
            </Button>
            <Button variant="outline" className="border-border">
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="outline" className="border-border">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Refine Design
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}