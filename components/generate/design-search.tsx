'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '@/hooks/use-debounce'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Search,
  X,
  Filter,
  Hash,
  Clock,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  History
} from 'lucide-react'

import type { DesignWithRelations } from '@/app/types/design'

interface SearchSuggestion {
  id: string
  type: 'prompt' | 'room' | 'style' | 'tag' | 'recent'
  text: string
  count?: number
  preview?: string
}

interface DesignSearchProps {
  designs: DesignWithRelations[]
  onSearch: (query: string) => void
  onSuggestionSelect: (suggestion: SearchSuggestion) => void
  placeholder?: string
  value?: string
}

export function DesignSearch({
  designs,
  onSearch,
  onSuggestionSelect,
  placeholder = "Search designs, rooms, styles, or prompts...",
  value = ""
}: DesignSearchProps) {
  const [query, setQuery] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const debouncedQuery = useDebounce(query, 300)

  // Update external search when query changes
  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('inndesign-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }
  }, [])

  // Save search to recent searches
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) return

    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 10) // Keep only last 10 searches

    setRecentSearches(updated)
    localStorage.setItem('inndesign-recent-searches', JSON.stringify(updated))
  }

  // Generate search suggestions
  const suggestions = useMemo(() => {
    const suggestions: SearchSuggestion[] = []

    if (!query.trim()) {
      // Show recent searches when no query
      recentSearches.forEach(search => {
        suggestions.push({
          id: `recent-${search}`,
          type: 'recent',
          text: search,
          preview: 'Recent search'
        })
      })
      return suggestions
    }

    const lowerQuery = query.toLowerCase()

    // Room type suggestions
    const roomTypes = [...new Set(designs.map(d => d.preferences?.room_type).filter(Boolean))]
    roomTypes.forEach(room => {
      if (room!.toLowerCase().includes(lowerQuery)) {
        const count = designs.filter(d => d.preferences?.room_type === room).length
        suggestions.push({
          id: `room-${room}`,
          type: 'room',
          text: room!,
          count,
          preview: `${count} designs`
        })
      }
    })

    // Style suggestions
    const styles = [...new Set(designs.map(d => d.preferences?.style_preference).filter(Boolean))]
    styles.forEach(style => {
      if (style!.toLowerCase().includes(lowerQuery)) {
        const count = designs.filter(d => d.preferences?.style_preference === style).length
        suggestions.push({
          id: `style-${style}`,
          type: 'style',
          text: style!,
          count,
          preview: `${count} designs`
        })
      }
    })

    // Prompt-based suggestions (extract keywords from prompts)
    const prompts = designs.map(d => d.input_prompt).filter(Boolean)
    const keywords = [...new Set(
      prompts.flatMap(prompt =>
        prompt!.toLowerCase()
          .split(/\s+/)
          .filter(word => word.length > 3 && word.includes(lowerQuery))
      )
    )].slice(0, 5)

    keywords.forEach(keyword => {
      const count = prompts.filter(prompt =>
        prompt!.toLowerCase().includes(keyword)
      ).length

      if (count > 0) {
        suggestions.push({
          id: `prompt-${keyword}`,
          type: 'prompt',
          text: keyword,
          count,
          preview: `Found in ${count} prompts`
        })
      }
    })

    return suggestions.slice(0, 8) // Limit to 8 suggestions
  }, [query, designs, recentSearches])

  const handleInputChange = (value: string) => {
    setQuery(value)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    saveSearch(suggestion.text)
    onSuggestionSelect(suggestion)
    setIsFocused(false)
  }

  const handleSearchSubmit = () => {
    if (query.trim()) {
      saveSearch(query.trim())
      setIsFocused(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setIsFocused(false)
  }

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'room':
        return <ImageIcon className="h-4 w-4" />
      case 'style':
        return <Sparkles className="h-4 w-4" />
      case 'prompt':
        return <Hash className="h-4 w-4" />
      case 'recent':
        return <History className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getSuggestionColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'room':
        return 'text-primary'
      case 'style':
        return 'text-purple-600'
      case 'prompt':
        return 'text-primary'
      case 'recent':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearchSubmit()
            } else if (e.key === 'Escape') {
              setIsFocused(false)
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-20"
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearchSubmit}
            className="h-6 w-6 p-0"
          >
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-1"
          >
            <Card className="border shadow-lg">
              <CardContent className="p-0">
                <ScrollArea className="max-h-96">
                  {suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={suggestion.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center justify-between group"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={getSuggestionColor(suggestion.type)}>
                              {getSuggestionIcon(suggestion.type)}
                            </span>
                            <div>
                              <p className="text-sm font-medium">{suggestion.text}</p>
                              {suggestion.preview && (
                                <p className="text-xs text-muted-foreground">
                                  {suggestion.preview}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {suggestion.count !== undefined && (
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.count}
                              </Badge>
                            )}
                            <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.div>
                      ))}

                      {recentSearches.length > 0 && !query && (
                        <>
                          <Separator className="my-2" />
                          <div className="px-3 py-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setRecentSearches([])
                                localStorage.removeItem('inndesign-recent-searches')
                              }}
                              className="text-xs text-muted-foreground h-auto p-0"
                            >
                              Clear recent searches
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : query.trim() ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No suggestions found</p>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Start typing to search designs</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isFocused && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsFocused(false)}
        />
      )}
    </div>
  )
}