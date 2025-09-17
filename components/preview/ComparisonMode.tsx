'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCw, Grid2X2, SplitSquareHorizontal, Download, Share2 } from 'lucide-react';
import { ZoomableImage } from './ZoomableImage';

interface DesignOutput {
  id: string;
  output_image_url: string;
  variation_name: string | null;
  generation_parameters: any;
  created_at: string;
}

interface ComparisonModeProps {
  variations: DesignOutput[];
  onVariationSelect?: (index: number) => void;
  defaultLayout?: 'side-by-side' | 'grid' | 'overlay';
  className?: string;
}

type ComparisonLayout = 'side-by-side' | 'grid' | 'overlay';

export function ComparisonMode({
  variations,
  onVariationSelect,
  defaultLayout = 'side-by-side',
  className = '',
}: ComparisonModeProps) {
  const [layout, setLayout] = useState<ComparisonLayout>(defaultLayout);
  const [selectedVariations, setSelectedVariations] = useState<number[]>([0, 1]);
  const [syncZoom, setSyncZoom] = useState(true);

  // Ensure we have at least 2 variations
  useEffect(() => {
    if (variations.length >= 2) {
      setSelectedVariations([0, 1]);
    }
  }, [variations]);

  const handleVariationChange = (position: number, variationIndex: number) => {
    const newSelections = [...selectedVariations];
    newSelections[position] = variationIndex;
    setSelectedVariations(newSelections);

    if (onVariationSelect) {
      onVariationSelect(variationIndex);
    }
  };

  const handleSwapVariations = () => {
    setSelectedVariations([selectedVariations[1], selectedVariations[0]]);
  };

  const handleDownloadComparison = async () => {
    try {
      // Create a canvas to combine selected images
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const images = await Promise.all(
        selectedVariations.map(index => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.src = variations[index].output_image_url;
          });
        })
      );

      const maxWidth = Math.max(...images.map(img => img.width));
      const maxHeight = Math.max(...images.map(img => img.height));

      if (layout === 'side-by-side') {
        canvas.width = maxWidth * 2 + 40; // Gap between images
        canvas.height = maxHeight + 60; // Space for labels
      } else {
        canvas.width = maxWidth * 2;
        canvas.height = maxHeight * 2;
      }

      if (!ctx) return;

      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw images based on layout
      if (layout === 'side-by-side') {
        ctx.drawImage(images[0], 0, 40, maxWidth, maxHeight);
        ctx.drawImage(images[1], maxWidth + 40, 40, maxWidth, maxHeight);

        // Add labels
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          variations[selectedVariations[0]].variation_name || `Variation ${selectedVariations[0] + 1}`,
          maxWidth / 2,
          25
        );
        ctx.fillText(
          variations[selectedVariations[1]].variation_name || `Variation ${selectedVariations[1] + 1}`,
          maxWidth + 40 + (maxWidth / 2),
          25
        );
      } else {
        // Grid layout
        ctx.drawImage(images[0], 0, 0, maxWidth, maxHeight);
        ctx.drawImage(images[1], maxWidth, 0, maxWidth, maxHeight);
      }

      // Download
      const link = document.createElement('a');
      link.download = `inndesign-comparison-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Design Comparison - InnDesign AI',
          text: 'Compare these AI-generated design variations!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const getVariationLabel = (variation: DesignOutput, index: number) => {
    return variation.variation_name || `Variation ${index + 1}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (variations.length < 2) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>At least 2 variations are needed for comparison.</p>
            <p className="text-sm mt-1">Generate more variations to enable comparison mode.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Layout:</span>
              <div className="flex gap-1">
                <Button
                  variant={layout === 'side-by-side' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLayout('side-by-side')}
                >
                  <SplitSquareHorizontal className="h-4 w-4" />
                </Button>
                <Button
                  variant={layout === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLayout('grid')}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwapVariations}
              >
                <RotateCw className="h-4 w-4" />
                Swap
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadComparison}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Variation Selectors */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Left/Top Variation:</label>
              <Select
                value={selectedVariations[0].toString()}
                onValueChange={(value) => handleVariationChange(0, parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variations.map((variation, index) => (
                    <SelectItem key={variation.id} value={index.toString()}>
                      {getVariationLabel(variation, index)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Right/Bottom Variation:</label>
              <Select
                value={selectedVariations[1].toString()}
                onValueChange={(value) => handleVariationChange(1, parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variations.map((variation, index) => (
                    <SelectItem key={variation.id} value={index.toString()}>
                      {getVariationLabel(variation, index)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison View */}
      <Card>
        <CardContent className="p-0">
          <div className={`grid ${layout === 'side-by-side' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2'} gap-2`}>
            {selectedVariations.map((variationIndex, position) => {
              const variation = variations[variationIndex];
              return (
                <div key={`${variation.id}-${position}`} className="relative">
                  {/* Image */}
                  <div className="relative">
                    <ZoomableImage
                      src={variation.output_image_url}
                      alt={getVariationLabel(variation, variationIndex)}
                      className="w-full h-64 md:h-96"
                      enablePanZoom={true}
                    />

                    {/* Overlay Info */}
                    <div className="absolute top-2 left-2 right-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-black/60 text-white">
                          {getVariationLabel(variation, variationIndex)}
                        </Badge>
                        <Badge variant="outline" className="bg-white/90">
                          {position === 0 ? (layout === 'side-by-side' ? 'Left' : 'Top') :
                           (layout === 'side-by-side' ? 'Right' : 'Bottom')}
                        </Badge>
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/60 text-white rounded px-2 py-1 text-xs">
                        <div>Created: {formatDate(variation.created_at)}</div>
                        {variation.generation_parameters && (
                          <div>
                            Model: {variation.generation_parameters.model ||
                                   variation.generation_parameters.aiProvider || 'Unknown'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Info Panel */}
                  <div className="p-4 space-y-2">
                    <h4 className="font-medium">{getVariationLabel(variation, variationIndex)}</h4>

                    {variation.generation_parameters && (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {variation.generation_parameters.modifications && (
                          <div>
                            <span className="font-medium">Modified:</span> Yes
                          </div>
                        )}
                        {variation.generation_parameters.guidance_scale && (
                          <div>
                            <span className="font-medium">Guidance:</span> {variation.generation_parameters.guidance_scale}
                          </div>
                        )}
                        {variation.generation_parameters.num_inference_steps && (
                          <div>
                            <span className="font-medium">Steps:</span> {variation.generation_parameters.num_inference_steps}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Generated: {formatDate(variation.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Analysis */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">Comparison Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium">
                {getVariationLabel(variations[selectedVariations[0]], selectedVariations[0])}
              </h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Generated: {formatDate(variations[selectedVariations[0]].created_at)}</li>
                {variations[selectedVariations[0]].generation_parameters?.model && (
                  <li>• Model: {variations[selectedVariations[0]].generation_parameters.model}</li>
                )}
                {variations[selectedVariations[0]].generation_parameters?.modifications && (
                  <li>• Type: Regenerated variant</li>
                )}
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium">
                {getVariationLabel(variations[selectedVariations[1]], selectedVariations[1])}
              </h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Generated: {formatDate(variations[selectedVariations[1]].created_at)}</li>
                {variations[selectedVariations[1]].generation_parameters?.model && (
                  <li>• Model: {variations[selectedVariations[1]].generation_parameters.model}</li>
                )}
                {variations[selectedVariations[1]].generation_parameters?.modifications && (
                  <li>• Type: Regenerated variant</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Use the zoom and pan features on each image to examine details.
              Click and drag to move around, scroll to zoom, or use the control buttons.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComparisonMode;