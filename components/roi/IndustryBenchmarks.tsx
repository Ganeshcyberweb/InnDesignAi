'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { MarketComparison, ROIMetrics } from '@/app/types/roi';

interface IndustryBenchmarksProps {
  comparison: MarketComparison;
  userMetrics: ROIMetrics;
  className?: string;
}

export function IndustryBenchmarks({ comparison, userMetrics, className = '' }: IndustryBenchmarksProps) {
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

  // Calculate performance vs benchmarks
  const roiComparison = {
    user: userMetrics.roiPercentage,
    market: comparison.averageROI,
    difference: userMetrics.roiPercentage - comparison.averageROI,
  };

  const costComparison = {
    user: userMetrics.totalInvestment,
    market: comparison.averageCost,
    difference: userMetrics.totalInvestment - comparison.averageCost,
  };

  const timelineComparison = {
    user: userMetrics.paybackTimelineMonths,
    market: comparison.averageTimeframe,
    difference: userMetrics.paybackTimelineMonths - comparison.averageTimeframe,
  };

  // Chart data
  const benchmarkData = [
    {
      metric: 'ROI %',
      user: userMetrics.roiPercentage,
      market: comparison.averageROI,
      userLabel: 'Your Project',
      marketLabel: 'Market Average',
    },
    {
      metric: 'Cost',
      user: userMetrics.totalInvestment / 1000, // Convert to thousands for readability
      market: comparison.averageCost / 1000,
      userLabel: 'Your Project',
      marketLabel: 'Market Average',
    },
    {
      metric: 'Timeline (mo)',
      user: userMetrics.paybackTimelineMonths,
      market: comparison.averageTimeframe,
      userLabel: 'Your Project',
      marketLabel: 'Market Average',
    },
  ];

  const getPerformanceIndicator = (difference: number, type: 'roi' | 'cost' | 'timeline') => {
    let isGood = false;
    let icon = <AlertTriangle className="h-4 w-4" />;
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
    let text = '';

    switch (type) {
      case 'roi':
        isGood = difference > 0;
        text = isGood ? `+${difference.toFixed(1)}% above market` : `${difference.toFixed(1)}% below market`;
        break;
      case 'cost':
        isGood = difference < 0;
        text = isGood
          ? `${formatCurrency(Math.abs(difference))} below market`
          : `${formatCurrency(difference)} above market`;
        break;
      case 'timeline':
        isGood = difference < 0;
        text = isGood
          ? `${Math.abs(difference)} months faster`
          : `${difference} months slower`;
        break;
    }

    if (isGood) {
      icon = <CheckCircle className="h-4 w-4" />;
      variant = 'default';
    } else {
      icon = <AlertTriangle className="h-4 w-4" />;
      variant = 'destructive';
    }

    return { icon, variant, text, isGood };
  };

  const roiIndicator = getPerformanceIndicator(roiComparison.difference, 'roi');
  const costIndicator = getPerformanceIndicator(costComparison.difference, 'cost');
  const timelineIndicator = getPerformanceIndicator(timelineComparison.difference, 'timeline');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'user' ? 'Your Project' : 'Market Average'}: {
                label.includes('Cost')
                  ? formatCurrency(entry.value * 1000)
                  : label.includes('ROI')
                  ? formatPercentage(entry.value)
                  : `${entry.value} months`
              }
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
          <Award className="h-5 w-5" />
          Industry Benchmarks
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Compare your project against market averages
          <Badge variant="outline" className="ml-2">
            {comparison.confidenceLevel}% confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ROI Performance</span>
              <Badge variant={roiIndicator.variant} className="text-xs">
                {roiIndicator.isGood ? 'Above Market' : 'Below Market'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {roiIndicator.icon}
              <span className="text-sm">{roiIndicator.text}</span>
            </div>
            <Progress
              value={(userMetrics.roiPercentage / comparison.averageROI) * 100}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cost Efficiency</span>
              <Badge variant={costIndicator.variant} className="text-xs">
                {costIndicator.isGood ? 'Below Market' : 'Above Market'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {costIndicator.icon}
              <span className="text-sm">{costIndicator.text}</span>
            </div>
            <Progress
              value={Math.max(0, 100 - ((userMetrics.totalInvestment / comparison.averageCost) * 100))}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Timeline</span>
              <Badge variant={timelineIndicator.variant} className="text-xs">
                {timelineIndicator.isGood ? 'Faster' : 'Slower'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {timelineIndicator.icon}
              <span className="text-sm">{timelineIndicator.text}</span>
            </div>
            <Progress
              value={Math.max(0, 100 - ((userMetrics.paybackTimelineMonths / comparison.averageTimeframe) * 100))}
              className="h-2"
            />
          </div>
        </div>

        {/* Benchmark Comparison Chart */}
        <div className="space-y-4">
          <h4 className="font-medium">Market Comparison</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="user" fill="#3b82f6" name="Your Project" />
                <Bar dataKey="market" fill="#94a3b8" name="Market Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">ROI Comparison</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-primary">Your Project:</span>
                <span className="font-bold text-blue-900">{formatPercentage(userMetrics.roiPercentage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary">Market Average:</span>
                <span className="font-medium text-blue-800">{formatPercentage(comparison.averageROI)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-primary">Difference:</span>
                <span className={`font-bold ${roiComparison.difference >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {roiComparison.difference >= 0 ? '+' : ''}{formatPercentage(roiComparison.difference)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Cost Comparison</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-primary">Your Project:</span>
                <span className="font-bold text-green-900">{formatCurrency(userMetrics.totalInvestment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary">Market Average:</span>
                <span className="font-medium text-green-800">{formatCurrency(comparison.averageCost)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-primary">Difference:</span>
                <span className={`font-bold ${costComparison.difference <= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {costComparison.difference >= 0 ? '+' : ''}{formatCurrency(costComparison.difference)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Timeline Comparison</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Your Project:</span>
                <span className="font-bold text-purple-900">{userMetrics.paybackTimelineMonths} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Market Average:</span>
                <span className="font-medium text-purple-800">{comparison.averageTimeframe} months</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-purple-700">Difference:</span>
                <span className={`font-bold ${timelineComparison.difference <= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {timelineComparison.difference >= 0 ? '+' : ''}{timelineComparison.difference} months
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Context */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Market Context</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Industry Performance:</p>
              <ul className="space-y-1">
                <li>• Average ROI: {formatPercentage(comparison.averageROI)}</li>
                <li>• Typical Cost: {formatCurrency(comparison.averageCost)}</li>
                <li>• Standard Timeline: {comparison.averageTimeframe} months</li>
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Data Reliability:</p>
              <ul className="space-y-1">
                <li>• Confidence Level: {comparison.confidenceLevel}%</li>
                <li>• Based on recent market data</li>
                <li>• Regional factors considered</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default IndustryBenchmarks;