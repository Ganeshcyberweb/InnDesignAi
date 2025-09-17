'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Image as ImageIcon,
  Settings,
  Sparkles,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react'

import type { GenerationProgress as ProgressType, GenerationRequest } from '@/app/types/design'

interface GenerationProgressProps {
  progress: ProgressType | null
  request: GenerationRequest | null
  onCancel?: () => void
  onRetry?: () => void
}

export function GenerationProgress({
  progress,
  request,
  onCancel,
  onRetry
}: GenerationProgressProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0)

  // Update time tracking
  useEffect(() => {
    if (!progress || progress.status === 'completed' || progress.status === 'failed') {
      return
    }

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
      if (progress.estimated_completion > 0) {
        setEstimatedTimeRemaining(Math.max(0, progress.estimated_completion - 1))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [progress])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-5 w-5 text-primary" />
      case 'processing':
      case 'generating':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />
      case 'post-processing':
        return <Settings className="h-5 w-5 text-orange-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return <Loader2 className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'queued':
        return 'Your request is in the queue...'
      case 'processing':
        return 'Processing your design parameters...'
      case 'generating':
        return 'AI is creating your designs...'
      case 'post-processing':
        return 'Optimizing and finalizing images...'
      case 'completed':
        return 'Your designs are ready!'
      case 'failed':
        return 'Generation failed'
      default:
        return 'Preparing...'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: { width: '100%' }
  }

  if (!progress && !request) {
    return (
      <div className="text-center py-12">
        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">No generation in progress</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Main Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {progress && getStatusIcon(progress.status)}
              <div>
                <CardTitle className="text-lg">
                  {progress ? getStatusMessage(progress.status) : 'Preparing Generation...'}
                </CardTitle>
                <CardDescription>
                  {progress?.current_step || 'Initializing AI generation process'}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={
                progress?.status === 'completed' ? 'default' :
                progress?.status === 'failed' ? 'destructive' :
                'secondary'
              }
            >
              {progress?.status || 'preparing'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          {progress && (
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-mono">{progress.progress}%</span>
              </div>
              <div className="relative">
                <Progress value={progress.progress} className="h-3" />
                <motion.div
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-30"
                  variants={progressBarVariants}
                  style={{ width: `${progress.progress}%` }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}

          {/* Time Information */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Time Elapsed</p>
              <p className="text-lg font-mono font-semibold">{formatTime(timeElapsed)}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Est. Remaining</p>
              <p className="text-lg font-mono font-semibold">
                {progress ? formatTime(progress.estimated_completion) : '--:--'}
              </p>
            </div>
          </motion.div>

          {/* Generation Details */}
          {request && (
            <motion.div variants={itemVariants} className="space-y-4">
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Generation Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Type:</span>
                    <span className="font-medium">{request.preferences.room_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Style:</span>
                    <span className="font-medium">{request.preferences.style_preference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AI Model:</span>
                    <span className="font-medium">{request.ai_model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Variations:</span>
                    <span className="font-medium">{request.generation_count}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Partial Results Preview */}
          <AnimatePresence>
            {progress?.partial_results && progress.partial_results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                variants={itemVariants}
                className="space-y-3"
              >
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <h4 className="font-semibold text-sm">Preview</h4>
                    <Badge variant="outline" className="text-xs">
                      {progress.partial_results.length} ready
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {progress.partial_results.map((url, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-square bg-muted rounded-lg overflow-hidden"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {progress?.errors && progress.errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                variants={itemVariants}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {progress.errors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex justify-center space-x-3">
            {progress?.status === 'failed' && onRetry && (
              <Button onClick={onRetry} className="min-w-[120px]">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}

            {progress?.status === 'completed' && (
              <Button className="min-w-[120px]">
                <Download className="h-4 w-4 mr-2" />
                View Results
              </Button>
            )}

            {progress?.status !== 'completed' && progress?.status !== 'failed' && onCancel && (
              <Button variant="outline" onClick={onCancel} className="min-w-[120px]">
                Cancel
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Generation Steps Visualization */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generation Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'queued', label: 'Queued', description: 'Request received and queued' },
                { id: 'processing', label: 'Processing', description: 'Analyzing prompt and preferences' },
                { id: 'generating', label: 'Generating', description: 'AI creating design variations' },
                { id: 'post-processing', label: 'Finalizing', description: 'Optimizing and preparing images' },
                { id: 'completed', label: 'Complete', description: 'Designs ready for viewing' }
              ].map((step, index) => {
                const isActive = progress?.status === step.id
                const isCompleted = progress && ['processing', 'generating', 'post-processing', 'completed'].indexOf(progress.status) > ['processing', 'generating', 'post-processing', 'completed'].indexOf(step.id)
                const isCurrent = progress?.status === step.id

                return (
                  <motion.div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isCurrent ? 'bg-primary/10 border border-primary/20' :
                      isCompleted ? 'bg-primary/5 border border-primary/20' :
                      'bg-muted/30'
                    }`}
                    animate={{
                      scale: isCurrent ? 1.02 : 1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-primary/50 text-white' :
                      isCurrent ? 'bg-primary text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : isCurrent ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="text-xs font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${
                        isCurrent ? 'text-primary' :
                        isCompleted ? 'text-primary' :
                        'text-muted-foreground'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {isCurrent && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4"
                      >
                        <Zap className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}