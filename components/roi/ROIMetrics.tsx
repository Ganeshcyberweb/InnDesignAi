'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Clock, Target } from 'lucide-react';
import { ROIMetrics as ROIMetricsType } from '@/app/types/roi';

interface ROIMetricsProps {
  metrics: ROIMetricsType;
  showProjections?: boolean;
  className?: string;
}

export function ROIMetrics({ metrics, showProjections = true, className = '' }: ROIMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Generate projection data for charts
  const generateProjectionData = () => {
    const data = [];
    const monthlyAppreciation = 0.005; // 0.5% monthly (6% annual)
    const baseValue = metrics.estimatedValueIncrease;

    for (let month = 0; month <= 60; month += 6) {
      const appreciatedValue = baseValue * Math.pow(1 + monthlyAppreciation, month);
      data.push({
        month,
        year: (month / 12).toFixed(1),
        value: Math.round(appreciatedValue),
        cumulative: Math.round(appreciatedValue + (metrics.annualReturn * (month / 12))),
      });
    }
    return data;
  };

  const projectionData = generateProjectionData();

  // ROI Rating
  const getRoiRating = (roiPercentage: number) => {
    if (roiPercentage >= 80) return { rating: 'Excellent', color: 'bg-primary/50', variant: 'default' as const };
    if (roiPercentage >= 60) return { rating: 'Good', color: 'bg-primary/50', variant: 'secondary' as const };
    if (roiPercentage >= 40) return { rating: 'Fair', color: 'bg-accent/500', variant: 'outline' as const };
    return { rating: 'Poor', color: 'bg-destructive/50', variant: 'destructive' as const };
  };

  const roiRating = getRoiRating(metrics.roiPercentage);

  // Payback timeline visualization
  const getPaybackStatus = (months: number) => {
    if (months <= 24) return { status: 'Quick', color: 'text-primary' };
    if (months <= 48) return { status: 'Moderate', color: 'text-primary' };
    if (months <= 72) return { status: 'Slow', color: 'text-accent-foreground' };
    return { status: 'Very Slow', color: 'text-destructive' };
  };

  const paybackStatus = getPaybackStatus(metrics.paybackTimelineMonths);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">Year {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          ROI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">ROI Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={roiRating.variant}>{roiRating.rating}</Badge>
              <span className="text-2xl font-bold">{formatPercentage(metrics.roiPercentage)}</span>
            </div>
            <Progress
              value={Math.min(metrics.roiPercentage, 100)}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Payback Timeline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${paybackStatus.color}`}>
                {paybackStatus.status}
              </span>
              <span className="text-2xl font-bold">
                {metrics.paybackTimelineMonths} months
              </span>
            </div>
            <Progress
              value={Math.max(0, 100 - (metrics.paybackTimelineMonths / 60) * 100)}
              className="h-2"
            />
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-green-800">Value Increase</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(metrics.estimatedValueIncrease)}
            </p>
            <p className="text-xs text-primary mt-1">
              From {formatCurrency(metrics.totalInvestment)} investment
            </p>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-blue-800">Annual Return</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(metrics.annualReturn)}
            </p>
            <p className="text-xs text-primary mt-1">
              {formatPercentage((metrics.annualReturn / metrics.totalInvestment) * 100)} annually
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">5-Year Value</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {formatCurrency(metrics.fiveYearProjection)}
            </p>
            <p className="text-xs text-purple-700 mt-1">
              Total projected value
            </p>
          </div>
        </div>

        {/* Value Projection Chart */}
        {showProjections && (
          <div className="space-y-4">
            <h4 className="font-medium">5-Year Value Projection</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                    label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Property Value Increase"
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="Total Return"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ROI Timeline */}
        <div className="space-y-4">
          <h4 className="font-medium">ROI Timeline</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span className="font-medium">Initial Investment</span>
              <span className="text-destructive">-{formatCurrency(metrics.totalInvestment)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
              <span className="font-medium">Immediate Value Gain</span>
              <span className="text-primary">+{formatCurrency(metrics.estimatedValueIncrease)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
              <span className="font-medium">Net Gain</span>
              <span className="text-primary font-bold">
                +{formatCurrency(metrics.estimatedValueIncrease - metrics.totalInvestment)}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Performance Indicators</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ROI vs Investment:</span>
              <span className="font-medium ml-2">
                {formatPercentage((metrics.estimatedValueIncrease / metrics.totalInvestment) * 100)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Monthly Return:</span>
              <span className="font-medium ml-2">
                {formatCurrency(metrics.annualReturn / 12)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Break-even Point:</span>
              <span className="font-medium ml-2">
                {(metrics.paybackTimelineMonths / 12).toFixed(1)} years
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Return (5yr):</span>
              <span className="font-medium ml-2">
                {formatPercentage(((metrics.fiveYearProjection - metrics.totalInvestment) / metrics.totalInvestment) * 100)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ROIMetrics;