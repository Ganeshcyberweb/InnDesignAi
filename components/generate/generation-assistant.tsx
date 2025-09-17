'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

import {
  Lightbulb,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  Zap
} from 'lucide-react'

interface GenerationAssistantProps {
  currentSettings?: {
    prompt?: string
    roomType?: string
    style?: string
    budget?: number
    variations?: number
  }
  onSuggestionApply?: (suggestion: Suggestion) => void
}

interface Suggestion {
  id: string
  type: 'optimization' | 'improvement' | 'cost-saving' | 'trending'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  action?: {
    label: string
    data: any
  }
}

export function GenerationAssistant({
  currentSettings,
  onSuggestionApply
}: GenerationAssistantProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [trends, setTrends] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateSuggestions()
    loadTrends()
    loadUserStats()
  }, [currentSettings])

  const generateSuggestions = () => {
    const newSuggestions: Suggestion[] = []

    // Budget optimization
    if (currentSettings?.budget && currentSettings.budget > 5000) {
      newSuggestions.push({
        id: 'budget-opt',
        type: 'cost-saving',
        title: 'Budget Optimization',
        description: 'Consider starting with fewer variations to reduce costs, then generate more if needed.',
        impact: 'medium',
        action: {
          label: 'Optimize Budget',
          data: { variations: Math.max(2, (currentSettings.variations || 3) - 1) }
        }
      })
    }

    // Style popularity
    if (currentSettings?.style === 'Scandinavian') {
      newSuggestions.push({
        id: 'trending-style',
        type: 'trending',
        title: 'Trending Style Choice',
        description: 'Scandinavian design is trending 📈 Perfect for cozy, minimalist spaces.',
        impact: 'high'
      })
    }

    // Prompt enhancement
    if (currentSettings?.prompt && currentSettings.prompt.length < 50) {
      newSuggestions.push({
        id: 'prompt-enhance',
        type: 'improvement',
        title: 'Enhance Your Prompt',
        description: 'Add more details about lighting, materials, or atmosphere for better results.',
        impact: 'high',
        action: {
          label: 'Add Details',
          data: { promptAddition: ', with natural lighting and modern fixtures' }
        }
      })
    }

    // Room-specific optimization
    if (currentSettings?.roomType === 'Home Office') {
      newSuggestions.push({
        id: 'office-opt',
        type: 'optimization',
        title: 'Home Office Focus',
        description: 'Include ergonomic furniture and good lighting for productivity.',
        impact: 'medium',
        action: {
          label: 'Add Office Elements',
          data: { promptAddition: ', ergonomic desk setup, task lighting, organized storage' }
        }
      })
    }

    setSuggestions(newSuggestions)
  }

  const loadTrends = async () => {
    // Mock trending data - in real app, fetch from API
    setTrends([
      { style: 'Scandinavian', percentage: 24, trend: 'up' },
      { style: 'Modern Minimalist', percentage: 19, trend: 'up' },
      { style: 'Industrial Chic', percentage: 15, trend: 'stable' },
      { room: 'Home Office', percentage: 31, trend: 'up' },
      { room: 'Living Room', percentage: 28, trend: 'stable' }
    ])
  }

  const loadUserStats = async () => {
    // Mock user statistics
    setUserStats({
      totalGenerations: 23,
      favoriteStyle: 'Modern',
      averageRating: 4.3,
      totalSpent: 47.50,
      savedMoney: 12.25
    })
    setLoading(false)
  }

  const handleApplySuggestion = (suggestion: Suggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion)
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <Zap className="h-4 w-4 text-primary" />
      case 'improvement':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'cost-saving':
        return <DollarSign className="h-4 w-4 text-orange-500" />
      case 'trending':
        return <Sparkles className="h-4 w-4 text-purple-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-destructive/10 text-red-800 border-destructive/20'
      case 'medium':
        return 'bg-accent text-yellow-800 border-accent'
      case 'low':
        return 'bg-primary/10 text-green-800 border-primary/20'
      default:
        return 'bg-muted text-foreground border-gray-200'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>AI Suggestions</span>
              <Badge variant="secondary" className="text-xs">
                {suggestions.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Personalized recommendations to improve your generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Alert className="relative">
                    <div className="flex items-start space-x-3">
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{suggestion.title}</p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getImpactColor(suggestion.impact)}`}
                          >
                            {suggestion.impact} impact
                          </Badge>
                        </div>
                        <AlertDescription className="text-xs">
                          {suggestion.description}
                        </AlertDescription>
                        {suggestion.action && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApplySuggestion(suggestion)}
                            className="h-7 text-xs mt-2"
                          >
                            {suggestion.action.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Alert>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* Design Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Current Trends</span>
          </CardTitle>
          <CardDescription>
            Popular styles and rooms this month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Popular Styles</p>
            {trends.filter(t => t.style).map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{trend.style}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${trend.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {trend.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Popular Rooms</p>
            {trends.filter(t => t.room).map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{trend.room}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${trend.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {trend.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            <span>Your Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{userStats.totalGenerations}</p>
              <p className="text-xs text-muted-foreground">Designs Created</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <p className="text-2xl font-bold">{userStats.averageRating}</p>
              </div>
              <p className="text-xs text-muted-foreground">Avg. Rating</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">${userStats.totalSpent}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">${userStats.savedMoney}</p>
              <p className="text-xs text-muted-foreground">Money Saved</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-xs font-medium text-primary mb-1">
              💡 Pro Tip
            </p>
            <p className="text-xs text-muted-foreground">
              Your favorite style is <strong>{userStats.favoriteStyle}</strong>.
              Consider exploring similar styles like Contemporary or Transitional for variety.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Info className="h-4 w-4 text-primary" />
            <span>Quick Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Add specific lighting details (natural, warm, bright) for better results</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Include texture preferences (wood, metal, fabric) for richer designs</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Start with 2-3 variations, generate more if needed to save costs</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>Very detailed prompts (200+ words) may increase generation time</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}