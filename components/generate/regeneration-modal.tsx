'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

import {
  RefreshCw,
  Palette,
  Layout,
  Lightbulb,
  Wand2,
  Image as ImageIcon,
  Settings,
  Sparkles
} from 'lucide-react'

import type { DesignWithRelations, RegenerationRequest } from '@/app/types/design'

const formSchema = z.object({
  prompt_changes: z.string().optional(),
  style_adjustments: z.string().optional(),
  color_changes: z.string().optional(),
  layout_changes: z.string().optional(),
  preserve_elements: z.array(z.string()).optional(),
  variation_strength: z.number().min(0).max(1)
})

type FormData = z.infer<typeof formSchema>

interface RegenerationModalProps {
  design: DesignWithRelations | null
  isOpen: boolean
  onClose: () => void
  onRegenerate: (request: RegenerationRequest) => void
  isRegenerating?: boolean
}

export function RegenerationModal({
  design,
  isOpen,
  onClose,
  onRegenerate,
  isRegenerating = false
}: RegenerationModalProps) {
  const [selectedPreserveElements, setSelectedPreserveElements] = useState<string[]>([])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt_changes: '',
      style_adjustments: '',
      color_changes: '',
      layout_changes: '',
      preserve_elements: [],
      variation_strength: 0.5
    }
  })

  if (!design) return null

  const handleSubmit = (data: FormData) => {
    const request: RegenerationRequest = {
      original_design_id: design.id,
      modifications: {
        prompt_changes: data.prompt_changes,
        style_adjustments: data.style_adjustments,
        color_changes: data.color_changes,
        layout_changes: data.layout_changes
      },
      preserve_elements: selectedPreserveElements,
      variation_strength: data.variation_strength
    }

    onRegenerate(request)
  }

  const handleClose = () => {
    form.reset()
    setSelectedPreserveElements([])
    onClose()
  }

  const getDesignThumbnail = () => {
    if (design.design_outputs && design.design_outputs.length > 0) {
      return design.design_outputs[0].output_image_url
    }
    return null
  }

  const preservableElements = [
    'Overall layout',
    'Color scheme',
    'Furniture placement',
    'Lighting setup',
    'Window placement',
    'Door positions',
    'Flooring pattern',
    'Wall colors',
    'Ceiling design',
    'Decorative elements'
  ]

  const variationLabels = [
    { value: 0.1, label: 'Minimal changes', description: 'Keep almost everything the same' },
    { value: 0.3, label: 'Small tweaks', description: 'Minor adjustments only' },
    { value: 0.5, label: 'Moderate changes', description: 'Balanced modifications' },
    { value: 0.7, label: 'Significant changes', description: 'Major redesign elements' },
    { value: 0.9, label: 'Major overhaul', description: 'Almost completely new design' }
  ]

  const getVariationLabel = (value: number) => {
    const closest = variationLabels.reduce((prev, curr) =>
      Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    )
    return closest
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>Regenerate Design</span>
          </DialogTitle>
          <DialogDescription>
            Modify specific aspects of your design and generate new variations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Design Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {getDesignThumbnail() ? (
                    <img
                      src={getDesignThumbnail()!}
                      alt="Original design"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Original Design</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {design.input_prompt?.substring(0, 100) || 'AI Generated Design'}
                    {design.input_prompt && design.input_prompt.length > 100 && '...'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {design.preferences?.room_type && (
                      <Badge variant="secondary" className="text-xs">
                        {design.preferences.room_type}
                      </Badge>
                    )}
                    {design.preferences?.style_preference && (
                      <Badge variant="secondary" className="text-xs">
                        {design.preferences.style_preference}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Modification Fields */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Wand2 className="h-4 w-4" />
                  <span>What would you like to change?</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="prompt_changes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Lightbulb className="h-4 w-4" />
                          <span>Prompt Modifications</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'Add more plants', 'Make it brighter', 'Include a reading nook'"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe what you want to add, remove, or change
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="style_adjustments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Palette className="h-4 w-4" />
                          <span>Style Adjustments</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'More modern', 'Add rustic elements', 'Make it more minimalist'"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Adjust the overall design style or theme
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color_changes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Palette className="h-4 w-4" />
                          <span>Color Changes</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'Use warmer colors', 'Add blue accents', 'Make walls white'"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Specify color palette or specific color changes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="layout_changes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Layout className="h-4 w-4" />
                          <span>Layout Changes</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'Move sofa to window', 'Add a coffee table', 'Remove the desk'"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Modify furniture placement or room layout
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Preserve Elements */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Elements to Preserve</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Select elements from the original design that you want to keep unchanged
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {preservableElements.map((element) => (
                    <div key={element} className="flex items-center space-x-2">
                      <Checkbox
                        id={element}
                        checked={selectedPreserveElements.includes(element)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPreserveElements(prev => [...prev, element])
                          } else {
                            setSelectedPreserveElements(prev => prev.filter(e => e !== element))
                          }
                        }}
                      />
                      <label
                        htmlFor={element}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {element}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Variation Strength */}
              <FormField
                control={form.control}
                name="variation_strength"
                render={({ field }) => {
                  const currentLabel = getVariationLabel(field.value)
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Change Intensity</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            min={0.1}
                            max={0.9}
                            step={0.1}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Minimal</span>
                            <Badge variant="outline" className="text-xs">
                              {currentLabel.label}
                            </Badge>
                            <span>Major</span>
                          </div>
                          <p className="text-sm text-muted-foreground text-center">
                            {currentLabel.description}
                          </p>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Control how much the regenerated design differs from the original
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={handleClose} disabled={isRegenerating}>
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isRegenerating}
              className="flex items-center space-x-2"
            >
              <AnimatePresence mode="wait">
                {isRegenerating ? (
                  <motion.div
                    key="regenerating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Regenerating...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="regenerate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Regenerate Design</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}