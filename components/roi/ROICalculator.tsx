'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { ROICalculationInput, ROICalculationResult } from '@/app/types/roi';
import ROICalculatorEngine from '@/lib/roi/calculator';
import { CostBreakdown } from './CostBreakdown';
import { ROIMetrics } from './ROIMetrics';
import { IndustryBenchmarks } from './IndustryBenchmarks';
import { toast } from 'sonner';

interface ROICalculatorProps {
  designId?: string;
  initialData?: Partial<ROICalculationInput>;
  onCalculationComplete?: (result: ROICalculationResult) => void;
  className?: string;
}

export function ROICalculator({
  designId,
  initialData,
  onCalculationComplete,
  className = '',
}: ROICalculatorProps) {
  const [input, setInput] = useState<ROICalculationInput>({
    roomType: initialData?.roomType || 'living_room',
    roomSize: initialData?.roomSize || 'medium',
    style: initialData?.style || 'mid_range',
    currentPropertyValue: initialData?.currentPropertyValue || 500000,
    squareFootage: initialData?.squareFootage || 200,
    region: initialData?.region || 'suburban',
    qualityLevel: initialData?.qualityLevel || 'mid-range',
    timeline: initialData?.timeline || 12,
  });

  const [result, setResult] = useState<ROICalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.currentPropertyValue > 0 && input.squareFootage > 0) {
        handleCalculate();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));

      const calculationResult = ROICalculatorEngine.calculateROI(input);
      setResult(calculationResult);

      if (onCalculationComplete) {
        onCalculationComplete(calculationResult);
      }

      // Save to database if designId is provided
      if (designId && calculationResult) {
        await saveROICalculation(designId, calculationResult);
      }
    } catch (error) {
      console.error('ROI calculation error:', error);
      toast.error('Failed to calculate ROI. Please check your inputs.');
    } finally {
      setIsCalculating(false);
    }
  };

  const saveROICalculation = async (designId: string, result: ROICalculationResult) => {
    try {
      const response = await fetch('/api/roi/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designId,
          calculation: result,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save ROI calculation');
      }

      toast.success('ROI calculation saved successfully');
    } catch (error) {
      console.error('Error saving ROI calculation:', error);
      toast.error('Failed to save ROI calculation');
    }
  };

  const handleInputChange = (field: keyof ROICalculationInput, value: any) => {
    setInput(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            ROI Calculator
          </CardTitle>
          <CardDescription>
            Calculate renovation costs and return on investment for your design project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select
                value={input.roomType}
                onValueChange={(value) => handleInputChange('roomType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                  <SelectItem value="living_room">Living Room</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="dining_room">Dining Room</SelectItem>
                  <SelectItem value="home_office">Home Office</SelectItem>
                  <SelectItem value="basement">Basement</SelectItem>
                  <SelectItem value="attic">Attic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Room Size */}
            <div className="space-y-2">
              <Label htmlFor="roomSize">Room Size</Label>
              <Select
                value={input.roomSize}
                onValueChange={(value) => handleInputChange('roomSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (&lt; 100 sq ft)</SelectItem>
                  <SelectItem value="medium">Medium (100-200 sq ft)</SelectItem>
                  <SelectItem value="large">Large (200-400 sq ft)</SelectItem>
                  <SelectItem value="extra_large">Extra Large (&gt; 400 sq ft)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality Level */}
            <div className="space-y-2">
              <Label htmlFor="qualityLevel">Quality Level</Label>
              <Select
                value={input.qualityLevel}
                onValueChange={(value) => handleInputChange('qualityLevel', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quality level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid-range">Mid-Range</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Square Footage */}
            <div className="space-y-2">
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                type="number"
                value={input.squareFootage}
                onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || 0)}
                placeholder="200"
                min="1"
                max="10000"
              />
            </div>

            {/* Current Property Value */}
            <div className="space-y-2">
              <Label htmlFor="propertyValue">Current Property Value</Label>
              <Input
                id="propertyValue"
                type="number"
                value={input.currentPropertyValue}
                onChange={(e) => handleInputChange('currentPropertyValue', parseInt(e.target.value) || 0)}
                placeholder="500000"
                min="1"
                step="1000"
              />
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={input.region}
                onValueChange={(value) => handleInputChange('region', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major_city">Major City</SelectItem>
                  <SelectItem value="suburban">Suburban</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex items-center gap-2"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  Calculate ROI
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDetailedView(!showDetailedView)}
              disabled={!result}
            >
              {showDetailedView ? 'Simple View' : 'Detailed View'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Quick Results */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold">${result.costBreakdown.total.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ROI</p>
                    <p className="text-2xl font-bold">{result.roiMetrics.roiPercentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Value Increase</p>
                    <p className="text-2xl font-bold">${result.roiMetrics.estimatedValueIncrease.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payback</p>
                    <p className="text-2xl font-bold">{result.roiMetrics.paybackTimelineMonths}mo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Components */}
          {showDetailedView && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CostBreakdown breakdown={result.costBreakdown} />
              <ROIMetrics metrics={result.roiMetrics} />
            </div>
          )}

          <IndustryBenchmarks
            comparison={result.marketComparison}
            userMetrics={result.roiMetrics}
          />

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        {index + 1}
                      </Badge>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risk Factors */}
          {result.riskFactors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Risk Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="destructive" className="mt-0.5">
                        !
                      </Badge>
                      <p className="text-sm">{risk}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default ROICalculator;