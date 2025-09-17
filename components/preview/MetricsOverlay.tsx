'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, DollarSign, TrendingUp, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ROIData {
  id: string;
  estimated_cost: number;
  roi_percentage: number;
  payback_timeline: string;
  cost_breakdown: any;
  notes: any;
}

interface MetricsOverlayProps {
  roiData: ROIData;
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  className?: string;
}

export function MetricsOverlay({
  roiData,
  onClose,
  position = 'top-right',
  className = '',
}: MetricsOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'costs' | 'roi' | 'timeline'>('overview');

  const costBreakdown = JSON.parse(roiData.cost_breakdown || '{}');
  const notes = JSON.parse(roiData.notes || '{}');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50 max-w-sm';

    switch (position) {
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'center':
        return `${baseClasses} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  const getRoiRating = (percentage: number) => {
    if (percentage >= 80) return { rating: 'Excellent', color: 'bg-primary/50', textColor: 'text-primary' };
    if (percentage >= 60) return { rating: 'Good', color: 'bg-primary/50', textColor: 'text-primary' };
    if (percentage >= 40) return { rating: 'Fair', color: 'bg-accent/500', textColor: 'text-accent-foreground' };
    return { rating: 'Poor', color: 'bg-destructive/50', textColor: 'text-destructive' };
  };

  const roiRating = getRoiRating(roiData.roi_percentage);

  // Chart data for cost breakdown
  const chartData = costBreakdown ? [
    { name: 'Materials', value: costBreakdown.materials, color: '#3b82f6' },
    { name: 'Labor', value: costBreakdown.labor, color: '#10b981' },
    { name: 'Permits', value: costBreakdown.permits, color: '#f59e0b' },
    { name: 'Overhead', value: costBreakdown.overhead, color: '#8b5cf6' },
    { name: 'Contingency', value: costBreakdown.contingency, color: '#ef4444' },
  ].filter(item => item.value > 0) : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  const TabButton = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
    <Button
      variant={activeTab === id ? 'default' : 'ghost'}
      size="sm"
      onClick={() => setActiveTab(id as any)}
      className="flex-1 text-xs"
    >
      {icon}
      {label}
    </Button>
  );

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      <Card className="shadow-lg border-2">
        {/* Header */}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4" />
              ROI Metrics
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Quick Overview */}
          <div className="space-y-3">
            {/* ROI Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">ROI Rating</span>
              <div className="flex items-center gap-2">
                <Badge className={roiRating.color}>
                  {roiRating.rating}
                </Badge>
                <span className="font-bold">{roiData.roi_percentage.toFixed(1)}%</span>
              </div>
            </div>

            {/* Cost */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Total Cost</span>
              <span className="font-bold">{formatCurrency(roiData.estimated_cost)}</span>
            </div>

            {/* Payback */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Payback</span>
              <span className="font-bold">{roiData.payback_timeline}</span>
            </div>

            {/* ROI Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>ROI Progress</span>
                <span>{roiData.roi_percentage.toFixed(1)}%</span>
              </div>
              <Progress
                value={Math.min(roiData.roi_percentage, 100)}
                className="h-2"
              />
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Tab Navigation */}
              <div className="grid grid-cols-4 gap-1">
                <TabButton
                  id="overview"
                  label="Overview"
                  icon={<Award className="h-3 w-3 mr-1" />}
                />
                <TabButton
                  id="costs"
                  label="Costs"
                  icon={<DollarSign className="h-3 w-3 mr-1" />}
                />
                <TabButton
                  id="roi"
                  label="ROI"
                  icon={<TrendingUp className="h-3 w-3 mr-1" />}
                />
                <TabButton
                  id="timeline"
                  label="Timeline"
                  icon={<Clock className="h-3 w-3 mr-1" />}
                />
              </div>

              {/* Tab Content */}
              <div className="min-h-[120px]">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-primary/5 p-2 rounded">
                        <div className="font-medium text-green-800">Investment</div>
                        <div className="text-green-900">{formatCurrency(roiData.estimated_cost)}</div>
                      </div>
                      <div className="bg-primary/5 p-2 rounded">
                        <div className="font-medium text-blue-800">Return</div>
                        <div className="text-blue-900">{roiData.roi_percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    {notes.marketComparison && (
                      <div className="text-xs">
                        <div className="font-medium mb-1">vs Market Average:</div>
                        <div className="text-muted-foreground">
                          {roiData.roi_percentage > notes.marketComparison.averageROI ? '↗️' : '↘️'}
                          {Math.abs(roiData.roi_percentage - notes.marketComparison.averageROI).toFixed(1)}%
                          {roiData.roi_percentage > notes.marketComparison.averageROI ? ' above' : ' below'} market
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'costs' && costBreakdown && (
                  <div className="space-y-3">
                    <div className="h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={15}
                            outerRadius={35}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1 text-xs">
                      {chartData.map((item) => (
                        <div key={item.name} className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'roi' && (
                  <div className="space-y-3">
                    <div className={`p-2 rounded ${roiRating.color} bg-opacity-10`}>
                      <div className={`font-medium ${roiRating.textColor}`}>
                        {roiRating.rating} ROI Performance
                      </div>
                      <div className="text-sm mt-1">
                        {roiData.roi_percentage.toFixed(1)}% return on investment
                      </div>
                    </div>
                    {notes.recommendations && (
                      <div className="text-xs space-y-1">
                        <div className="font-medium">Recommendations:</div>
                        <ul className="space-y-1 text-muted-foreground">
                          {notes.recommendations.slice(0, 2).map((rec: string, index: number) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{roiData.payback_timeline}</div>
                      <div className="text-xs text-muted-foreground">Payback Period</div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Break-even:</span>
                        <span className="font-medium">{roiData.payback_timeline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI Timeline:</span>
                        <span className="font-medium">Immediate</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MetricsOverlay;