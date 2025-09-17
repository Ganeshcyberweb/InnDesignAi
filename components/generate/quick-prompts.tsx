'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Search, Sparkles, Home, Palette, Sun, Star, Plus, ArrowRight } from 'lucide-react'

import type { QuickPrompt } from '@/app/types/design'

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void
}

export function QuickPrompts({ onPromptSelect }: QuickPromptsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'style' | 'room' | 'mood' | 'special'>('all')

  // Predefined quick prompts with categories
  const quickPrompts: QuickPrompt[] = [
    // Style prompts
    {
      id: 'modern-minimalist',
      title: 'Modern Minimalist',
      prompt: 'Clean, modern minimalist design with white walls, sleek furniture, plenty of natural light, and minimal decorative elements',
      category: 'style',
      tags: ['minimalist', 'modern', 'clean'],
      preview_image: '/images/prompts/minimalist.jpg'
    },
    {
      id: 'cozy-scandinavian',
      title: 'Cozy Scandinavian',
      prompt: 'Warm Scandinavian style with light wood furniture, neutral colors, cozy textiles, and hygge atmosphere',
      category: 'style',
      tags: ['scandinavian', 'cozy', 'hygge'],
      preview_image: '/images/prompts/scandinavian.jpg'
    },
    {
      id: 'industrial-chic',
      title: 'Industrial Chic',
      prompt: 'Industrial loft style with exposed brick walls, metal fixtures, leather furniture, and urban aesthetic',
      category: 'style',
      tags: ['industrial', 'urban', 'loft'],
      preview_image: '/images/prompts/industrial.jpg'
    },
    {
      id: 'bohemian-eclectic',
      title: 'Bohemian Eclectic',
      prompt: 'Bohemian design with rich colors, patterned textiles, plants, vintage furniture, and eclectic decorative elements',
      category: 'style',
      tags: ['bohemian', 'eclectic', 'colorful'],
      preview_image: '/images/prompts/bohemian.jpg'
    },

    // Room-specific prompts
    {
      id: 'productive-office',
      title: 'Productive Home Office',
      prompt: 'Professional home office with ergonomic furniture, good lighting, organized storage, and inspiring decor for productivity',
      category: 'room',
      tags: ['office', 'productive', 'professional'],
      preview_image: '/images/prompts/office.jpg'
    },
    {
      id: 'luxury-bedroom',
      title: 'Luxury Master Bedroom',
      prompt: 'Luxurious master bedroom with plush bedding, elegant furniture, soft lighting, and spa-like atmosphere',
      category: 'room',
      tags: ['bedroom', 'luxury', 'relaxing'],
      preview_image: '/images/prompts/bedroom.jpg'
    },
    {
      id: 'social-kitchen',
      title: 'Social Kitchen',
      prompt: 'Open kitchen perfect for entertaining with large island, modern appliances, bar seating, and warm lighting',
      category: 'room',
      tags: ['kitchen', 'entertaining', 'social'],
      preview_image: '/images/prompts/kitchen.jpg'
    },

    // Mood-based prompts
    {
      id: 'calm-sanctuary',
      title: 'Calm Sanctuary',
      prompt: 'Peaceful and calming space with soft colors, natural materials, gentle lighting, and zen-like atmosphere',
      category: 'mood',
      tags: ['calm', 'peaceful', 'zen'],
      preview_image: '/images/prompts/calm.jpg'
    },
    {
      id: 'energetic-vibrant',
      title: 'Energetic & Vibrant',
      prompt: 'Bright and energetic space with bold colors, dynamic patterns, modern furniture, and uplifting atmosphere',
      category: 'mood',
      tags: ['energetic', 'vibrant', 'bold'],
      preview_image: '/images/prompts/vibrant.jpg'
    },
    {
      id: 'romantic-cozy',
      title: 'Romantic & Cozy',
      prompt: 'Romantic atmosphere with warm lighting, soft textures, intimate seating, and elegant details',
      category: 'mood',
      tags: ['romantic', 'cozy', 'intimate'],
      preview_image: '/images/prompts/romantic.jpg'
    },

    // Special themes
    {
      id: 'eco-friendly',
      title: 'Eco-Friendly Design',
      prompt: 'Sustainable design with natural materials, plants, energy-efficient lighting, and environmentally conscious furniture',
      category: 'special',
      tags: ['eco-friendly', 'sustainable', 'natural'],
      preview_image: '/images/prompts/eco.jpg'
    },
    {
      id: 'smart-home',
      title: 'Smart Home Integration',
      prompt: 'Modern space with integrated smart home technology, automated lighting, sleek interfaces, and futuristic elements',
      category: 'special',
      tags: ['smart', 'technology', 'modern'],
      preview_image: '/images/prompts/smart.jpg'
    }
  ]

  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'style', label: 'Styles', icon: Palette },
    { id: 'room', label: 'Rooms', icon: Home },
    { id: 'mood', label: 'Moods', icon: Sun },
    { id: 'special', label: 'Special', icon: Star }
  ] as const

  const filteredPrompts = quickPrompts.filter(prompt => {
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
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
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center space-x-1"
            >
              <category.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredPrompts.map((prompt) => (
                <motion.div
                  key={prompt.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  layout
                >
                  <Card className="cursor-pointer h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">
                              {prompt.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {prompt.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPromptSelect(prompt.prompt)}
                            className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Preview */}
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {prompt.prompt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {prompt.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {prompt.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{prompt.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Use Button */}
                        <Button
                          size="sm"
                          onClick={() => onPromptSelect(prompt.prompt)}
                          className="w-full"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Use This Prompt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No results */}
          {filteredPrompts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No prompts found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or browse different categories
              </p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* Popular Tags */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Popular Tags</p>
        <div className="flex flex-wrap gap-2">
          {['modern', 'cozy', 'minimalist', 'luxury', 'colorful', 'natural'].map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery(tag)}
              className="h-7 text-xs"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}