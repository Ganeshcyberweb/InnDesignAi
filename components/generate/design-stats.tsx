'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import {
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Image as ImageIcon,
  Home,
  Palette,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react'

import type { DesignStats } from '@/app/types/design'

interface DesignStatsProps {
  stats: DesignStats
  loading?: boolean
}

export function DesignStats({ stats, loading = false }: DesignStatsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-8 bg-muted rounded w-1/2" />
                <div className="h-2 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`
    } else if (hours < 24) {
      return `${Math.round(hours)}h`
    } else {
      return `${Math.round(hours / 24)}d`
    }
  }

  // Calculate trends from monthly data
  const currentMonth = stats.monthly_usage[stats.monthly_usage.length - 1]
  const previousMonth = stats.monthly_usage[stats.monthly_usage.length - 2]
  const designTrend = previousMonth
    ? ((currentMonth?.count - previousMonth.count) / previousMonth.count) * 100
    : 0
  const spendTrend = previousMonth
    ? ((currentMonth?.cost - previousMonth.cost) / previousMonth.cost) * 100
    : 0

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Designs</p>
                  <p className="text-2xl font-bold">{stats.total_designs}</p>
                  {designTrend !== 0 && (
                    <p className={`text-xs flex items-center mt-1 ${
                      designTrend > 0 ? 'text-primary' : 'text-destructive'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {designTrend > 0 ? '+' : ''}{designTrend.toFixed(1)}% from last month
                    </p>
                  )}
                </div>
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.total_spent)}</p>
                  {spendTrend !== 0 && (
                    <p className={`text-xs flex items-center mt-1 ${
                      spendTrend > 0 ? 'text-destructive' : 'text-primary'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {spendTrend > 0 ? '+' : ''}{spendTrend.toFixed(1)}% from last month
                    </p>
                  )}
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                  <p className="text-2xl font-bold">{formatTime(stats.total_time_saved)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    vs traditional design process
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(stats.average_rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Favorites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Most Used Room</span>
              </CardTitle>
              <CardDescription>Your most popular room type for design generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{stats.most_used_room}</span>
                  <Badge variant="secondary">
                    {Math.round((stats.total_designs * 0.4))} designs
                  </Badge>
                </div>
                <Progress value={40} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  40% of your total designs
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Favorite Style</span>
              </CardTitle>
              <CardDescription>Your preferred design style</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{stats.favorite_style}</span>
                  <Badge variant="secondary">
                    {Math.round((stats.total_designs * 0.35))} designs
                  </Badge>
                </div>
                <Progress value={35} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  35% of your total designs
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Usage Chart */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Monthly Usage</span>
            </CardTitle>
            <CardDescription>Your design generation activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Chart bars */}
              <div className="flex items-end justify-between h-32 gap-2">
                {stats.monthly_usage.slice(-6).map((month, index) => {
                  const maxCount = Math.max(...stats.monthly_usage.map(m => m.count))
                  const height = (month.count / maxCount) * 100

                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full bg-primary rounded-t-sm min-h-[4px]"
                      />
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {month.month}
                      </p>
                    </div>
                  )
                })}
              </div>

              <Separator />

              {/* Chart details */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {stats.monthly_usage.slice(-6).map((month) => (
                  <div key={month.month} className="space-y-1">
                    <p className="text-sm font-medium">{month.month}</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <ImageIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{month.count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(month.cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Usage Insights */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Usage Insights</span>
            </CardTitle>
            <CardDescription>Key insights about your design patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Average Cost per Design</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.total_spent / stats.total_designs)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on {stats.total_designs} designs
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold">
                  {currentMonth?.count || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  designs generated
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Monthly Budget Used</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(currentMonth?.cost || 0)}
                </p>
                <Progress
                  value={Math.min(((currentMonth?.cost || 0) / 100) * 100, 100)}
                  className="w-full mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}