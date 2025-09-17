'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/lib/auth/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, Sparkles, History, Settings } from 'lucide-react'

import { GenerationForm } from '@/components/generate/generation-form'
import { PreferencesPreview } from '@/components/generate/preferences-preview'
import { CostEstimator } from '@/components/generate/cost-estimator'
import { GenerationProgress } from '@/components/generate/generation-progress'
import { DesignGallery } from '@/components/generate/design-gallery'
import { DesignHistory } from '@/components/generate/design-history'
import { QuickPrompts } from '@/components/generate/quick-prompts'

import type { GenerationRequest, GenerationProgress as ProgressType, DesignWithRelations, CostEstimate } from '@/app/types/design'

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
  visible: { opacity: 1, y: 0 }
}

export default function GeneratePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('generate')
  const [generationRequest, setGenerationRequest] = useState<GenerationRequest | null>(null)
  const [generationProgress, setGenerationProgress] = useState<ProgressType | null>(null)
  const [completedDesigns, setCompletedDesigns] = useState<DesignWithRelations[]>([])
  const [recentDesigns, setRecentDesigns] = useState<DesignWithRelations[]>([])
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null)
  const [userPreferences, setUserPreferences] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Load user's existing preferences and recent designs
  useEffect(() => {
    if (!user) return

    const loadUserData = async () => {
      try {
        // Load recent designs
        const response = await fetch('/api/designs/recent')
        if (response.ok) {
          const data = await response.json()
          setRecentDesigns(data.designs)
        }

        // Load user preferences from last design
        const prefsResponse = await fetch('/api/user/preferences')
        if (prefsResponse.ok) {
          const prefsData = await prefsResponse.json()
          setUserPreferences(prefsData.preferences)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    loadUserData()
  }, [user])

  // Handle generation request
  const handleGenerationStart = async (request: GenerationRequest) => {
    setGenerationRequest(request)
    setIsGenerating(true)
    setActiveTab('progress')

    try {
      const response = await fetch('/api/ai/generate-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Failed to start generation')
      }

      const { generation_id } = await response.json()

      // Start polling for progress
      pollGenerationProgress(generation_id)
    } catch (error) {
      console.error('Generation error:', error)
      setIsGenerating(false)
      // Show error toast
    }
  }

  // Poll for generation progress
  const pollGenerationProgress = async (generationId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/ai/generate-progress/${generationId}`)
        if (response.ok) {
          const progress: ProgressType = await response.json()
          setGenerationProgress(progress)

          if (progress.status === 'completed') {
            clearInterval(pollInterval)
            setIsGenerating(false)

            // Load the completed design
            const designResponse = await fetch(`/api/designs/${progress.id}`)
            if (designResponse.ok) {
              const design: DesignWithRelations = await designResponse.json()
              setCompletedDesigns(prev => [design, ...prev])
              setActiveTab('results')
            }
          } else if (progress.status === 'failed') {
            clearInterval(pollInterval)
            setIsGenerating(false)
            // Show error
          }
        }
      } catch (error) {
        console.error('Error polling progress:', error)
      }
    }, 2000) // Poll every 2 seconds
  }

  const handleCostEstimate = (estimate: CostEstimate) => {
    setCostEstimate(estimate)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to access the design generation tools.
          </p>
          <Button asChild>
            <a href="/auth/signin">Sign In</a>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Design Generation</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your space with AI-powered interior design. Generate multiple variations
            instantly and find the perfect look for your room.
          </p>
          {costEstimate && (
            <Badge variant="secondary" className="text-sm">
              Estimated cost: ${costEstimate.total_cost.toFixed(2)} •
              Time: ~{Math.ceil(costEstimate.estimated_time / 60)} min
            </Badge>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generate" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Generate</span>
              </TabsTrigger>
              <TabsTrigger value="progress" disabled={!isGenerating && !generationProgress}>
                <span>Progress</span>
              </TabsTrigger>
              <TabsTrigger value="results" disabled={completedDesigns.length === 0}>
                <span>Results</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>

            {/* Generation Tab */}
            <TabsContent value="generate" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Prompts */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Start</CardTitle>
                      <CardDescription>
                        Choose from popular design prompts or create your own
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <QuickPrompts onPromptSelect={(prompt) => {
                        // Auto-fill the generation form with selected prompt
                      }} />
                    </CardContent>
                  </Card>

                  {/* Generation Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Design Parameters</CardTitle>
                      <CardDescription>
                        Customize your design generation request
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GenerationForm
                        onSubmit={handleGenerationStart}
                        onCostEstimate={handleCostEstimate}
                        initialPreferences={userPreferences}
                        isGenerating={isGenerating}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Current Preferences */}
                  {userPreferences && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Your Preferences</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PreferencesPreview preferences={userPreferences} />
                      </CardContent>
                    </Card>
                  )}

                  {/* Cost Estimator */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Estimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CostEstimator
                        estimate={costEstimate}
                        loading={!costEstimate}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <Card>
                <CardContent className="p-6">
                  <GenerationProgress
                    progress={generationProgress}
                    request={generationRequest}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Designs</CardTitle>
                  <CardDescription>
                    Your AI-generated interior designs are ready
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DesignGallery
                    designs={completedDesigns}
                    onRegenerate={handleGenerationStart}
                    onSave={(designId) => {
                      // Handle save to favorites
                    }}
                    onShare={(designId) => {
                      // Handle sharing
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Design History</CardTitle>
                  <CardDescription>
                    View and manage your previous designs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DesignHistory
                    designs={recentDesigns}
                    onDesignSelect={(design) => {
                      setCompletedDesigns([design])
                      setActiveTab('results')
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}