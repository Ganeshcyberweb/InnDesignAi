'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Share2,
  Heart,
  MoreHorizontal,
  Maximize2,
  Grid3X3,
  SplitSquareHorizontal,
  RefreshCw
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { VariationToggle } from './VariationToggle';
import { BeforeAfterView } from './BeforeAfterView';
import { MetricsOverlay } from './MetricsOverlay';
import { ZoomableImage } from './ZoomableImage';
import { ComparisonMode } from './ComparisonMode';
import { RegenerationPanel } from './RegenerationPanel';
import { toast } from 'sonner';

interface DesignOutput {
  id: string;
  output_image_url: string;
  variation_name: string | null;
  generation_parameters: any;
  created_at: string;
}

interface Design {
  id: string;
  input_prompt: string;
  uploaded_image_url: string | null;
  ai_model_used: string;
  status: string;
  created_at: string;
  preferences?: any;
  design_outputs: DesignOutput[];
  roi_calculation?: any;
}

interface DesignPreviewProps {
  design: Design;
  onDesignUpdate?: (updatedDesign: Design) => void;
  onRegenerateRequest?: (designId: string, modifications: any) => void;
  className?: string;
}

type ViewMode = 'single' | 'grid' | 'comparison' | 'beforeAfter';

export function DesignPreview({
  design,
  onDesignUpdate,
  onRegenerateRequest,
  className = '',
}: DesignPreviewProps) {
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [showMetrics, setShowMetrics] = useState(false);
  const [showRegenerationPanel, setShowRegenerationPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedVariation = design.design_outputs[selectedVariationIndex];
  const hasMultipleVariations = design.design_outputs.length > 1;
  const hasOriginalImage = !!design.uploaded_image_url;

  // Load favorites status
  useEffect(() => {
    // TODO: Check if design is favorited
    setIsFavorited(false);
  }, [design.id]);

  const handleDownload = async () => {
    if (!selectedVariation) return;

    try {
      const response = await fetch(selectedVariation.output_image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inndesign-${design.id}-${selectedVariation.variation_name || 'variation'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Design downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download design');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `InnDesign - ${design.input_prompt}`,
          text: 'Check out this AI-generated interior design!',
          url: `${window.location.origin}/designs/${design.id}`,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${window.location.origin}/designs/${design.id}`);
      toast.success('Design link copied to clipboard');
    }
  };

  const handleToggleFavorite = async () => {
    try {
      // TODO: Implement favorite toggle API
      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Favorite error:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleRegenerateWithModifications = async (modifications: any) => {
    if (!onRegenerateRequest) return;

    setIsLoading(true);
    try {
      await onRegenerateRequest(design.id, modifications);
      setShowRegenerationPanel(false);
      toast.success('Regeneration started');
    } catch (error) {
      console.error('Regeneration error:', error);
      toast.error('Failed to start regeneration');
    } finally {
      setIsLoading(false);
    }
  };

  const ViewModeSelector = () => (
    <div className="flex gap-1">
      <Button
        variant={viewMode === 'single' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('single')}
        className="px-2"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
      {hasMultipleVariations && (
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
          className="px-2"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
      )}
      {hasMultipleVariations && (
        <Button
          variant={viewMode === 'comparison' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('comparison')}
          className="px-2"
        >
          <SplitSquareHorizontal className="h-4 w-4" />
        </Button>
      )}
      {hasOriginalImage && (
        <Button
          variant={viewMode === 'beforeAfter' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('beforeAfter')}
          className="px-2"
        >
          Before/After
        </Button>
      )}
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {design.ai_model_used}
          </Badge>
          <Badge variant={design.status === 'COMPLETED' ? 'default' : 'secondary'}>
            {design.status}
          </Badge>
          {design.design_outputs.length > 0 && (
            <Badge variant="outline">
              {design.design_outputs.length} variations
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ViewModeSelector />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMetrics(!showMetrics)}
          >
            Metrics
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRegenerationPanel(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Regenerate
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleFavorite}>
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current text-destructive' : ''}`} />
                {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="relative">
        <Card>
          <CardContent className="p-0">
            {/* Variation Selector */}
            {hasMultipleVariations && viewMode !== 'comparison' && (
              <div className="p-4 border-b">
                <VariationToggle
                  variations={design.design_outputs}
                  selectedIndex={selectedVariationIndex}
                  onVariationSelect={setSelectedVariationIndex}
                />
              </div>
            )}

            {/* Content Area */}
            <div className="relative">
              {viewMode === 'single' && selectedVariation && (
                <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer">
                      <ZoomableImage
                        src={selectedVariation.output_image_url}
                        alt={selectedVariation.variation_name || 'Design variation'}
                        className="w-full"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
                    <ZoomableImage
                      src={selectedVariation.output_image_url}
                      alt={selectedVariation.variation_name || 'Design variation'}
                      className="w-full h-full"
                      enablePanZoom
                    />
                  </DialogContent>
                </Dialog>
              )}

              {viewMode === 'grid' && (
                <div className="grid grid-cols-2 gap-4 p-4">
                  {design.design_outputs.map((output, index) => (
                    <div
                      key={output.id}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-colors ${
                        index === selectedVariationIndex
                          ? 'border-primary'
                          : 'border-transparent hover:border-muted'
                      }`}
                      onClick={() => setSelectedVariationIndex(index)}
                    >
                      <img
                        src={output.output_image_url}
                        alt={output.variation_name || `Variation ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-sm font-medium">
                          {output.variation_name || `Variation ${index + 1}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'comparison' && hasMultipleVariations && (
                <ComparisonMode
                  variations={design.design_outputs}
                  onVariationSelect={setSelectedVariationIndex}
                />
              )}

              {viewMode === 'beforeAfter' && hasOriginalImage && selectedVariation && (
                <BeforeAfterView
                  beforeImage={design.uploaded_image_url!}
                  afterImage={selectedVariation.output_image_url}
                  onImageClick={() => setIsFullscreen(true)}
                />
              )}

              {/* Metrics Overlay */}
              {showMetrics && design.roi_calculation && (
                <MetricsOverlay
                  roiData={design.roi_calculation}
                  onClose={() => setShowMetrics(false)}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Design Prompt</h3>
              <p className="text-sm text-muted-foreground">{design.input_prompt}</p>
            </div>

            {selectedVariation?.generation_parameters && (
              <div>
                <h4 className="font-medium mb-2">Generation Parameters</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  {Object.entries(selectedVariation.generation_parameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Created: {new Date(design.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regeneration Panel */}
      {showRegenerationPanel && (
        <RegenerationPanel
          design={design}
          onRegenerate={handleRegenerateWithModifications}
          onClose={() => setShowRegenerationPanel(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default DesignPreview;