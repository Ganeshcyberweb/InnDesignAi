'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { Zap, Clock, DollarSign, Star, ChevronDown, ChevronUp, Info } from 'lucide-react'

import type { AIProvider, AIModel } from '@/app/types/design'

interface ProviderSelectorProps {
  providers: AIProvider[]
  selectedProvider: AIProvider | null
  onProviderChange: (provider: AIProvider) => void
  onModelChange: (modelId: string) => void
}

export function ProviderSelector({
  providers,
  selectedProvider,
  onProviderChange,
  onModelChange
}: ProviderSelectorProps) {
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('')

  const handleProviderSelect = (provider: AIProvider) => {
    onProviderChange(provider)
    if (provider.models.length > 0) {
      const defaultModel = provider.models[0]
      setSelectedModel(defaultModel.id)
      onModelChange(defaultModel.id)
    }
  }

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
    onModelChange(modelId)
  }

  const toggleProviderExpansion = (providerId: string) => {
    setExpandedProvider(expandedProvider === providerId ? null : providerId)
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

  const providerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (providers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Loading AI providers...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <h4 className="font-semibold">AI Provider</h4>
        <Badge variant="outline" className="text-xs">
          {providers.length} available
        </Badge>
      </div>

      <RadioGroup
        value={selectedProvider?.id || ''}
        onValueChange={(value) => {
          const provider = providers.find(p => p.id === value)
          if (provider) handleProviderSelect(provider)
        }}
        className="space-y-3"
      >
        {providers.map((provider, index) => (
          <motion.div
            key={provider.id}
            variants={providerVariants}
            className="space-y-2"
          >
            <Card className={`cursor-pointer transition-all ${
              selectedProvider?.id === provider.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={provider.id} id={provider.id} />

                  <div className="flex-1">
                    <Label
                      htmlFor={provider.id}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{provider.name}</span>
                          {provider.id === 'replicate' && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {provider.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>${provider.pricing.cost_per_image}/image</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="h-3 w-3" />
                            <span>{provider.models.length} models</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Max {provider.max_variations} variations</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleProviderExpansion(provider.id)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        {expandedProvider === provider.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </Label>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1 mt-3 ml-6">
                  {provider.capabilities.map((capability) => (
                    <Badge key={capability} variant="outline" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expanded Provider Details */}
            <AnimatePresence>
              {expandedProvider === provider.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-6"
                >
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base">Available Models</CardTitle>
                      <CardDescription>
                        Choose the AI model that best fits your needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <RadioGroup
                        value={selectedModel}
                        onValueChange={handleModelSelect}
                        className="space-y-3"
                      >
                        {provider.models.map((model) => (
                          <div
                            key={model.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border ${
                              selectedModel === model.id
                                ? 'bg-primary/5 border-primary'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <RadioGroupItem value={model.id} id={model.id} />

                            <div className="flex-1">
                              <Label htmlFor={model.id} className="cursor-pointer">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{model.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {model.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {model.description}
                                  </p>

                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <span>{model.resolution}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>~{model.generation_time_estimate}s</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <DollarSign className="h-3 w-3" />
                                      <span>${model.cost_per_image}</span>
                                    </div>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </RadioGroup>

      {/* Selected Model Summary */}
      {selectedProvider && selectedModel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    Selected: {selectedProvider.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Model: {selectedProvider.models.find(m => m.id === selectedModel)?.name}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span>
                      ${selectedProvider.models.find(m => m.id === selectedModel)?.cost_per_image}/image
                    </span>
                    <span>•</span>
                    <span>
                      ~{selectedProvider.models.find(m => m.id === selectedModel)?.generation_time_estimate}s generation
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}