'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { CostBreakdown as CostBreakdownType } from '@/app/types/roi';

interface CostBreakdownProps {
  breakdown: CostBreakdownType;
  showChart?: boolean;
  className?: string;
}

const COLORS = {
  materials: '#3b82f6',
  labor: '#10b981',
  permits: '#f59e0b',
  overhead: '#8b5cf6',
  contingency: '#ef4444',
};

export function CostBreakdown({ breakdown, showChart = true, className = '' }: CostBreakdownProps) {
  const costItems = [
    { name: 'Materials', value: breakdown.materials, color: COLORS.materials },
    { name: 'Labor', value: breakdown.labor, color: COLORS.labor },
    { name: 'Permits', value: breakdown.permits, color: COLORS.permits },
    { name: 'Overhead', value: breakdown.overhead, color: COLORS.overhead },
    { name: 'Contingency', value: breakdown.contingency, color: COLORS.contingency },
  ];

  const chartData = costItems.map(item => ({
    name: item.name,
    value: item.value,
    percentage: Math.round((item.value / breakdown.total) * 100),
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <div className="text-sm text-muted-foreground">
          Total Project Cost: <span className="font-bold text-lg text-foreground">
            {formatCurrency(breakdown.total)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Detailed List */}
        <div className="space-y-4">
          {costItems.map((item) => {
            const percentage = (item.value / breakdown.total) * 100;
            return (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(item.value)}</div>
                    <div className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  style={{
                    '--progress-background': item.color,
                  } as React.CSSProperties}
                />
              </div>
            );
          })}
        </div>

        {/* Charts */}
        {showChart && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="h-64">
              <h4 className="text-sm font-medium mb-2">Cost Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={costItems[index].color}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="h-64">
              <h4 className="text-sm font-medium mb-2">Cost Comparison</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={costItems[index].color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Cost Insights */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Cost Insights</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              • Materials and labor account for {Math.round(((breakdown.materials + breakdown.labor) / breakdown.total) * 100)}% of total cost
            </li>
            <li>
              • Contingency budget provides {Math.round((breakdown.contingency / breakdown.total) * 100)}% buffer for unexpected costs
            </li>
            <li>
              • Permits and overhead add {Math.round(((breakdown.permits + breakdown.overhead) / breakdown.total) * 100)}% to base construction costs
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default CostBreakdown;