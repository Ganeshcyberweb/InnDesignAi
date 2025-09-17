'use client'

import { motion } from 'framer-motion'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { DollarSign, Clock, Zap, TrendingUp, AlertCircle, Check } from 'lucide-react'

import type { CostEstimate } from '@/app/types/design'

interface CostEstimatorProps {
  estimate: CostEstimate | null
  loading: boolean
}

export function CostEstimator({ estimate, loading }: CostEstimatorProps) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          <span className="text-sm text-muted-foreground">Calculating cost...</span>
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        </div>
      </motion.div>
    )
  }

  if (!estimate) {
    return (
      <div className="text-center py-6">
        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">
          Configure your generation settings to see cost estimate
        </p>
      </div>
    )
  }

  const isExpensive = estimate.total_cost > 2.0
  const isFast = estimate.estimated_time < 60

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Total Cost Display */}
      <motion.div variants={itemVariants}>
        <Card className={`${isExpensive ? 'bg-orange-50 border-orange-200' : 'bg-primary/5 border-primary/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Estimated Total</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(estimate.total_cost)}
                </p>
              </div>
              <div className="text-right space-y-1">
                <Badge variant={isExpensive ? "destructive" : "secondary"} className="text-xs">
                  {isExpensive ? 'Premium' : 'Affordable'}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(estimate.cost_per_image)} per image
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Time Estimate */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Generation Time</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm">{formatTime(estimate.estimated_time)}</span>
            <Badge variant={isFast ? "secondary" : "outline"} className="text-xs">
              {isFast ? 'Fast' : 'Standard'}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Cost Breakdown */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h4 className="text-sm font-semibold">Cost Breakdown</h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">AI Model Processing</span>
            <span className="font-mono">{formatCurrency(estimate.breakdown.model_cost)}</span>
          </div>
          <Progress
            value={(estimate.breakdown.model_cost / estimate.total_cost) * 100}
            className="h-2"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Image Storage</span>
            <span className="font-mono">{formatCurrency(estimate.breakdown.storage_cost)}</span>
          </div>
          <Progress
            value={(estimate.breakdown.storage_cost / estimate.total_cost) * 100}
            className="h-2"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Processing & Optimization</span>
            <span className="font-mono">{formatCurrency(estimate.breakdown.processing_cost)}</span>
          </div>
          <Progress
            value={(estimate.breakdown.processing_cost / estimate.total_cost) * 100}
            className="h-2"
          />
        </div>
      </motion.div>

      <Separator />

      {/* Savings & Tips */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h4 className="text-sm font-semibold flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Cost Optimization</span>
        </h4>

        <div className="space-y-2">
          {estimate.total_cost > 1.5 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Consider reducing the number of variations or using a more cost-effective model to save money.
              </AlertDescription>
            </Alert>
          )}

          {estimate.estimated_time > 120 && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-xs">
                This generation will take a while. Consider reducing inference steps for faster results.
              </AlertDescription>
            </Alert>
          )}

          {estimate.total_cost <= 1.0 && (
            <Alert className="bg-primary/5 border-primary/20">
              <Check className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs text-primary">
                Great choice! This configuration offers excellent value for money.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium">Money-saving tips:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Start with fewer variations (2-3) and generate more if needed</li>
            <li>• Use standard inference steps (50) for good quality/cost balance</li>
            <li>• Batch multiple similar requests together</li>
            <li>• Consider lower guidance scale for creative variations</li>
          </ul>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Per Image</p>
            <p className="text-sm font-semibold">{formatCurrency(estimate.cost_per_image)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Per Minute</p>
            <p className="text-sm font-semibold">
              {formatCurrency((estimate.total_cost / estimate.estimated_time) * 60)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Efficiency</p>
            <Badge variant="outline" className="text-xs">
              {estimate.total_cost <= 1.0 ? 'High' : estimate.total_cost <= 2.0 ? 'Good' : 'Premium'}
            </Badge>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}