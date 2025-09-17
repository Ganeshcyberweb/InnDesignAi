'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Move, Maximize2 } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  enablePanZoom?: boolean;
  initialZoom?: number;
  maxZoom?: number;
  minZoom?: number;
  showControls?: boolean;
  onImageLoad?: () => void;
}

export function ZoomableImage({
  src,
  alt,
  className = '',
  enablePanZoom = false,
  initialZoom = 1,
  maxZoom = 5,
  minZoom = 0.5,
  showControls = true,
  onImageLoad,
}: ZoomableImageProps) {
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    if (imageRef.current) {
      setDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
    onImageLoad?.();
  }, [onImageLoad]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, maxZoom));
  }, [maxZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, minZoom));
  }, [minZoom]);

  const handleReset = useCallback(() => {
    setZoom(initialZoom);
    setPosition({ x: 0, y: 0 });
  }, [initialZoom]);

  const handleFitToContainer = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const { naturalWidth, naturalHeight } = imageRef.current;

    const scaleX = containerRect.width / naturalWidth;
    const scaleY = containerRect.height / naturalHeight;
    const optimalZoom = Math.min(scaleX, scaleY, 1);

    setZoom(optimalZoom);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Mouse/touch event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enablePanZoom) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }, [enablePanZoom, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !enablePanZoom) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, enablePanZoom, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!enablePanZoom) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * delta, minZoom), maxZoom);

    // Zoom towards mouse position
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = newZoom / zoom;
      setPosition(prev => ({
        x: mouseX - (mouseX - prev.x) * zoomFactor,
        y: mouseY - (mouseY - prev.y) * zoomFactor,
      }));
    }

    setZoom(newZoom);
  }, [enablePanZoom, zoom, minZoom, maxZoom]);

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enablePanZoom || e.touches.length !== 1) return;

    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  }, [enablePanZoom, position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !enablePanZoom || e.touches.length !== 1) return;

    e.preventDefault();
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  }, [isDragging, enablePanZoom, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Double click to zoom
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!enablePanZoom) return;

    if (zoom === initialZoom) {
      // Zoom in towards click position
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const newZoom = Math.min(zoom * 2, maxZoom);
        const zoomFactor = newZoom / zoom;

        setPosition(prev => ({
          x: clickX - (clickX - prev.x) * zoomFactor,
          y: clickY - (clickY - prev.y) * zoomFactor,
        }));
        setZoom(newZoom);
      }
    } else {
      handleReset();
    }
  }, [enablePanZoom, zoom, initialZoom, maxZoom, handleReset]);

  // Keyboard controls
  useEffect(() => {
    if (!enablePanZoom) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleReset();
          break;
        case 'f':
          e.preventDefault();
          handleFitToContainer();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enablePanZoom, handleZoomIn, handleZoomOut, handleReset, handleFitToContainer]);

  return (
    <div className={`relative overflow-hidden bg-muted/50 ${className}`}>
      {/* Image Container */}
      <div
        ref={containerRef}
        className="w-full h-full relative cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: enablePanZoom ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="block max-w-none transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
          onLoad={handleImageLoad}
          onError={() => setIsLoaded(false)}
          draggable={false}
        />

        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading image...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && enablePanZoom && isLoaded && (
        <div className="absolute top-4 left-4 flex flex-col gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= maxZoom}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= minZoom}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitToContainer}
            className="h-8 w-8 p-0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Zoom indicator */}
      {enablePanZoom && isLoaded && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium shadow-lg">
          {Math.round(zoom * 100)}%
        </div>
      )}

      {/* Pan hint */}
      {enablePanZoom && zoom > 1 && isLoaded && (
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground shadow-lg flex items-center gap-1">
          <Move className="h-3 w-3" />
          Drag to pan
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {enablePanZoom && isLoaded && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground shadow-lg">
          <div>+/- to zoom</div>
          <div>0 to reset</div>
          <div>f to fit</div>
        </div>
      )}
    </div>
  );
}

export default ZoomableImage;