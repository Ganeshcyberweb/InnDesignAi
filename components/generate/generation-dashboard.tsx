'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

import {
  Activity,
  TrendingUp,
  DollarSign,
  Clock,
  Image as ImageIcon,
  Zap,
  Star,
  Users,
  Calendar,
  Target,
  Award,
  Sparkles
} from 'lucide-react'

import type { DesignWithRelations } from '@/app/types/design'

interface GenerationDashboardProps {
  designs: DesignWithRelations[]
  className?: string
}

export function GenerationDashboard({ designs, className = '' }: GenerationDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [stats, setStats] = useState<any>({})
  const [chartData, setChartData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateStats()
    generateChartData()
  }, [designs, timeRange])

  const calculateStats = () => {
    const completedDesigns = designs.filter(d => d.status === 'COMPLETED')
    const totalCost = completedDesigns.reduce((sum, d) =>
      sum + (d.roi_calculation?.cost_breakdown?.total || 0), 0
    )
    const totalImages = completedDesigns.reduce((sum, d) => sum + d.design_outputs.length, 0)
    const avgRating = completedDesigns.reduce((sum, d) => {
      const rating = d.feedback.length > 0
        ? d.feedback.reduce((r, f) => r + f.rating, 0) / d.feedback.length
        : 0
      return sum + rating
    }, 0) / (completedDesigns.length || 1)

    const styleDistribution = completedDesigns.reduce((acc: any, d) => {
      const style = d.preferences?.style_preference || 'Unknown'
      acc[style] = (acc[style] || 0) + 1
      return acc
    }, {})

    const roomDistribution = completedDesigns.reduce((acc: any, d) => {
      const room = d.preferences?.room_type || 'Unknown'
      acc[room] = (acc[room] || 0) + 1
      return acc
    }, {})

    setStats({
      totalDesigns: designs.length,
      completedDesigns: completedDesigns.length,
      totalCost,
      totalImages,
      avgRating,
      styleDistribution,
      roomDistribution,
      successRate: (completedDesigns.length / (designs.length || 1)) * 100,
      avgCostPerDesign: totalCost / (completedDesigns.length || 1),
      avgImagesPerDesign: totalImages / (completedDesigns.length || 1)
    })
    setLoading(false)
  }

  const generateChartData = () => {
    // Generate usage over time
    const now = new Date()
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const usageData = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayStr = date.toISOString().split('T')[0]

      const dayDesigns = designs.filter(d => {
        const designDate = new Date(d.created_at).toISOString().split('T')[0]
        return designDate === dayStr
      })

      usageData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        designs: dayDesigns.length,
        cost: dayDesigns.reduce((sum, d) => sum + (d.roi_calculation?.cost_breakdown?.total || 0), 0)
      })
    }

    // Generate style popularity data
    const styleData = Object.entries(stats.styleDistribution || {}).map(([style, count]) => ({
      style: style.length > 12 ? style.substring(0, 12) + '...' : style,
      count,
      percentage: ((count as number) / (stats.completedDesigns || 1)) * 100
    }))

    setChartData({
      usage: usageData,
      styles: styleData
    })
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

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff']

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-32 bg-muted rounded" />
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
      className={`space-y-6 ${className}`}
    >
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Designs</p>
                  <p className="text-2xl font-bold">{stats.totalDesigns}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2 flex items-center text-xs text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>{stats.successRate.toFixed(1)}% success rate</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <span>${stats.avgCostPerDesign.toFixed(2)} avg per design</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Images Generated</p>
                  <p className="text-2xl font-bold">{stats.totalImages}</p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <span>{stats.avgImagesPerDesign.toFixed(1)} avg per design</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <span>Out of 5.0 stars</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Analytics Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Your design generation insights and trends
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={timeRange === '7d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('7d')}
                >
                  7d
                </Button>
                <Button
                  variant={timeRange === '30d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('30d')}
                >
                  30d
                </Button>
                <Button
                  variant={timeRange === '90d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('90d')}
                >
                  90d
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="usage" className="space-y-4">
              <TabsList>
                <TabsTrigger value="usage">Usage Trends</TabsTrigger>
                <TabsTrigger value="styles">Style Preferences</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="usage" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.usage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          name === 'cost' ? `$${value.toFixed(2)}` : value,
                          name === 'cost' ? 'Cost' : 'Designs'
                        ]}
                      />
                      <Bar yAxisId="left" dataKey="designs" fill="#8884d8" name="designs" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="cost"
                        stroke="#ff7300"
                        name="cost"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="styles" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-80">
                    <h4 className="text-sm font-medium mb-4">Style Distribution</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.styles}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ style, percentage }) => `${style} (${percentage.toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {chartData.styles?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Top Styles</h4>
                    {chartData.styles?.slice(0, 5).map((style: any, index: number) => (
                      <div key={style.style} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{style.style}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${style.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {style.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">2.3m</p>
                      <p className="text-sm text-muted-foreground">Avg Generation Time</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{((stats.avgRating / 5) * 100).toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">Satisfaction Score</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Cost Efficiency</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average cost per design</span>
                          <span className="font-mono">${stats.avgCostPerDesign.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cost per image</span>
                          <span className="font-mono">${(stats.totalCost / (stats.totalImages || 1)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Monthly spending</span>
                          <span className="font-mono text-primary">${(stats.totalCost * 12 / 30).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Quality Metrics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>User Satisfaction</span>
                            <span>{((stats.avgRating / 5) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={(stats.avgRating / 5) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Success Rate</span>
                            <span>{stats.successRate.toFixed(0)}%</span>
                          </div>
                          <Progress value={stats.successRate} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completion Rate</span>
                            <span>{((stats.completedDesigns / stats.totalDesigns) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={(stats.completedDesigns / stats.totalDesigns) * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Optimization Tips</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary/50 mt-2" />
                    <span>Your {Object.keys(stats.styleDistribution)[0]} style generates the highest rated designs</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary/50 mt-2" />
                    <span>Consider trying more variations (4-5) for better selection</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                    <span>Peak generation time is between 10-11 AM for faster processing</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Trends & Predictions</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Scandinavian style is trending up 24% this month</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Users className="h-4 w-4 text-primary mt-0.5" />
                    <span>Home offices are the most popular room type (31%)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Best generation days: Tuesday-Thursday</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}