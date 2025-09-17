'use client'

import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import { Home, Palette, DollarSign, Ruler, Brush, Edit3, Heart } from 'lucide-react'

interface PreferencesPreviewProps {
  preferences: {
    room_type?: string
    size?: string
    style_preference?: string
    budget?: number
    color_scheme?: string
    material_preferences?: string
    other_requirements?: string
  }
  onEdit?: () => void
  showEdit?: boolean
}

export function PreferencesPreview({
  preferences,
  onEdit,
  showEdit = false
}: PreferencesPreviewProps) {
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
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget)
  }

  const preferenceItems = [
    {
      icon: Home,
      label: 'Room Type',
      value: preferences.room_type,
      color: 'text-primary'
    },
    {
      icon: Ruler,
      label: 'Size',
      value: preferences.size,
      color: 'text-primary'
    },
    {
      icon: Heart,
      label: 'Style',
      value: preferences.style_preference,
      color: 'text-purple-600'
    },
    {
      icon: Palette,
      label: 'Colors',
      value: preferences.color_scheme,
      color: 'text-pink-600'
    },
    {
      icon: DollarSign,
      label: 'Budget',
      value: preferences.budget ? formatBudget(preferences.budget) : undefined,
      color: 'text-emerald-600'
    },
    {
      icon: Brush,
      label: 'Materials',
      value: preferences.material_preferences,
      color: 'text-orange-600'
    }
  ]

  const filledPreferences = preferenceItems.filter(item => item.value)
  const hasRequirements = preferences.other_requirements?.trim()

  if (filledPreferences.length === 0 && !hasRequirements) {
    return (
      <div className="text-center py-6">
        <div className="text-muted-foreground space-y-2">
          <Edit3 className="h-8 w-8 mx-auto opacity-50" />
          <p className="text-sm">No preferences set</p>
          <p className="text-xs">
            Complete the onboarding or update your preferences to see them here
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-semibold text-sm">Current Preferences</h4>
          <p className="text-xs text-muted-foreground">
            {filledPreferences.length} preferences configured
          </p>
        </div>
        {showEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            Edit
          </Button>
        )}
      </div>

      {/* Preference Items */}
      <div className="space-y-3">
        {filledPreferences.map((item, index) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-background ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium truncate">{item.value}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Set
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* Additional Requirements */}
      {hasRequirements && (
        <>
          <Separator />
          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center space-x-1">
              <Edit3 className="h-3 w-3" />
              <span>Additional Requirements</span>
            </p>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {preferences.other_requirements}
              </p>
            </div>
          </motion.div>
        </>
      )}

      {/* Summary Stats */}
      <motion.div variants={itemVariants}>
        <Separator />
        <div className="pt-3 grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Completion</p>
            <div className="flex items-center space-x-1">
              <div className="flex-1 bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(filledPreferences.length / 6) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium">
                {Math.round((filledPreferences.length / 6) * 100)}%
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Detail Level</p>
            <Badge variant="outline" className="text-xs">
              {filledPreferences.length >= 5 ? 'Detailed' :
               filledPreferences.length >= 3 ? 'Good' :
               filledPreferences.length >= 1 ? 'Basic' : 'None'}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Suggestions */}
      {filledPreferences.length < 4 && (
        <motion.div variants={itemVariants}>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-800 mb-1">
              💡 Improve your results
            </p>
            <p className="text-xs text-primary">
              Add more preferences to get more personalized design suggestions.
              Consider setting your{' '}
              {!preferences.budget && 'budget, '}
              {!preferences.color_scheme && 'color scheme, '}
              {!preferences.material_preferences && 'material preferences, '}
              and specific requirements.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}