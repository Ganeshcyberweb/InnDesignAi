'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calculator, Eye, BarChart3, Settings, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { DesignPreview } from '@/components/preview/DesignPreview';
import { ROICalculator } from '@/components/roi/ROICalculator';
import { CostBreakdown } from '@/components/roi/CostBreakdown';
import { ROIMetrics } from '@/components/roi/ROIMetrics';
import { IndustryBenchmarks } from '@/components/roi/IndustryBenchmarks';
import { ROICalculationResult } from '@/app/types/roi';
import { toast } from 'sonner';

interface Design {
  id: string;
  input_prompt: string;
  uploaded_image_url: string | null;
  ai_model_used: string;
  status: string;
  created_at: string;
  updated_at: string;
  preferences: any;
  design_outputs: any[];
  roi_calculations: any[];
  feedback: any[];
}

interface DesignViewerPageProps {
  design: Design;
}

export function DesignViewerPage({ design }: DesignViewerPageProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const [roiCalculation, setRoiCalculation] = useState<ROICalculationResult | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const hasROIData = design.roi_calculations && design.roi_calculations.length > 0;
  const latestROI = hasROIData ? design.roi_calculations[0] : null;

  const handleROICalculationComplete = (result: ROICalculationResult) => {
    setRoiCalculation(result);
    toast.success('ROI calculation completed');
  };

  const handleRegenerateRequest = async (designId: string, modifications: any) => {
    setIsRegenerating(true);
    try {
      const response = await fetch('/api/designs/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designId,
          modifications,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate design');
      }

      const result = await response.json();

      if (result.success) {
        toast.success(`Generated ${result.data.generationsCreated} new variations`);
        // Refresh the page to show new variations
        window.location.reload();
      } else {
        throw new Error(result.error || 'Regeneration failed');
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      toast.error('Failed to regenerate design');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleExportReport = async () => {
    try {
      // Create a comprehensive report
      const reportData = {
        design: {
          id: design.id,
          prompt: design.input_prompt,
          created: design.created_at,
          model: design.ai_model_used,
          variations: design.design_outputs.length,
        },
        roi: roiCalculation || latestROI,
        preferences: design.preferences,
      };

      // For now, download as JSON - could be enhanced to PDF
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inndesign-report-${design.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Design Analysis</h1>
            <p className="text-muted-foreground">
              Created {formatDate(design.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={design.status === 'COMPLETED' ? 'default' : 'secondary'}>
            {design.status}
          </Badge>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Design Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Design Overview</CardTitle>
          <CardDescription>
            AI-generated interior design with ROI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">AI Model</p>
              <p className="font-medium">{design.ai_model_used}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Variations</p>
              <p className="font-medium">{design.design_outputs.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Room Type</p>
              <p className="font-medium capitalize">
                {design.preferences?.room_type?.replace('_', ' ') || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Budget</p>
              <p className="font-medium">
                {design.preferences?.budget
                  ? `$${design.preferences.budget.toLocaleString()}`
                  : 'Not specified'
                }
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Original Prompt</p>
            <p className="text-sm bg-muted p-3 rounded">{design.input_prompt}</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="roi-calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            ROI Calculator
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <DesignPreview
            design={design}
            onRegenerateRequest={handleRegenerateRequest}
          />
        </TabsContent>

        {/* ROI Calculator Tab */}
        <TabsContent value="roi-calculator" className="space-y-6">
          <ROICalculator
            designId={design.id}
            initialData={{
              roomType: design.preferences?.room_type || 'living_room',
              roomSize: design.preferences?.size || 'medium',
              style: design.preferences?.style_preference || 'modern',
              currentPropertyValue: 500000, // Default value
              squareFootage: 200, // Default value
              qualityLevel: 'mid-range',
            }}
            onCalculationComplete={handleROICalculationComplete}
          />
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {(roiCalculation || hasROIData) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CostBreakdown
                breakdown={roiCalculation?.costBreakdown || JSON.parse(latestROI?.cost_breakdown || '{}')}
              />
              <ROIMetrics
                metrics={roiCalculation?.roiMetrics || {
                  totalInvestment: latestROI?.estimated_cost || 0,
                  estimatedValueIncrease: latestROI?.estimated_cost * (latestROI?.roi_percentage / 100) || 0,
                  roiPercentage: latestROI?.roi_percentage || 0,
                  paybackTimelineMonths: parseInt(latestROI?.payback_timeline?.replace(' months', '') || '0'),
                  annualReturn: 0,
                  fiveYearProjection: 0,
                }}
              />
              {roiCalculation && (
                <div className="lg:col-span-2">
                  <IndustryBenchmarks
                    comparison={roiCalculation.marketComparison}
                    userMetrics={roiCalculation.roiMetrics}
                  />
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Calculator className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">No ROI Analysis Available</h3>
                    <p className="text-sm text-muted-foreground">
                      Calculate ROI to see detailed cost breakdown and market analysis
                    </p>
                  </div>
                  <Button onClick={() => setActiveTab('roi-calculator')}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate ROI
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Design Preferences</CardTitle>
                <CardDescription>Original design preferences used for generation</CardDescription>
              </CardHeader>
              <CardContent>
                {design.preferences ? (
                  <div className="space-y-3">
                    {Object.entries(design.preferences)
                      .filter(([key, value]) =>
                        value && !['id', 'design_id', 'created_at', 'updated_at'].includes(key)
                      )
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {typeof value === 'number'
                              ? key === 'budget'
                                ? `$${value.toLocaleString()}`
                                : value
                              : String(value)}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No preferences recorded</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generation Parameters</CardTitle>
                <CardDescription>Technical details of the AI generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">AI Model:</span>
                    <span className="text-sm text-muted-foreground">{design.ai_model_used}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Created:</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(design.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Updated:</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(design.updated_at)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={design.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {design.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback & Rating</CardTitle>
              <CardDescription>Rate this design and provide feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {design.feedback && design.feedback.length > 0 ? (
                <div className="space-y-3">
                  {design.feedback.map((fb: any) => (
                    <div key={fb.id} className="border-l-2 border-primary pl-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Rating: {fb.rating}/5</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(fb.created_at)}
                        </span>
                      </div>
                      {fb.comments && (
                        <p className="text-sm text-muted-foreground mt-1">{fb.comments}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No feedback provided yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}