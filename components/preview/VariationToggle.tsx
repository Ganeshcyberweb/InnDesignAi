'use client';

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Clock, Zap } from 'lucide-react';

interface DesignOutput {
  id: string;
  output_image_url: string;
  variation_name: string | null;
  generation_parameters: any;
  created_at: string;
}

interface VariationToggleProps {
  variations: DesignOutput[];
  selectedIndex: number;
  onVariationSelect: (index: number) => void;
  showThumbnails?: boolean;
  className?: string;
}

export function VariationToggle({
  variations,
  selectedIndex,
  onVariationSelect,
  showThumbnails = true,
  className = '',
}: VariationToggleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected variation
  useEffect(() => {
    if (scrollRef.current) {
      const selectedElement = scrollRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedIndex]);

  const handlePrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : variations.length - 1;
    onVariationSelect(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedIndex < variations.length - 1 ? selectedIndex + 1 : 0;
    onVariationSelect(newIndex);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getVariationLabel = (variation: DesignOutput, index: number) => {
    return variation.variation_name || `Variation ${index + 1}`;
  };

  const getGenerationInfo = (parameters: any) => {
    if (!parameters) return null;

    const info = {
      model: parameters.model || parameters.aiProvider,
      steps: parameters.num_inference_steps,
      guidance: parameters.guidance_scale,
      isRegenerated: !!parameters.modifications,
    };

    return info;
  };

  if (variations.length <= 1) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={variations.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium">
            {selectedIndex + 1} of {variations.length}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={variations.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {getVariationLabel(variations[selectedIndex], selectedIndex)}
        </div>
      </div>

      {/* Thumbnail Selector */}
      {showThumbnails && (
        <ScrollArea className="w-full">
          <div
            ref={scrollRef}
            className="flex gap-3 pb-2"
            style={{ minWidth: `${variations.length * 120}px` }}
          >
            {variations.map((variation, index) => {
              const isSelected = index === selectedIndex;
              const generationInfo = getGenerationInfo(variation.generation_parameters);

              return (
                <div
                  key={variation.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'
                  }`}
                  onClick={() => onVariationSelect(index)}
                >
                  <div className="w-28 space-y-2">
                    {/* Thumbnail */}
                    <div className="relative">
                      <img
                        src={variation.output_image_url}
                        alt={getVariationLabel(variation, index)}
                        className="w-full h-20 object-cover rounded-lg border"
                      />

                      {/* Overlay badges */}
                      <div className="absolute top-1 right-1 flex gap-1">
                        {generationInfo?.isRegenerated && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            <Zap className="h-2 w-2 mr-1" />
                            New
                          </Badge>
                        )}
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium truncate">
                        {getVariationLabel(variation, index)}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(variation.created_at)}
                      </div>

                      {generationInfo?.model && (
                        <Badge variant="outline" className="text-xs px-1 py-0 truncate">
                          {generationInfo.model}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      {/* Quick Actions for Selected Variation */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selected:</span>
          <Badge variant="outline">
            {getVariationLabel(variations[selectedIndex], selectedIndex)}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {/* Generation info */}
          {(() => {
            const info = getGenerationInfo(variations[selectedIndex].generation_parameters);
            return info && (
              <div className="text-xs text-muted-foreground">
                {info.steps && `${info.steps} steps`}
                {info.guidance && ` • ${info.guidance} guidance`}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-muted-foreground text-center opacity-60">
        Use ← → keys to navigate between variations
      </div>
    </div>
  );
}

export default VariationToggle;