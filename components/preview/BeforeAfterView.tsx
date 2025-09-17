'use client';

import React, { useState, useRef } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Maximize2, RotateCcw, Download, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface BeforeAfterViewProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  onImageClick?: () => void;
  showControls?: boolean;
  className?: string;
}

export function BeforeAfterView({
  beforeImage,
  afterImage,
  beforeLabel = 'Original',
  afterLabel = 'AI Generated',
  onImageClick,
  showControls = true,
  className = '',
}: BeforeAfterViewProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sliderRef = useRef<any>(null);

  const handleReset = () => {
    setSliderPosition(50);
    if (sliderRef.current) {
      sliderRef.current.setPosition(50);
    }
  };

  const handleDownload = async () => {
    try {
      // Create a canvas to combine both images
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const beforeImg = new Image();
      const afterImg = new Image();

      beforeImg.crossOrigin = 'anonymous';
      afterImg.crossOrigin = 'anonymous';

      await Promise.all([
        new Promise((resolve) => {
          beforeImg.onload = resolve;
          beforeImg.src = beforeImage;
        }),
        new Promise((resolve) => {
          afterImg.onload = resolve;
          afterImg.src = afterImage;
        }),
      ]);

      const width = Math.max(beforeImg.width, afterImg.width);
      const height = Math.max(beforeImg.height, afterImg.height);

      canvas.width = width * 2 + 20; // Side by side with gap
      canvas.height = height + 60; // Extra space for labels

      if (!ctx) return;

      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw images
      ctx.drawImage(beforeImg, 0, 40, width, height);
      ctx.drawImage(afterImg, width + 20, 40, width, height);

      // Add labels
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(beforeLabel, width / 2, 25);
      ctx.fillText(afterLabel, width + 20 + (width / 2), 25);

      // Download
      const link = document.createElement('a');
      link.download = 'before-after-comparison.png';
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
          title: 'Before & After - InnDesign AI',
          text: 'Check out this amazing transformation!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const CompareSliderComponent = ({ fullscreen = false }: { fullscreen?: boolean }) => (
    <div className={`relative ${fullscreen ? 'h-[80vh]' : 'h-96'}`}>
      <ReactCompareSlider
        ref={sliderRef}
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt={beforeLabel}
            style={{ objectFit: 'cover' }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt={afterLabel}
            style={{ objectFit: 'cover' }}
          />
        }
        position={sliderPosition}
        onPositionChange={setSliderPosition}
        style={{
          height: '100%',
          width: '100%',
        }}
        handle={
          <div className="w-8 h-8 bg-white border-2 border-primary rounded-full shadow-lg flex items-center justify-center">
            <div className="w-1 h-4 bg-primary rounded-full" />
          </div>
        }
        portrait={false}
      />

      {/* Image Labels */}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-black/60 text-white">
          {beforeLabel}
        </Badge>
      </div>
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-black/60 text-white">
          {afterLabel}
        </Badge>
      </div>

      {/* Slider Position Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Badge variant="outline" className="bg-white/90">
          {Math.round(sliderPosition)}% | {Math.round(100 - sliderPosition)}%
        </Badge>
      </div>
    </div>
  );

  return (
    <div className={className}>
      <Card>
        {showControls && (
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Before & After Comparison
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
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
                <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Maximize2 className="h-4 w-4" />
                      Fullscreen
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] max-h-[95vh] p-4">
                    <CompareSliderComponent fullscreen />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent className={showControls ? '' : 'p-0'}>
          <div
            className="cursor-pointer"
            onClick={onImageClick}
          >
            <CompareSliderComponent />
          </div>

          {/* Usage Instructions */}
          {showControls && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <p className="font-medium">How to use:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Drag the slider to compare before and after</li>
                    <li>• Click and hold to see the difference</li>
                    <li>• Use fullscreen for detailed comparison</li>
                  </ul>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-medium">Quick Stats:</p>
                  <div className="text-muted-foreground space-y-1">
                    <div>Slider: {Math.round(sliderPosition)}%</div>
                    <div>Before: {Math.round(100 - sliderPosition)}%</div>
                    <div>After: {Math.round(sliderPosition)}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BeforeAfterView;