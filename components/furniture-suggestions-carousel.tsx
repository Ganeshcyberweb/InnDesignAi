"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useFurnitureSuggestions } from '@/hooks/use-furniture-suggestions';
import { useDesignFormStore } from '@/stores/design-form-store';
import { formatPrice } from '@/lib/utils/budget-parser';
import { cn } from '@/lib/utils';
import type { FurnitureProduct } from '@/types/furniture';

interface FurnitureSuggestionsCarouselProps {
  className?: string;
  budgetRange?: string;
  roomType?: string;
  defaultExpanded?: boolean;
}

export function FurnitureSuggestionsCarousel({
  className,
  budgetRange,
  roomType,
  defaultExpanded = true
}: FurnitureSuggestionsCarouselProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const { products, loading, error, refetch } = useFurnitureSuggestions({
    budgetRange,
    roomType,
    limit: 16
  });

  const { addFurnitureItem, isFurnitureItemSelected } = useDesignFormStore();

  return (
    <div className={cn("w-full max-w-[1000px]", className)}>
      {/* Header with Expand/Collapse Button */}
      <div className="flex items-center justify-between mb-3 mx-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs font-medium text-stone-900 hover:text-stone-700 transition-colors"
        >
          <span>Furniture Suggestions</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs text-red-600 mr-2">Error loading</span>
          )}
          <Button
            onClick={refetch}
            variant="ghost"
            size="sm"
            className="text-stone-700 hover:text-stone-900 h-7 px-2 text-xs"
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {error ? (
              <div className="text-center py-4 text-red-600 text-sm">
                {error}
              </div>
            ) : loading ? (
              <LoadingSkeleton />
            ) : products.length > 0 ? (
              <div className="mb-2">
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-1">
                    {products.map((product) => (
                      <CarouselItem key={product.id} className="pl-1 basis-[100px]">
                        <ProductCard
                          product={product}
                          isSelected={isFurnitureItemSelected(product.id)}
                          onSelect={() => addFurnitureItem(product)}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-1 h-7 w-7" />
                  <CarouselNext className="right-1 h-7 w-7" />
                </Carousel>
              </div>
            ) : (
              <div className="text-center py-4 text-stone-500">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-stone-300" />
                <p className="text-sm">No suggestions available</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ProductCardProps {
  product: FurnitureProduct;
  isSelected: boolean;
  onSelect: () => void;
}

function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const currentPrice = product.discount_price || product.price;

  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Square Container */}
      <div className="relative w-[90px] h-[90px] rounded-lg overflow-hidden bg-stone-50 border border-stone-200 hover:shadow-md transition-all duration-200">
        {/* Product Image */}
        {!imageError ? (
          <img
            src={product.image_path}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-100">
            <Info className="h-6 w-6 text-stone-400" />
          </div>
        )}

        {/* Add Button - Shows on Hover */}
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="sm"
            className={cn(
              "h-7 w-7 p-0 rounded-full",
              isSelected
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-white hover:bg-stone-100 text-stone-900"
            )}
            disabled={isSelected}
          >
            {isSelected ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </motion.div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-1 right-1">
            <div className="h-3 w-3 bg-green-500 rounded-full border border-white"></div>
          </div>
        )}
      </div>

      {/* Price - Below the image */}
      <div className="mt-1 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="font-medium text-stone-900 text-xs">
            {formatPrice(currentPrice)}
          </span>
          {product.discount_price && (
            <span className="text-xs text-stone-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex-shrink-0">
          <Skeleton className="w-[90px] h-[90px] rounded-lg" />
          <Skeleton className="h-3 w-12 mt-1 mx-auto" />
        </div>
      ))}
    </div>
  );
}