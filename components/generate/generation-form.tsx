'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { Upload, Image as ImageIcon, Wand2, Settings2, DollarSign, Clock, Zap } from 'lucide-react'

import { ImageUploader } from './image-uploader'
import { ProviderSelector } from './provider-selector'
import { AdvancedSettings } from './advanced-settings'

import type { GenerationRequest, GenerationParameters, CostEstimate, AIProvider } from '@/app/types/design'
import { ROOM_TYPES, STYLE_PREFERENCES, COLOR_SCHEMES, ROOM_SIZES } from '@/app/types/design'

const formSchema = z.object({
  input_prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  room_type: z.string().min(1, 'Room type is required'),
  size: z.string().min(1, 'Room size is required'),
  style_preference: z.string().min(1, 'Style preference is required'),
  budget: z.number().optional(),
  color_scheme: z.string().optional(),
  material_preferences: z.string().optional(),
  other_requirements: z.string().optional(),
  ai_model: z.string().min(1, 'AI model is required'),
  generation_count: z.number().min(1).max(5),
  use_advanced: z.boolean().default(false)
})

type FormData = z.infer<typeof formSchema>

interface GenerationFormProps {
  onSubmit: (request: GenerationRequest) => void
  onCostEstimate: (estimate: CostEstimate) => void
  initialPreferences?: any
  isGenerating: boolean
}

export function GenerationForm({
  onSubmit,
  onCostEstimate,
  initialPreferences,
  isGenerating
}: GenerationFormProps) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [advancedParameters, setAdvancedParameters] = useState<GenerationParameters>({})
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [estimating, setEstimating] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input_prompt: '',
      room_type: initialPreferences?.room_type || '',
      size: initialPreferences?.size || '',
      style_preference: initialPreferences?.style_preference || '',
      budget: initialPreferences?.budget || undefined,
      color_scheme: initialPreferences?.color_scheme || '',
      material_preferences: initialPreferences?.material_preferences || '',
      other_requirements: initialPreferences?.other_requirements || '',
      ai_model: '',
      generation_count: 3,
      use_advanced: false
    }
  })

  // Load AI providers
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await fetch('/api/ai/providers')
        if (response.ok) {
          const data = await response.json()
          setProviders(data.providers)
          if (data.providers.length > 0) {
            setSelectedProvider(data.providers[0])
            form.setValue('ai_model', data.providers[0].models[0].id)
          }
        }
      } catch (error) {
        console.error('Error loading providers:', error)
      }
    }

    loadProviders()
  }, [form])

  // Update cost estimate when form changes
  const updateCostEstimate = useCallback(async (formData: Partial<FormData>) => {
    if (!selectedProvider || !formData.ai_model || !formData.generation_count) return

    setEstimating(true)
    try {
      const response = await fetch('/api/ai/cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: formData.ai_model,
          count: formData.generation_count,
          has_image: !!uploadedImage,
          advanced_parameters: showAdvanced ? advancedParameters : undefined
        }),
      })

      if (response.ok) {
        const estimate: CostEstimate = await response.json()
        onCostEstimate(estimate)
      }
    } catch (error) {
      console.error('Error estimating cost:', error)
    } finally {
      setEstimating(false)
    }
  }, [selectedProvider, uploadedImage, advancedParameters, showAdvanced, onCostEstimate])

  // Watch form changes for cost estimation
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateCostEstimate(value)
    })
    return () => subscription.unsubscribe()
  }, [form, updateCostEstimate])

  const handleSubmit = async (data: FormData) => {
    const request: GenerationRequest = {
      input_prompt: data.input_prompt,
      uploaded_image_file: uploadedImage || undefined,
      ai_model: data.ai_model,
      preferences: {
        room_type: data.room_type,
        size: data.size,
        style_preference: data.style_preference,
        budget: data.budget,
        color_scheme: data.color_scheme,
        material_preferences: data.material_preferences,
        other_requirements: data.other_requirements
      },
      generation_count: data.generation_count,
      advanced_parameters: data.use_advanced ? advancedParameters : undefined
    }

    onSubmit(request)
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Main Prompt */}
          <motion.div variants={fieldVariants}>
            <FormField
              control={form.control}
              name="input_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Design Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your ideal room design in detail... (e.g., 'A cozy modern living room with warm lighting, comfortable seating, and natural elements')"
                      className="min-h-[100px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about colors, materials, lighting, and atmosphere you want
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Image Upload */}
          <motion.div variants={fieldVariants}>
            <div className="space-y-3">
              <label className="text-base font-semibold">Reference Image (Optional)</label>
              <ImageUploader
                onImageSelect={setUploadedImage}
                maxSize={10 * 1024 * 1024} // 10MB
                accept="image/*"
              />
              <p className="text-sm text-muted-foreground">
                Upload a reference image to influence the design style and layout
              </p>
            </div>
          </motion.div>

          <Separator />

          {/* Room Preferences */}
          <motion.div variants={fieldVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="room_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROOM_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROOM_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style_preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STYLE_PREFERENCES.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color_scheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Scheme</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color scheme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COLOR_SCHEMES.map((scheme) => (
                        <SelectItem key={scheme} value={scheme}>
                          {scheme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Optional Fields */}
          <motion.div variants={fieldVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="5000"
                        className="pl-10"
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value || ''}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Helps tailor suggestions to your budget
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="material_preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Preferences</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., wood, metal, fabric"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Preferred materials and textures
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <FormField
              control={form.control}
              name="other_requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements, accessibility needs, or specific elements you want included..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <Separator />

          {/* AI Configuration */}
          <motion.div variants={fieldVariants} className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Wand2 className="h-5 w-5" />
              <span>AI Configuration</span>
            </h3>

            <ProviderSelector
              providers={providers}
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
              onModelChange={(model) => form.setValue('ai_model', model)}
            />

            <FormField
              control={form.control}
              name="generation_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Variations</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        min={1}
                        max={selectedProvider?.max_variations || 5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1 variation</span>
                        <Badge variant="outline">{field.value} variations</Badge>
                        <span>{selectedProvider?.max_variations || 5} max</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    More variations give you more options but cost more
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Advanced Settings Toggle */}
          <motion.div variants={fieldVariants}>
            <FormField
              control={form.control}
              name="use_advanced"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Advanced Settings</FormLabel>
                    <FormDescription>
                      Fine-tune generation parameters for expert control
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        setShowAdvanced(checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          {/* Advanced Settings Panel */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <AdvancedSettings
                      parameters={advancedParameters}
                      onChange={setAdvancedParameters}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Separator />

          {/* Submit Button */}
          <motion.div
            variants={fieldVariants}
            className="flex justify-center pt-4"
          >
            <Button
              type="submit"
              size="lg"
              disabled={isGenerating || estimating}
              className="min-w-[200px]"
            >
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Generating...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="generate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Generate Designs</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Cost Warning */}
          {estimating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Calculating cost estimate...
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </form>
      </Form>
    </motion.div>
  )
}